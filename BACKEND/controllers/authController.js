import User from '../models/userModel.js';
import Student from '../models/studentModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import jwt from 'jsonwebtoken';
import Validator from '../utils/validator.js';
import REGEX from '../constants/regex.js';
import { promisify } from 'util';
import sendMail from '../utils/mailer.js';

const expiresTime = 3 * 24 * 3600 * 1000;
let verifyCode = '';

const signToken = function (id) {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: expiresTime,
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    // res.cookie('jwt', token, {
    //   expires: new Date(Date.now() + 30 * 24 * 3600 * 1000),
    //   // secure: true,
    //   httpOnly: true,
    // })

    user.password = '';

    return res.status(statusCode).json({
        status: 'success',
        token,
        expiresTime,
        data: { user },
    });
};

const register = catchAsync(async (req, res, next) => {
    // // Validate request body
    // if (!Validator.isValidRequestBody(req.body, ['email', 'password', 'passwordConfirm']))
    //     return next(new AppError("Bad request", 400));

    // Validate phonenumber, password and password confirm
    const { email, password, passwordConfirm } = req.body;

    if (Validator.isEmptyString(email) || Validator.isEmptyString(password) || Validator.isEmptyString(passwordConfirm))
        return next(new AppError('Please provide complete information', 400));
    else if (!Validator.isMatching(email, REGEX.EMAIL)) return next(new AppError('Invalid email address', 400));
    else if (password.length < 8) return next(new AppError('Your password is too weak (minimum 8 characters)', 400));
    else if (password !== passwordConfirm) return next(new AppError('Your passwords do not match', 400));

    const founded_user = await User.findOne({ email: email });

    if (founded_user) return next(new AppError('The email already exist', 400));

    verifyCode = Math.floor(100000 + Math.random() * 900000);

    await sendMail(
        email,
        'Your verify code is [' + verifyCode + ']',
        'Use this code to complete the account registration: ' + verifyCode
    );

    res.status(200).json({
        status: 'success',
    });
});

const verifyRegister = catchAsync(async (req, res, next) => {
    const data = req.body.data;
    if (req.body.code === verifyCode.toString()) {
        const newUser = await User.create({
            id: '',
            email: data.email,
            password: data.password,
            type: 'account',
            class: [],
            notify: [],
            role: data.role,
            username: data.username ? data.username : '',
            fullname: '',
            phone: '',
            dob: '',
            googleId: '',
            facebookId: '',
            address: '',
            gender: '',
            avatar: '',
        });
        createSendToken(newUser, 201, res);
    } else {
        return next(new AppError('Verify code is incorrect', 400));
    }
});

const login = catchAsync(async (req, res, next) => {
    const { role, email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('Enter your email and password', 401));
    }

    const user = await User.findOne({ email: email, role: role, active: true }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Email or password is incorrect', 401));
    }

    createSendToken(user, 200, res);
});

const loginGoogle = catchAsync(async (req, res, next) => {
    const token = signToken(req.user._id);
    const data = {
        status: 'success',
        token,
        expiresTime,
        data: { user: req.user },
    };

    res.redirect(
        `${process.env.APP_URL}/login?success&token=` +
        token +
        '&expiresTime=' +
        expiresTime +
        '&userData=' +
        JSON.stringify(req.user)
    );
});

const loginFacebook = catchAsync(async (req, res, next) => {
    const token = signToken(req.user._id);
    const data = {
        status: 'success',
        token,
        expiresTime,
        data: { user: req.user },
    };
    res.redirect(
        `${process.env.APP_URL}/login?success&token=` +
        token +
        '&expiresTime=' +
        expiresTime +
        '&userData=' +
        JSON.stringify(req.user)
    );
});

