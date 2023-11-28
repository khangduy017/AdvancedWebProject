import express from 'express'
import classController from '../controllers/classController.js';
import authController from '../controllers/authController.js'

const router = express.Router()

router.post('/create',authController.protect, classController.createClass);
router.post('/',authController.protect,classController.getAllClass);
router.get('/:id', classController.getClassDetail);
router.post('/invite-code',authController.protect, classController.getClassByCode)
router.post('/invite-email',authController.protect, classController.getClassByEmail)
router.post('/join-class',authController.protect, classController.joinClass)
router.post('/already-in-class',authController.protect, classController.alreadyInClass)

export default router;