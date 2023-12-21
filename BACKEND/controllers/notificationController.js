import mongoose from "mongoose";
import Class from "../models/classModel.js";
import User from "../models/userModel.js"
import Grade from "../models/GradeModel.js";
import catchAsync from '../utils/catchAsync.js'
import io from "../socket.js"
import Notification from "../models/notificationModel.js";

const getAll = catchAsync(async (req, res, next) => {
  const notifications = await Notification.find({user_id:req.body._id})

  res.status(200).json({
    status: 'success',
    value: notifications.reverse()
  });
});

const seen = catchAsync(async (req, res, next) => {
  await Notification.updateOne({ _id: req.body._id }, { seen: true });

  res.status(200).json({
    status: 'success',
  });
});

export default { getAll,seen }
