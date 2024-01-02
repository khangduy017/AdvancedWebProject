import express from 'express'
import authController from '../controllers/authController.js'
import passport from 'passport';

const router = express.Router()

router.post('/register', authController.register);
router.post('/verify', authController.verifyRegister);
router.post('/login', authController.login);

router.get('/google', function (req, res, next) {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: req.query.role
  })(req, res, next)
})

router.get('/google/redirect', passport.authenticate('google', {
  session: false
}), authController.loginGoogle)

router.get('/facebook', function (req, res, next) {
  passport.authenticate('facebook', {
    state: req.query.role
  })(req, res, next)
})

router.get('/facebook/redirect', passport.authenticate('facebook', {
  session: false
}), authController.loginFacebook)

router.post('/forget-password', authController.forgetPassword)

router.post('/change-password', authController.protect, authController.changePassword);
router.post('/edit-profile', authController.protect, authController.editProfile);
router.post('/get-user-by-id', authController.protect, authController.getUserById);
router.get('/get-user', authController.protect, authController.getUser);
router.get('/get-all-user', authController.protect, authController.getAllUser);
router.get('/get-all-student', authController.protect, authController.getAllStudent);
router.post('/update-status', authController.updateUserStatus);
router.post('/update-student-id', authController.updateStudentID);
router.post('/search-student', authController.getStudentBySearch);
router.post('/search-user', authController.getUserBySearch);
router.post('/create-student', authController.createStudent);
router.post('/delete-student', authController.deleteStudentById);

export default router;