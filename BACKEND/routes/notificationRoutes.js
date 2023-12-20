import express from 'express'
import authController from '../controllers/authController.js'
import notificationController from '../controllers/notificationController.js';
const router = express.Router()

router.post('/get-all', authController.protect, notificationController.getAll);

export default router;