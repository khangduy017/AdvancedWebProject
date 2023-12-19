import mongoose, { Mongoose } from "mongoose";

const reviewCommentSchema = new mongoose.Schema({
  name: String,
  content:String,
  time: String,
  review_id: String
});


const ReviewComment = mongoose.model('review-comments', reviewCommentSchema);

export default ReviewComment;