import express from 'express'
import authController from '../controllers/authController.js'
import passport from 'passport';

const router = express.Router()

router.post('/register',authController.register);
router.post('/verify',authController.verifyRegister);
router.post('/login',authController.login);

router.get('/google',passport.authenticate('google',{
  scope:['profile','email']
}))
router.get('/google/redirect',passport.authenticate('google',{
  session:false
}),authController.loginGoogle)

router.get('/facebook',passport.authenticate('facebook'))
router.get('/facebook/redirect',passport.authenticate('facebook',{
  session:false
}),authController.loginFacebook)

router.post('/forget-password',authController.forgetPassword)

router.post('/change-password', authController.protect, authController.changePassword);
router.post('/edit-profile', authController.protect, authController.editProfile);
router.get('/get-user', authController.protect, authController.getUser);

export default router;