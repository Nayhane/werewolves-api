// routes/users.js
const router = require('express').Router()
const { User } = require('../models')
const passport = require('../config/auth')

router.post('/users', (req, res, next) => {
  User.register(new User({name: req.body.name, email: req.body.email}), req.body.password, (err, user) => {
    if (err) {
      err.status = 422
      return next(err)
    }

    const { name, email, _id, createdAt, updatedAt } = user
    res.status(201).send({ name, email, _id, createdAt, updatedAt })
  })
})

router.get('/users/me', passport.authorize('jwt', { session: false }), (req, res, next) => {
  if (!req.account) {
    const error = new Error('Unauthorized')
    error.status = 401
    next(error)
  }

  res.json(req.account)
})

module.exports = router