const forgetPassword = catchAsync(async (req, res, next) => {
    const data = req.body;
    if (data.step === 1) {
        if (!Validator.isMatching(data.email, REGEX.EMAIL)) return next(new AppError('Invalid email address', 400));

        const founded_user = await User.findOne({ email: data.email });

        if (!founded_user) return next(new AppError('The email does not exist', 400));

        verifyCode = Math.floor(100000 + Math.random() * 900000);
        await sendMail(
            data.email,
            'Your verify code is [' + verifyCode + ']',
            'Use this code to complete reset password: ' + verifyCode
        );

        return res.status(200).json({
            status: 'success',
        });
    } else if (data.step === 2) {
        if (data.code === verifyCode.toString()) {
            return res.status(200).json({
                code: data.code,
                status: 'success',
            });
        }
        return next(new AppError('Verify code is incorrect', 400));
    } else {
        if (data.code === verifyCode.toString()) {
            if (data.password.length < 8)
                return next(new AppError('Your password is too weak (minimum 8 characters)', 400));
            else if (data.password !== data.passwordConfirm)
                return next(new AppError('Your passwords do not match', 400));

            const user = await User.findOne({ email: data.email }).select('+password');
            user.password = data.password;
            await user.save();
            return res.status(200).json({
                status: 'success',
            });
        }
        return next(new AppError('Verify code is incorrect', 400));
    }
});

const protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('Please log in to get access.', 401));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password, Please log in again.', 401));
    }

    req.user = currentUser;
    next();
});

const changePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        res.status(200).json({
            status: 'fail',
            message: 'Current password is incorrect',
        });
    } else {
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        await user.save();

        createSendToken(user, 200, res);
    }
});

const editProfile = catchAsync(async (req, res, next) => {
    const userCheck = await User.findOne({ email: req.body.email });

    if (userCheck && userCheck._id.toString() !== req.user._id.toString()) {
        res.status(200).json({
            status: 'fail',
            message: 'Email has been existed',
        });
    } else if (!Validator.isMatching(req.body.email, REGEX.EMAIL)) {
        res.status(200).json({
            status: 'fail',
            message: 'Invalid email address',
        });
    } else {
        const updatedUser = await User.updateOne(
            { _id: req.user._id },
            {
                fullname: req.body.fullname,
                username: req.body.username,
                id: req.body.studentId,
                phone: req.body.phone,
                gender: req.body.gender,
                role: req.body.role,
                email: req.body.email,
                address: req.body.address,
            }
        );

        const userData = await User.findOne({ _id: req.user._id });

        res.status(200).json({
            status: 'success',
            data: userData,
        });
    }
});

const getUser = catchAsync(async (req, res, next) => {
    const userData = await User.findById(req.user._id);

    res.status(200).json({
        status: 'success',
        data: userData,
    });
});

const getAllUser = catchAsync(async (req, res, next) => {
    const userData = await User.find({ role: { $ne: 'admin' } });

    res.status(200).json({
        status: 'success',
        value: userData,
    });
});

const getAllStudent = catchAsync(async (req, res, next) => {
    const studentAccount = await User.find({ role: 'student' });
    const studentNoneAccount = await Student.find();
    res.status(200).json({
        status: 'success',
        value: [...studentAccount, ...studentNoneAccount],
    });
});

const getUserById = catchAsync(async (req, res, next) => {
    const userData = await User.findById(req.body._id);

    res.status(200).json({
        status: 'success',
        data: userData,
    });
});

const updateUserStatus = catchAsync(async (req, res, next) => {
    const getUser = await User.findOne({ _id: req.body.id });
    await User.updateOne({ _id: req.body.id }, { active: !getUser.active });
    const _user = await User.find({ role: { $ne: 'admin' } });
    res.status(200).json({
        status: 'success',
        value: _user,
    });
});

