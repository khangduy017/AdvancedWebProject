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

classSchema.index(
  {
      title: 'text',
      content: 'text',
      owner: 'text',
  },
  { default_language: 'none' }
);

const Class = mongoose.model('classes', classSchema);

export default Class;