import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  teacher: [String],
  student: [String],
  title: String,
  content: String,
  post: [String],
  inviteCode: {
    type: String,
    unique: true,
  },
  inviteLink: String,
  grade: String,
});

const Class = mongoose.model('classes', classSchema);

export default Class;