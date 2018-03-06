// routes/players.js
const router = require('express').Router()
const passport = require('../config/auth')
const { Player } = require('../models')

const authenticate = passport.authorize('jwt', { session: false })

const loadPlayers = (req, res, next) => {

  Player.find()
    .then((players) => {
      req.players = players
      next()
    })
    .catch((error) => next(error))
}

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
    .post('/players', authenticate, loadPlayers, (req, res, next) => {

      const W = 'Wakkerdam'
      const S = 'Sluimervoort'

      let newVillage = ''

      if (req.players.length === 0) {
        newVillage = W
      } else if (req.players.length > 0) {
        const lastVillage = req.players[req.players.length-1].village[0].name
        if (lastVillage === W) {
          newVillage = S
        } else {
          newVillage = W
        }
      }

      const maxWakkerdam = req.players.filter(e => e.village[0].name === W )
      const maxSluimervoort = req.players.filter(e => e.village[0].name === S)

      if (maxWakkerdam.length > 14 && newVillage === W) {
        let err = new Error('The Village of WakkerDam is Full')
          err.status = 422
          throw err
      }
      if (maxSluimervoort.length > 14 && newVillage === S) {
        let err = new Error('The Village of Sluimervoort is Full')
          err.status = 422
          throw err
      }

      const newPlayer = {
        name: req.body.name,
        photo: req.body.photo,
        village: [{name: newVillage}],
        //receivedMessages: req.body.receivedMessages
        receivedMessages: []
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

          newMessage = {...req.body, createdAt: Date.now(), messageRead: false}

          player.receivedMessages = [...player.receivedMessages, newMessage]

          player.save()
            .then((player) => {

              io.emit('action', {
                type: 'PLAYER_MESSAGES_UPDATED',
                payload: player
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

    .patch('/players/:id/mayor', authenticate, loadPlayers, (req, res, next) => {
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
          if (player.dead === true) {return null}

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
    .patch('/players/:id/messageread', authenticate, (req, res, next) => {
      const id = req.params.id

      Player.findById(id)
        .then((player) => {
          if (!player) { return next() }

          const updatedMessages = player.receivedMessages.map((m) => {
            if (m._id.toString() === req.body[0].toString()) {
              console.log('this message is: ' + m)
              return {
                ...m,
                message: m.message,
                createdAt: m.createdAt,
                senderName: m.senderName,
                messageRead: req.body[1].messageRead
              }
            }
            return m
          })

          const updatedPlayer = {...player, receivedMessages: updatedMessages}

          Player.findByIdAndUpdate(id, { $set: updatedPlayer }, { new: true })
            .then((player) => {
              io.emit('action', {
                type: 'PLAYER_MESSAGE_UPDATED',
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
          if (player.dead ) { return next()}
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
    .patch('/players/:id/resetplayers', authenticate, loadPlayers, (req, res, next) => {
      const id = req.params.id

      Player.findById(id)
        .then((player) => {
          if (!player) { return next() }

          let updatedVillage = {...player.village[0], name: req.body.name}
          let updatedPlayer = {...player, dead: false, mayor: false, messageSent: false, receivedMessages: [], village: [updatedVillage]}

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
    .delete('/players/:id', authenticate, loadPlayers, (req, res, next) => {
      const id = req.params.id

      Player.findByIdAndRemove(id)
        .then((player) => {
          io.emit('action', {
            type: 'PLAYER_REMOVED',
            payload: player
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