const updateStudentID = catchAsync(async (req, res, next) => {
    if (req.body.isVerify) {
        const getStudent = await User.findOne({ id: req.body.studentID });
        if (
            req.body.studentID !== '' &&
            getStudent &&
            getStudent.id === req.body.studentID &&
            getStudent._id.toString() !== req.body.id
        ) {
            res.status(200).json({
                status: 'fail',
                message: 'Student ID has been existed',
            });
        } else {
            await User.updateOne({ _id: req.body.id }, { id: req.body.studentID });
            const studentAccount = await User.find({ role: 'student' });
            const studentNoneAccount = await Student.find();
            res.status(200).json({
                status: 'success',
                value: [...studentAccount, ...studentNoneAccount],
            });
        }
    } else {
        const getStudent = await Student.findOne({ id: req.body.studentID });
        if (
            req.body.studentID !== '' &&
            getStudent &&
            getStudent.id === req.body.studentID &&
            getStudent._id.toString() !== req.body.id
        ) {
            res.status(200).json({
                status: 'fail',
                message: 'Student ID has been existed',
            });
        } else {
            await Student.updateOne({ _id: req.body.id }, { id: req.body.studentID });
            const studentAccount = await User.find({ role: 'student' });
            const studentNoneAccount = await Student.find();
            res.status(200).json({
                status: 'success',
                value: [...studentAccount, ...studentNoneAccount],
            });
        }
    }
});

const getStudentBySearch = catchAsync(async (req, res) => {
    let getStudentAccount = [];
    let getStudentNoneAccount = [];
    if (req.body.searchInput === '') {
        getStudentAccount = await User.find({ role: 'student' });
        getStudentNoneAccount = await Student.find();
    } else {
        getStudentAccount = await User.find({ $text: { $search: req.body.searchInput }, role: 'student' });
        getStudentNoneAccount = await Student.find({ $text: { $search: req.body.searchInput } });
    }
    res.status(200).json({
        status: 'success',
        value: [...getStudentAccount, ...getStudentNoneAccount],
    });
});

const getUserBySearch = catchAsync(async (req, res) => {
    let getStudent = [];
    if (req.body.searchInput === '') {
        getStudent = await User.find({ role: { $ne: 'admin' } });
    } else {
        getStudent = await User.find({ $text: { $search: req.body.searchInput }, role: { $ne: 'admin' } });
    }
    res.status(200).json({
        status: 'success',
        value: getStudent,
    });
});

const createStudent = catchAsync(async (req, res, next) => {
    const data = req.body.jsonData;
    const studentAccount = await User.find({ role: 'student' });
    const studentNoneAccount = await Student.find();
    const studentAll = [...studentAccount, ...studentNoneAccount];

    if (req.body.isFile) {
        for (let i = 0; i < data.length; i++) {
            const found = studentAll.some((el) => el.id !== '' && el.id === data[i].studentId);
            if (!found && data[i].studentId !== '' && data[i].fullname !== '') {
                await Student.create({
                    id: data[i].studentId,
                    fullname: data[i].fullname,
                });
            }
        }
    } else {
        for (let i = 0; i < data.length; i++) {
            const found = studentAll.some((el) => el.id !== '' && el.id === data[i].studentId);
            if (data[i].studentId === '' && data[i].fullname === '') {
                res.status(200).json({
                    status: 'fail',
                    message: 'Student information is empty',
                });
            } else if (found) {
                res.status(200).json({
                    status: 'fail',
                    message: 'Student ID has been existed',
                });
            } else {
                await Student.create({
                    id: data[i].studentId,
                    fullname: data[i].fullname,
                });
            }
        }
    }

    const studentAccountRes = await User.find({ role: 'student' });
    const studentNoneAccountRes = await Student.find();
    res.status(200).json({
        status: 'success',
        value: [...studentAccountRes, ...studentNoneAccountRes],
    });
});

const deleteStudentById = catchAsync(async (req, res) => {
    await Student.deleteOne({_id: req.body.studentId});
    const studentAccount = await User.find({ role: 'student' });
    const studentNoneAccount = await Student.find();
    res.status(200).json({
        status: 'success',
        value: [...studentAccount, ...studentNoneAccount],
    });
});

export default {
    register,
    getUserById,
    verifyRegister,
    login,
    loginGoogle,
    loginFacebook,
    forgetPassword,
    protect,
    changePassword,
    editProfile,
    getUser,
    getAllUser,
    updateUserStatus,
    getAllStudent,
    updateStudentID,
    getStudentBySearch,
    getUserBySearch,
    createStudent,
    deleteStudentById
};
