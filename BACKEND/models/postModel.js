import mongoose, { Mongoose } from "mongoose";

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  creator: String,
  classId: String,
  date: String
});

const Post = mongoose.model('posts', postSchema);

export default Post;