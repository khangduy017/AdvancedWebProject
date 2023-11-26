import express from 'express'
import classController from '../controllers/classController.js';

const router = express.Router()

router.get('/', classController.getAllClass);
router.post('/create', classController.createClass);
router.get('/:id', classController.getClassDetail);

export default router;