import express from 'express'
import classController from '../controllers/classController.js';
import authController from '../controllers/authController.js'

const router = express.Router()

router.post('/create',authController.protect, classController.createClass);
router.post('/',authController.protect,classController.getAllClass);
router.get('/:id', classController.getClassDetail);

export default router;