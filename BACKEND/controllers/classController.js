import Class from "../models/classModel.js";
import User from "../models/userModel.js"
import catchAsync from '../utils/catchAsync.js'

const getAllClass = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.body._id)

  const classes = []

  for (let i of user.class) {
    const _class = await Class.findById(i)
    classes.push(_class)
  }

  res.status(200).json({
    status: 'success',
    value: classes
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

  const newClass = await Class.create({
    teacher: [req.body.user], // _id of user create class
    student: [],
    title: req.body.title,
    content: req.body.content,
    post: [],
    inviteCode: code,
    inviteLink: req.body.inviteLink,
    grade: String,
  })

  const user = await User.findById(req.body.user)
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

const joinClass = catchAsync(async (req, res, next) => {

  res.status(200).json({
    status: 'success',
  })
})


const outClass = catchAsync(async (req, res, next) => {

  res.status(200).json({
    status: 'success',
  })
})

export default { getAllClass, createClass, getClassDetail, joinClass, outClass }
