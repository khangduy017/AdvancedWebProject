import mongoose from 'mongoose';
import Class from '../models/classModel.js';
import User from '../models/userModel.js';
import Grade from '../models/GradeModel.js';
import catchAsync from '../utils/catchAsync.js';
import sendMail from '../utils/mailer.js';
import Validator from '../utils/validator.js';
import REGEX from '../constants/regex.js';
import Post from '../models/postModel.js';

const getAllClass = catchAsync(async (req, res, next) => {
    const _class = await Class.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'student',
                foreignField: '_id',
                as: 'student',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'teacher',
                foreignField: '_id',
                as: 'teacher',
            },
        },
        {
            $match: {
                $or: [
                    {
                        'student._id': new mongoose.Types.ObjectId(req.body._id),
                    },
                    {
                        'teacher._id': new mongoose.Types.ObjectId(req.body._id),
                    },
                ],
            },
        },
    ]);

    for (let i = 0; i < _class.length; i++) {
        let getRecentTitlePost = await Post.find({ classId: _class[i]._id.toString() });
        if (getRecentTitlePost.length !== 0) {
            if (getRecentTitlePost.length > 4)
                getRecentTitlePost = getRecentTitlePost.slice(getRecentTitlePost.length - 4);
            _class[i].recentTitleTopic = [...getRecentTitlePost];
        } else {
            _class[i].recentTitleTopic = [];
        }
    }

    res.status(200).json({
        status: 'success',
        value: _class,
    });
});

const createClass = catchAsync(async (req, res, next) => {
    let code = Math.floor(10000 + Math.random() * 90000);

    while (1) {
        const _class = await Class.findOne({ inviteCode: code });
        if (_class) {
            code = Math.floor(10000 + Math.random() * 90000);
        } else break;
    }

    const user = await User.findById(req.body.user);

    const newGrade = await Grade.create({
        structure: [],
        students: [],
        grades: [],
    });

    const newClass = await Class.create({
        teacher: [req.body.user], // _id of user create class
        student: [],
        owner: user.username,
        title: req.body.title,
        content: req.body.content,
        topic: req.body.topic,
        post: [],
        inviteCode: code,
        inviteLink: req.body.inviteLink,
        grade: newGrade._id,
        background: req.body.color,
    });

    user.class.unshift(newClass._id);
    user.save();

    res.status(200).json({
        status: 'success',
        value: newClass,
    });
});

const getAllClassAllAccount = catchAsync(async (req, res, next) => {
    const _class = await Class.find();

    res.status(200).json({
        status: 'success',
        value: _class,
    });
});

const getClassDetail = catchAsync(async (req, res, next) => {
    const _class = await Class.findById(req.params['id']);

    res.status(200).json({
        status: 'success',
        value: _class,
    });
});

const getClassByCode = catchAsync(async (req, res, next) => {
    const _class = await Class.findOne({ inviteCode: req.body.code });

    if (!_class) {
        return res.status(200).json({
            status: 'failed',
            value: 'The class does not exist',
        });
    }

    const user = await User.findById(req.body.id);

    res.status(200).json({
        status: 'success',
        value: _class,
        already_in_class: user.class.includes(_class._id.toString()),
    });
});

const getClassById = catchAsync(async (req, res, next) => {
    const _class = await Class.findById(req.body.id);
    const user = await User.findById(req.body.user_id);

    res.status(200).json({
        status: 'success',
        value: _class,
        already_in_class: user.class.includes(_class._id.toString()),
    });
});

const updateClassStatus = catchAsync(async (req, res, next) => {
    const getClass = await Class.findOne({ _id: req.body.id });
    await Class.updateOne({ _id: req.body.id }, { active: !getClass.active });
    const _class = await Class.find();
    res.status(200).json({
        status: 'success',
        value: _class,
    });
});

