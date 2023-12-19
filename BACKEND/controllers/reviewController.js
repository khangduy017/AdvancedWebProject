import mongoose from 'mongoose';
import Class from '../models/classModel.js';
import User from '../models/userModel.js';
import Grade from '../models/GradeModel.js';
import catchAsync from '../utils/catchAsync.js';
import Review from '../models/reviewModel.js';
import ReviewComment from '../models/reviewCommentModel.js';

const createReview = catchAsync(async (req, res, next) => {
  const currentDate = new Date();

  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const seconds = currentDate.getSeconds().toString().padStart(2, '0');

  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Lưu ý: Tháng bắt đầu từ 0
  const year = currentDate.getFullYear();

  const formattedDate = `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;

  const user = await User.findById(req.body._id)

  const review = await Review.create({
    user_id: req.body._id,
    student_id: user.id,
    class: req.body.class_id,
    grade: req.body.grade_id,
    time: formattedDate,
    composition: req.body.composition,
    current_grade: req.body.current_grade,
    expected_grade: req.body.expected_grade,
    reason: req.body.reason,
    final_grade: ''
  })

  const reviews = await Review.find({ user_id: req.body._id, class: req.body.class_id })

  res.status(200).json({
    status: 'success',
    value: reviews.reverse(),
  });
});

const reviewHistory = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ user_id: req.body._id, class: req.body.id })

  res.status(200).json({
    status: 'success',
    value: reviews.reverse(),
  });
});

const getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.body._id)
  const comments = await ReviewComment.find({ review_id: req.body._id })

  res.status(200).json({
    status: 'success',
    review,
    comments,
  });
});

const getReviewInClass = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ class: req.body.id })

  res.status(200).json({
    status: 'success',
    value: reviews.reverse(),
  });
});

const sendComment = catchAsync(async (req, res, next) => {
  const currentDate = new Date();

  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const seconds = currentDate.getSeconds().toString().padStart(2, '0');

  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Lưu ý: Tháng bắt đầu từ 0
  const year = currentDate.getFullYear();

  const formattedDate = `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;

  const user = await User.findById(req.body._id)

  const comment = await ReviewComment.create({
    name: user.username,
    content: req.body.content,
    time: formattedDate,
    review_id: req.body.review_id
  })

  const comments = await ReviewComment.find({ review_id: req.body.review_id })

  res.status(200).json({
    status: 'success',
    comments
  });
});

const markFinalDecision = catchAsync(async (req, res, next) => {
  let finalGrade = parseFloat(req.body.final_grade);

  if (!isNaN(finalGrade) && finalGrade >= 0 && finalGrade <= 10) {
    let review = await Review.findById(req.body.review_id)
    review.final_grade = req.body.final_grade
    review.final_decision_by = req.body.final_decision_by
    await review.save()

    let grade = await Grade.findById(req.body.grade_id)
    let _grade = []
    for(let i of grade.grades){
      if(review.student_id === i.studentId){
        i={...i,grade: {...i.grade,[review.composition]:review.final_grade}}
      }
      _grade.push(i)
    }
    grade.grades = _grade
    await grade.save()

    return res.status(200).json({
      status: 'success',
      review
    });
  }

  return res.status(200).json({
    status: 'failed',
    value: 'Invalid score'
  });

});

export default { markFinalDecision, getReviewInClass, createReview, reviewHistory, getReview, sendComment };
