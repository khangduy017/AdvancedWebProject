import mongoose, { Mongoose } from "mongoose";

const notificationSchema = new mongoose.Schema({
  user_id:String,
  time: String,
  class: String,
  direction:String,
  fromName:String,
  content:String,
  seen: {
    type: Boolean,
    default:false
  }
});

const Notification = mongoose.model('notifications', notificationSchema);

export default Notification;