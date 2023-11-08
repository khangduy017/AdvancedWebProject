import User from "../models/userModel.js";
import catchAsync from '../utils/catchAsync.js'
import AppError from "../utils/appError.js";
import jwt from 'jsonwebtoken'

const signToken = function (id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
      expiresIn: '90d',
  });
};

const register = catchAsync(async (req, res) => {
  console.log(req.body)
  const newUser = await User.create(req.body)

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: '90d'
  })

  return res.status(200).json({
    status: 'success',
    token,
    message: 'Register successful',
  });
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

  console.log(user)
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    data: {
      user,
      access_token: token
    }
  });
})

export default { register, login }