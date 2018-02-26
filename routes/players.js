// routes/players.js
const router = require('express').Router()
const passport = require('../config/auth')
const { Player } = require('../models')
const utils = require('../lib/utils')


const authenticate = passport.authorize('jwt', { session: false })

module.exports = io => {
  router
    .get('/players', (req, res, next) => {
      Player.find()
        // Newest players first
        .sort({ createdAt: -1 })
        // Send the data in JSON format
        .then((players) => res.json(players))
        // Throw a 500 error if something goes wrong
        .catch((error) => next(error))
    })
    .get('/players/:id', (req, res, next) => {
      const id = req.params.id

      Player.findById(id)
        .then((player) => {
          if (!player) { return next() }
          res.json(player)
        })
        .catch((error) => next(error))
    })
    .post('/players', authenticate, (req, res, next) => {
      const newPlayer = {
        village: req.village._id,
        name: req.body.name,
        mayor: req.body.mayor,
        dead: req.body.dead,
        photo: req.body.photo
        }

      Player.create(newPlayer)
        .then((player) => {
          io.emit('action', {
            type: 'PLAYER_CREATED',
            payload: player
          })
          res.json(player)
        })
        .catch((error) => next(error))
    })
    .patch('/players/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      const userId = req.account._id.toString()

      Player.findById(id)
        .then((player) => {
          if (!player) { return next() }



          Player.findByIdAndUpdate(id, { $set: updatedPlayer }, { new: true })
            .then((player) => {
              io.emit('action', {
                type: 'PLAYER_UPDATED',
                payload: player
              })
              res.json(player)
            })
            .catch((error) => next(error))
        })
        .catch((error) => next(error))
    })
    // .delete('/players/:id', authenticate, (req, res, next) => {
    //   const id = req.params.id
    //   Player.findByIdAndRemove(id)
    //     .then(() => {
    //       io.emit('action', {
    //         type: 'PLAYER_REMOVED',
    //         payload: id
    //       })
    //       res.status = 200
    //       res.json({
    //         message: 'Removed',
    //         _id: id
    //       })
    //     })
    //     .catch((error) => next(error))
    // })

  return router
}
