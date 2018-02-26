const router = require('express').Router()
const passport = require('../../config/auth')
const { Player } = require('../../models/index')

const authenticate = passport.authorize('jwt', { session: false })

const loadVillage = (req, res, next) => {
  const id = req.params.id

  Village.findById(id)
  .then((village) => {
    req.village = village
    next()
  })
  .catch((error) => next(error))
}

const getPlayers = (req, res, next) => {
  const id= req.village._id
  Player.find({
    id: id
  })
  .then((players) => {
    req.players = players
    next()
  })
  .catch((error) => next(error))

}

module.exports = io => {
  router
  .get('/villages/:id/players', loadVillage, getPlayers, (req, res, next) => {
    if (!req.village || !req.players) { return next() }
    res.json(req.players)
  })

  .post('/villages/:id/players', authenticate, loadVillage, (req, res, next) => {
    if (!req.village) { return next() }

    const newPlayer= {
      name: req.body.name,
      photo:  req.body.photo,
      id:  req.village._id,
    }

    Player.create(newPlayer)
    .then((player) => {
      res.json(player)
    })
    .catch((error) => next(error))
  })

  return router
}
