import passport from 'passport'
import GoogleStrategy from 'passport-google-oauth20'
import FacebookStrategy from 'passport-facebook'
import User from '../models/userModel.js'

const google = passport.use(
  new GoogleStrategy({
    callbackURL: '/webAdvanced/api/v1/auth/google/redirect',
    proxy: true,
    clientID: '997261922744-3t42l5qkl57eqse5b43intg35rbbr49e.apps.googleusercontent.com',
    clientSecret: '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',
    passReqToCallback: true,
  }, async (req, accessToken, refreshToken, profile, done) => {
    const useFounder = await User.findOne({ email: profile.emails[0].value })
    if (useFounder) {
      if (!useFounder.active) {
        done(null, { status: 'inactive', role: req.query.state })
      }
      else if (useFounder.googleId === profile.id && useFounder.role === req.query.state) {
        done(null, useFounder)
      }
      else {
        done(null, { status: 'exist', role: req.query.state })
      }
    } else {
      const newUser = await User.create({
        id: '',
        email: profile.emails[0].value,
        password: 'googleaccount',
        type: 'google',
        role: req.query.state,
        class: [],
        notify: [],
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
)

const facebook = passport.use(new FacebookStrategy({
  callbackURL: '/webAdvanced/api/v1/auth/facebook/redirect',
  proxy: true,
  clientID: '391220859959574',
  clientSecret: '73dbe8637bd81c3c1e1c09554397b098',
  passReqToCallback: true,
},
  function (req, accessToken, refreshToken, profile, done) {
    User.findOne({ facebookId: profile.id, role: req.query.state }).then(async currentUser => {
      if (currentUser) {
        done(null, currentUser)
      } else {
        const newUser = await User.create({
          id: '',
          email: '',
          password: 'facebookaccount',
          type: 'facebook',
          role: req.query.state,
          class: [],
          notify: [],
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