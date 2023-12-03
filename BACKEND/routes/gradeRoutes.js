import express from 'express'
import authController from '../controllers/authController.js'
import gradeController from '../controllers/gradeController.js';

const router = express.Router()

router.post('/get-grade', authController.protect, gradeController.getGrade);
router.post('/add-structure', authController.protect, gradeController.addStructure)
router.post('/edit-structure', authController.protect, gradeController.editStructure)


export default router;