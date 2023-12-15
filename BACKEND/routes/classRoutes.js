import express from 'express'
import classController from '../controllers/classController.js';
import authController from '../controllers/authController.js'

const router = express.Router()

router.post('/invite-code', authController.protect, classController.getClassByCode)
router.post('/invite-email', authController.protect, classController.getClassByEmail)
router.post('/create', authController.protect, classController.createClass);
router.post('/join-class', authController.protect, classController.joinClass)
router.post('/already-in-class', authController.protect, classController.alreadyInClass)
router.post('/get-members', authController.protect, classController.getClassMember)
router.post('/', authController.protect, classController.getAllClass);
router.post('/update-status', classController.updateClassStatus);
router.post('/:id', classController.getClassDetail);

export default router;