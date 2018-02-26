// config/auth.js
const passport = require('passport')
const mongoose = require('mongoose')
const { Strategy } = require('passport-jwt')
const { User } = require('../models')
const jwtOptions = require('./jwt')

const tokenStrategy = new Strategy(jwtOptions, (jwtPayload, done) => {
  console.log('payload received', jwtPayload)
  
  User.findById(jwtPayload.id)
    .then((user) => {
      if (user) {
        console.log(user)
        done(null, user)
      } else {
        done(null, false)
      }
    })
    .catch((err) => done(err, false))
})

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
passport.use(tokenStrategy)

module.exports = passport
