import mongoose, { Mongoose } from "mongoose";

const commentSchema = new mongoose.Schema({
  content: String,
  creator: String,
  postId: String,
});

const Comment = mongoose.model('comments', commentSchema);

export default Comment;