import passport from 'passport'
import GoogleStrategy from 'passport-google-oauth20'
import FacebookStrategy from 'passport-facebook'
import User from '../models/userModel.js'

const google = passport.use(
  new GoogleStrategy({
    callbackURL: '/webAdvanced/api/v1/auth/google/redirect',
    clientID: '997261922744-3t42l5qkl57eqse5b43intg35rbbr49e.apps.googleusercontent.com',
    clientSecret: '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',
    passReqToCallback: true,
  }, (req, accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id }).then(async currentUser => {
      if (currentUser) {
        done(null, currentUser)
      } else {
        const newUser = await User.create({
          email: profile.emails[0].value,
          password: 'googleaccount',
          type: 'google',
          role: req.query.state,
          username: profile.displayName,
          fullname: '',
          phone: '',
          dob: '',
          googleId: profile.id,
          facebookId: '',
          address: '',
          gender: '',
          avatar: profile.photos[0].value,
        })
        done(null, newUser)
      }
    })
  })
)

const facebook = passport.use(new FacebookStrategy({
  callbackURL: '/webAdvanced/api/v1/auth/facebook/redirect',
  clientID: '360372179696821',
  clientSecret: 'db235faa5952b1a2008858025efdfc9e',
  passReqToCallback: true,
},
  function (req,accessToken, refreshToken, profile, done) {
    User.findOne({ facebookId: profile.id }).then(async currentUser => {
      if (currentUser) {
        done(null, currentUser)
      } else {
        const newUser = await User.create({
          email: '',
          password: 'facebookaccount',
          type: 'facebook',
          role: req.query.state,
          username: profile.displayName,
          fullname: '',
          phone: '',
          dob: '',
          googleId: '',
          facebookId: profile.id,
          address: '',
          gender: '',
          avatar: '',
        })
        done(null, newUser)
      }
    })
  }
));

export default { google, facebook }