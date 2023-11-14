import User from "../models/userModel.js";
import catchAsync from '../utils/catchAsync.js'
import AppError from "../utils/appError.js";
import jwt from 'jsonwebtoken'
import Validator from "../utils/validator.js"
import REGEX from '../constants/regex.js';
import { promisify } from 'util';

const expiresTime = 3*24*3600*1000;

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

  user.password = ''

  return res.status(statusCode).json({
    status: 'success',
    token,
    expiresTime,
    data: { user },
  });

}

const register = catchAsync(async (req, res, next) => {
  console.log(req.body)
  // // Validate request body
  // if (!Validator.isValidRequestBody(req.body, ['email', 'password', 'passwordConfirm']))
  //     return next(new AppError("Bad request", 400));

  // Validate phonenumber, password and password confirm
  const { email, password, passwordConfirm } = req.body;

  if (Validator.isEmptyString(email) || Validator.isEmptyString(password) || Validator.isEmptyString(passwordConfirm))
    return next(new AppError("Please provide complete information", 400));

  else if (!Validator.isMatching(email, REGEX.EMAIL))
    return next(new AppError("Invalid email address", 400));

  else if (password.length < 8)
    return next(new AppError('Your password is too weak (minimum 8 characters)', 400));

  else if (password !== passwordConfirm)
    return next(new AppError("Your passwords do not match", 400));

  const founded_user = await User.findOne({ email: email });

  if (founded_user)
    return next(new AppError("The email already exist", 400));

  const newUser = await User.create({
    email: email,
    password: password,
    role: 'user',
    username: req.body.username ? req.body.username : '',
    fullname: '',
    phone: '',
    dob: '',
    address: '',
    gender: '',
    avatar: '',
  })

  createSendToken(newUser, 201, res)
})

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Enter your email and password", 401));
  }

  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Email or password is incorrect', 401));
  }

  createSendToken(user, 200, res);
})

const protect = catchAsync(async (req, res, next) => {

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('Please log in to get access.', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password, Please log in again.', 401)
    );
  }

  req.user = currentUser;
  next();
});

const changePassword = catchAsync(async (req, res, next) => {

  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    res.status(200).json({
      status: 'fail',
      message: 'Current password is incorrect'
    });
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});

const editProfile = catchAsync(async (req, res, next) => {

  const userCheck = await User.findOne(
    { email: req.body.email },
  );

  if(userCheck && userCheck._id.toString() !== req.user.id){
    res.status(200).json({
      status: 'fail',
      message: 'Email has been existed'
    });
  }

  else{
    const updatedUser = await User.updateOne(
      { _id: req.user.id },
      { 
        fullname: req.body.fullname,
        username: req.body.username,
        dob: req.body.dob,
        phone: req.body.phone,
        gender: req.body.gender,
        role: req.body.role,
        email: req.body.email,
        address: req.body.address
      }
    );
    
    const userData = await User.findOne(
      { _id: req.user.id },
    );
  
    res.status(200).json({
      status: 'success',
      data: userData
    });
  }
});

const getUser = catchAsync(async (req, res, next) => {

  const userData = await User.findOne(
    { _id: req.user.id },
  );

  res.status(200).json({
    status: 'success',
    data: userData
  });
});

export default { register, login, protect, changePassword, editProfile, getUser }
