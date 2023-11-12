import User from "../models/userModel.js";
import catchAsync from '../utils/catchAsync.js'
import AppError from "../utils/appError.js";
import jwt from 'jsonwebtoken'
import Validator from "../utils/validator.js"
import REGEX from '../constants/regex.js';

const signToken = function (id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: '29d',
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // res.cookie('jwt', token, {
  //   expires: new Date(Date.now() + 30 * 24 * 3600 * 1000),
  //   // secure: true,
  //   httpOnly: true,
  // })

  user.password = undefined;

  return res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });

}

const register = catchAsync(async (req, res,next) => {
  console.log(req.body)
  // // Validate request body
  // if (!Validator.isValidRequestBody(req.body, ['email', 'password', 'passwordConfirm']))
  //     return next(new AppError("Bad request", 400));

  // Validate phonenumber, password and password confirm
  const { email, password, passwordConfirm } = req.body;

  if (Validator.isEmptyString(email) || Validator.isEmptyString(password) || Validator.isEmptyString(passwordConfirm))
      return next(new AppError("Vui lòng nhập đầy đủ thông tin", 400));

  else if (!Validator.isMatching(email, REGEX.EMAIL))
      return next(new AppError("Email không hợp lệ", 400));

  else if (password.length < 8)
      return next(new AppError('Mật khẩu của bạn quá yếu (tối thiểu 8 kí tự)', 400));

  else if (password !== passwordConfirm)
      return next(new AppError("Mật khẩu của bạn không khớp", 400));

  const founded_user = await User.findOne({ email: email });

  if (founded_user)
      return next(new AppError("Tài khoản đã tồn tại", 400));

  const newUser = await User.create({
    email: email,
    password: password,  
    role: 'user',
    username: req.body.username?req.body.username:'',
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
    return next(new AppError("Nhập tài khoản và mật khẩu", 401));
  }

  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Tài khoản hoặc mật khẩu không chính xác', 401));
  }

  // console.log(user)

  createSendToken(user, 200, res);
})

const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token = '';
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    token = req.headers.authorization.split(' ')[1];

  if (!token)
    return next(new AppError('You are not logged in! Please log in to get access'), 401);

  // 2) Verfication token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser)
    return next(new AppError('The user belonging to this token does no longer exist.', 401));

  // 4) Check if user changed password after the token was issued
  // if (currentUser.changedPasswordAfter(decoded.iat))
  //     return next(new AppError('User recently changed password! Please log in again.'), 401);

  // GRANT ACCESS TO PROTECT ROUTE
  req.user = currentUser;
  next();
});

export default { register, login, protect }