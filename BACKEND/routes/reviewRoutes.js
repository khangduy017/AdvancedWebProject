import express from 'express'
import reviewController from '../controllers/reviewController.js';
import authController from '../controllers/authController.js'

const router = express.Router()

router.post('/create', authController.protect, reviewController.createReview);
router.post('/review-history', authController.protect, reviewController.reviewHistory);
router.post('/get-review', authController.protect, reviewController.getReview);
router.post('/send-comment', authController.protect, reviewController.sendComment);
router.post('/send-review-in-class', authController.protect, reviewController.getReviewInClass);
router.post('/mark-final-decision', authController.protect, reviewController.markFinalDecision);


export default router;