import express from 'express'
import postController from '../controllers/postController.js';
import authController from '../controllers/authController.js'

const router = express.Router()

router.post('/create-post', authController.protect, postController.createPost)
router.post('/create-comment', authController.protect, postController.createComment)
router.get('/get-all-posts/:id', authController.protect, postController.getAllPosts)

export default router;