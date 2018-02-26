// models/game.js
const mongoose = require('../config/database')
const { Schema } = mongoose


const villageSchema = new Schema({
  name: {type: String, required: false },
});


const playerSchema = new Schema({
  village: [villageSchema],
  playerName: {type: String, required: false },
  mayor: { type: Boolean, default: false },
  dead: { type: Boolean, default: false },
  photo: { type: String, required: true },
});

module.exports = mongoose.model('players', playerSchema)
