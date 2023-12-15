import mongoose, { Mongoose } from "mongoose";

const classSchema = new mongoose.Schema({
  teacher: {
    type: [mongoose.Types.ObjectId],
    ref: 'User',
    default: []
  },
  active: {
    type: Boolean,
    default: true
  },
  student: {
    type: [mongoose.Types.ObjectId],
    ref: 'User',
    default: []
  },
  owner: String,
  title: String,
  content: String,
  topic: String,
  post: [String],
  inviteCode: {
    type: String,
    unique: true,
  },
  inviteLink: String,
  grade: String,
  background: String
});

const Class = mongoose.model('classes', classSchema);

export default Class;