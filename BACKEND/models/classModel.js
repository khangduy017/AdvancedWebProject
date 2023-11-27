import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  teacher: [String],
  student: [String],
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