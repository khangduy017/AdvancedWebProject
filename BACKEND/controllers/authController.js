import User from "../models/userModel.js";
import catchAsync from '../utils/catchAsync.js'
import AppError from "../utils/appError.js";
import jwt from 'jsonwebtoken'

const signToken = function (id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: '29d',
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + 30 * 24 * 3600 * 1000),
    // secure: true,
    httpOnly: true,
  })

  user.password = undefined;

  return res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });

}

const register = catchAsync(async (req, res) => {
  // console.log(req.body)
  const newUser = await User.create(req.body)

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

export default { register, login }