const mongoose = require('../config/database')
const { Schema } = mongoose

const villageSchema = new Schema({
  name: { type: String },
});


const playerSchema = new Schema({
  village: [villageSchema],
  name: {type: String },
  mayor: { type: Boolean, default: false },
  dead: { type: Boolean, default: false },
  photo: { type: String },
});

module.exports = mongoose.model('players', playerSchema)
