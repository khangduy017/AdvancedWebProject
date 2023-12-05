import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: String,
  password: {
    type: String,
    minlength: 8,
    select: false,
  },
  id:{
    type: String,
  },
  type:{
    type: String,
    enum: ['account', 'google','facebook'],
  },
  role: {
      type: String,
  },
  class: [String],
  notify: [String],
  fullname: {
      type: String,
  },
  phone: String,
  email: {
      type: String,
      lowercase: true,
  },
  dob: String,
  address: String,
  gender: String,
  avatar: String,
  googleId: String,
  facebookId:String,
  passwordChangedAt: Date,
  userVerifyToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model('users', userSchema);

export default User;