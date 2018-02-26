// config/socket-auth.js
const io = require('socket.io')()
const jwtAuth = require('socketio-jwt-auth')
const jwtOptions = require('./jwt')
const { User } = require('../models')

const middleware = jwtAuth.authenticate({
  secret: jwtOptions.secretOrKey,    // required, used to verify the token's signature
}, (jwtPayload, done) => {
  console.log('payload received', jwtPayload)

  User.findById(jwtPayload.id)
    .then((user) => {
      if (user) {
        done(null, user)
      } else {
        done(null, false)
      }
    })
    .catch((err) => done(err, false))
})

module.exports = middleware
