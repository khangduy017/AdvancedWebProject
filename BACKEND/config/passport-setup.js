import passport from 'passport'
import GoogleStrategy from 'passport-google-oauth20'
import User from '../models/userModel.js'

export default passport.use(
  new GoogleStrategy({
    callbackURL:'/webAdvanced/api/v1/auth/google/redirect',
     clientID:'997261922744-3t42l5qkl57eqse5b43intg35rbbr49e.apps.googleusercontent.com',
     clientSecret:'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'
  }, (accessToken, refreshToken, profile,done)=>{
    User.findOne({googleId:profile.id}).then(async currentUser=>{
      if(currentUser){
        done(null,currentUser)
      }else {
        const newUser = await User.create({
          email: profile.emails[0].value,
          password: 'googleaccount',
          type:'google',
          role: 'user',
          username: profile.displayName,
          fullname: '',
          phone: '',
          dob: '',
          googleId:profile.id,
          facebookId:'',
          address: '',
          gender: '',
          avatar: profile.photos[0].value,
        })
        done(null,newUser)
      }
    })
  })
)