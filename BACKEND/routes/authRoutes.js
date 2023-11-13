import express from 'express'
import authController from '../controllers/authController.js'

const router = express.Router()

router.post('/register',authController.register);
router.post('/login',authController.login);
router.post('/change-password', authController.protect, authController.changePassword);
router.post('/edit-profile', authController.protect, authController.editProfile);
router.get('/get-user', authController.protect, authController.getUser);

export default router;