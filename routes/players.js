// routes/players.js
const router = require('express').Router()
const passport = require('../config/auth')
const { Player } = require('../models')

const authenticate = passport.authorize('jwt', { session: false })

module.exports = io => {
  router
    .get('/players', (req, res, next) => {

      Player.find()

        // Send the data in JSON format
        .then((players) => {
          res.json(players)})

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
      let wakkerdamArray= [Player.find({ village: [{ name: 'Wakkerdam'}] })]
      let sluimervoortArray= [Player.find({ village: [{ name: 'Sluimervoort'}] })]

      let currentVillage= "Sluimervoort"
      if (wakkerdamArray.length > sluimervoortArray.length) {
        currentVillage = "Sluimervoort"
      } else if (sluimervoortArray.length > wakkerdamArray.length){
        currentVillage = "Wakkerdam"
      }

      console.log(currentVillage)
      console.log(wakkerdamArray.length)
      console.log(sluimervoortArray.length)

      const newPlayer = {
        name: req.body.name,
        photo: req.body.photo,
        village: [{name: currentVillage}],
        receivedMessages: req.body.receivedMessages
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
    .post('/players/:id/receivemessage', authenticate, (req, res, next) => {
      const id = req.params.id

      Player.findById(id)
        .then((player) => {
          if (!player) { return next() }

          newMessage = req.body

          player.receivedMessages = [...player.receivedMessages, newMessage]

          player.save()
            .then((player) => {

              io.emit('action', {
                type: 'PLAYER_MESSAGES_UPDATED',
                payload: {
                  player: player,
                }
              })
              res.json(player)
          })
          .catch((error) => next(error))
        })
    })
    .patch('/players/:id/dead', authenticate, (req, res, next) => {
      const id = req.params.id

      Player.findById(id)
        .then((player) => {
          if (!player) { return next() }

          let updatedPlayer = {...player, dead: req.body.dead, mayor: req.body.mayor }

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
    .patch('/players/:id/mayor', authenticate, (req, res, next) => {
      const id = req.params.id


      Player.findById(id)
        .then((player) => {
          if (!player) { return next() }
          if (player.dead === true) {return null}

          let updatedPlayer = {...player, mayor: req.body.mayor}

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
    .patch('/players/:id/sendmessage', authenticate, (req, res, next) => {
      const id = req.params.id

      Player.findById(id)
        .then((player) => {
          if (!player) { return next() }

          let updatedPlayer = {...player, messageSent: req.body.messageSent}

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
    .patch('/players/:id/village', authenticate, (req, res, next) => {
      const id = req.params.id

      Player.findById(id)
        .then((player) => {
          if (!player) { return next() }

          let updatedVillage = {...player.village[0], name: req.body.name}
          let updatedPlayer = {...player, village: [updatedVillage]}

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


    .patch('/players/:id/moveplayers', authenticate, (req, res, next) => {
      const id = req.params.id

      Player.findById(id)
        .then((player) => {
          if (!player) { return next() }

          let updatedVillage = {...player.village[0], name: req.body.name}
          let updatedPlayer = {...player, village: [updatedVillage]}

      Player.findByIdAndUpdate(id, { $set: updatedPlayer }, { new: true })
            .then((player) => {
              io.emit('action', {
                type: 'PLAYERS_UPDATED',
                payload: player
              })
              res.json(player)
            })
            .catch((error) => next(error))
        })
        .catch((error) => next(error))
    })

    .delete('/players/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      Player.findByIdAndRemove(id)
        .then(() => {
          io.emit('action', {
            type: 'PLAYER_REMOVED',
            payload: id
          })
          res.status = 200
          res.json({
            message: 'Removed',
            _id: id
          })
        })
        .catch((error) => next(error))
    })

  return router
}
