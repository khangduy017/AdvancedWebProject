import mongoose, { Mongoose } from "mongoose";

const reviewSchema = new mongoose.Schema({
  user_id:String,
  student_id: String,
  time: String,
  class: String,
  grade: String,
  composition:String,
  current_grade:String,
  expected_grade:String,
  reason:String,
  final_grade:{
    type: String,
    default: ''
  },
  final_decision_by:String
});


const Review = mongoose.model('reviews', reviewSchema);

export default Review;