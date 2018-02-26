// config/jwt.js
const { ExtractJwt } = require('passport-jwt')

module.exports = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET || 'verysecret'
}
