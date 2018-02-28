const mongoose = require('../config/database')
const { Schema } = mongoose

const villageSchema = new Schema({
  name: { type: String },
});

const messageSchema = new Schema({
  name: { type: String },
  message: { type: String },
  senderName: { type: String }
});

const playerSchema = new Schema({
  village: [villageSchema],
  name: {type: String },
  mayor: { type: Boolean, default: false },
  dead: { type: Boolean, default: false },
  messageSent: { type: Boolean, default: false },
  photo: { type: String },
  receivedMessages: { type: Array, default: [] }
});

module.exports = mongoose.model('players', playerSchema)
