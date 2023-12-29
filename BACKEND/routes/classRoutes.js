import express from 'express'
import classController from '../controllers/classController.js';
import authController from '../controllers/authController.js'

const router = express.Router()

router.post('/invite-code', authController.protect, classController.getClassByCode)
router.post('/get-class-by-id', authController.protect, classController.getClassById)
router.post('/invite-email', authController.protect, classController.getClassByEmail)
router.post('/create', authController.protect, classController.createClass);
router.post('/join-class', authController.protect, classController.joinClass)
router.post('/get-members', authController.protect, classController.getClassMember)
router.get('/all-class-all-account', authController.protect, classController.getAllClassAllAccount);
router.post('/update-status', classController.updateClassStatus);
router.post('/', authController.protect, classController.getAllClass);
router.post('/search-class', classController.getClassBySearch);
router.post('/search-class-customer', classController.getClassBySearchCustomer);
router.post('/:id', classController.getClassDetail);

export default router;