const getClassByEmail = catchAsync(async (req, res, next) => {
    if (!Validator.isMatching(req.body.email, REGEX.EMAIL)) {
        return res.status(200).json({
            status: 'failed',
            value: 'Invalid email address',
        });
    }

    await sendMail(req.body.email, 'Invite link', 'Link: ' + req.body.link);

    res.status(200).json({
        status: 'success',
    });
});

const joinClass = catchAsync(async (req, res, next) => {
    const _class = await Class.findById(req.body.classId);
    const _user = await User.findById(req.body.userId);

    if (_user.role === 'teacher') {
        _class.teacher.unshift(req.body.userId);
    } else {
        _class.student.unshift(req.body.userId);
    }
    _class.save();

    _user.class.unshift(req.body.classId);
    _user.save();

    res.status(200).json({
        status: 'success',
        value: req.body.classId,
    });
});

const outClass = catchAsync(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
    });
});

const getClassMember = catchAsync(async (req, res, next) => {
    const _class = await Class.findById(req.body.id);
    const teachers = [];
    const students = [];
    if (_class) {
        for (let i of _class.teacher) {
            const teacher = await User.findById(i);
            teachers.push(teacher);
        }

        for (let i of _class.student) {
            const student = await User.findById(i);
            students.push(student);
        }
    }

    res.status(200).json({
        status: 'success',
        teachers,
        students,
    });
});

const getClassBySearch = catchAsync(async (req, res) => {
    let getClass = [];
    if(req.body.searchInput === ''){
         getClass = await Class.find();
    }
    else{
        getClass = await Class.find({ $text: { $search: req.body.searchInput } });
    }
    res.status(200).json({
        status: 'success',
        value: getClass,
    });
});

const getClassBySearchCustomer = catchAsync(async (req, res) => {
    // const _class = await Class.find({ $text: { $search: req.body.searchInput } });
    // let getClass = [];

    // for (let i = 0; i < _class.length; i++) {
    //     getClass.push(_class[i].toObject())
    //     let getRecentTitlePost = await Post.find({ classId: getClass[i]._id.toString() });
    //     if (getRecentTitlePost.length !== 0) {
    //         if (getRecentTitlePost.length > 4)
    //             getRecentTitlePost = getRecentTitlePost.slice(getRecentTitlePost.length - 4);
    //             getClass[i].recentTitleTopic = [...getRecentTitlePost];
    //     } else {
    //         getClass[i].recentTitleTopic = [];
    //     }
    // }

    // res.status(200).json({
    //     status: 'success',
    //     value: getClass,
    // });

    const getClass = await Class.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'student',
                foreignField: '_id',
                as: 'student',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'teacher',
                foreignField: '_id',
                as: 'teacher',
            },
        },
        {
            $match: {
                $or: [
                    {
                        'student._id': new mongoose.Types.ObjectId(req.body._id),
                    },
                    {
                        'teacher._id': new mongoose.Types.ObjectId(req.body._id),
                    },
                ],
            },
        },
    ]);

    let _class = [];
    if (req.body.searchInput === '') {
        _class = [...getClass]
    } else {
        _class = getClass.filter((el) => el.title.toLowerCase() === req.body.searchInput.toLowerCase());
    }
    for (let i = 0; i < _class.length; i++) {
        let getRecentTitlePost = await Post.find({ classId: _class[i]._id.toString() });
        if (getRecentTitlePost.length !== 0) {
            if (getRecentTitlePost.length > 4)
                getRecentTitlePost = getRecentTitlePost.slice(getRecentTitlePost.length - 4);
            _class[i].recentTitleTopic = [...getRecentTitlePost];
        } else {
            _class[i].recentTitleTopic = [];
        }
    }

    res.status(200).json({
        status: 'success',
        value: _class,
    });
});

export default {
    getAllClassAllAccount,
    updateClassStatus,
    getAllClass,
    createClass,
    getClassDetail,
    joinClass,
    outClass,
    getClassByCode,
    getClassByEmail,
    getClassMember,
    getClassById,
    getClassBySearch,
    getClassBySearchCustomer,
};
