const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const keys = require('../config/keys')
const mongoose = require('mongoose')

const User = mongoose.model('users')
const sqUser = require('../sequelize/models/User')

const cacher = require('sequelize-redis-cache');
const redis = require('redis');
const db = require('../sequelize/db')

const rc = redis.createClient(6379, 'localhost');

let userCache = cacher(db, rc)
  .model('users')
  .ttl(600);

passport.serializeUser((user, done) => {
  done(null, user.googleId)
})

passport.deserializeUser((id, done) => {
  // sqUser.findById(id)
  //   .then(user => {
  //     done(null, user ? user.get({
  //       plain: true
  //     }) : null)
  //   })
  userCache.find({ where: { googleId: id } })
    .then(user => {
      console.log('CACHE HIT', userCache.cacheHit)
      done(null, user || null)
    })
})

passport.use(
  new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    const result = await sqUser.findOrCreate({
      where: {googleId: profile.id},
      defaults: {
        googleId: profile.id,
        name: profile.name.givenName + ' ' + profile.name.familyName,
        credits: 5,
      }
    })
    .spread((user) => {
      done(null, user.get({
        plain: true
      }))
    })

    // const existingUser = await User.findOne({ googleId: profile.id })
    // if (existingUser) {
    //   return done(null, existingUser)
    // }
    
    // const createdUser = await new User({ googleId: profile.id }).save()
    // done(null, createdUser)
  })
)
