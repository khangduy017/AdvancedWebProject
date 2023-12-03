import mongoose from "mongoose";
import Class from "../models/classModel.js";
import User from "../models/userModel.js"
import catchAsync from '../utils/catchAsync.js'
import sendMail from '../utils/mailer.js'

const getAllClass = catchAsync(async (req, res, next) => {

  const _class = await Class.aggregate([
    {
      $lookup:
      {
        from: 'users',
        localField: 'student',
        foreignField: '_id',
        as: 'student'
      }
    },
    {
      $lookup:
      {
        from: 'users',
        localField: 'teacher',
        foreignField: '_id',
        as: 'teacher'
      }
    },
    {
      $match: {
        $or: [{
          'student._id': new mongoose.Types.ObjectId(req.body._id)
        }, {
          'teacher._id': new mongoose.Types.ObjectId(req.body._id)
        }]
      }
    }
  ])


  res.status(200).json({
    status: 'success',
    value: _class
  });
});

const createClass = catchAsync(async (req, res, next) => {
  let code = Math.floor(10000 + Math.random() * 90000);

  while (1) {
    const _class = await Class.findOne({ inviteCode: code })
    if (_class) {
      code = Math.floor(10000 + Math.random() * 90000);
    }
    else break
  }

  const user = await User.findById(req.body.user)

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
    grade: '',
    background: req.body.color,
  })

  user.class.unshift(newClass._id)
  user.save()

  res.status(200).json({
    status: 'success',
    value: newClass
  });
})

const getClassDetail = catchAsync(async (req, res, next) => {
  const _class = await Class.findById(req.params['id'])

  res.status(200).json({
    status: 'success',
    value: _class
  })
})

const getClassByCode = catchAsync(async (req, res, next) => {
  const _class = await Class.findOne({ inviteCode: req.body.code })

  res.status(200).json({
    status: 'success',
    value: _class
  })
})

const getClassByEmail = catchAsync(async (req, res, next) => {
  await sendMail(req.body.email, 'Invite link', 'Link: ' + req.body.link)

  res.status(200).json({
    status: 'success',
  })
})

const joinClass = catchAsync(async (req, res, next) => {
  const _class = await Class.findById(req.body.classId)
  const _user = await User.findById(req.body.userId)

  if (_user.role === 'teacher') {
    _class.teacher.unshift(req.body.userId)
  } else {
    _class.student.unshift(req.body.userId)
  }
  _class.save()

  _user.class.unshift(req.body.classId)
  _user.save()

  res.status(200).json({
    status: 'success',
    value: req.body.classId
  })
})

const alreadyInClass = catchAsync(async (req, res, next) => {
  const _user = await User.findById(req.body.userId)

  res.status(200).json({
    status: 'success',
    value: _user.class.includes(req.body.classId)
  })
})


const outClass = catchAsync(async (req, res, next) => {

  res.status(200).json({
    status: 'success',
  })
})

export default { alreadyInClass, getAllClass, createClass, getClassDetail, joinClass, outClass, getClassByCode, getClassByEmail }
