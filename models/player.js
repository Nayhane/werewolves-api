const mongoose = require('../config/database')
const { Schema } = mongoose

const villageSchema = new Schema({
  name: { type: String },
});

const messageSchema = new Schema({
  message: { type: String },
  senderName: { type: String },
  createdAt: { type: Date },
  messageRead: { type: Boolean }
});

const playerSchema = new Schema({
  village: [villageSchema],
  name: {type: String },
  mayor: { type: Boolean, default: false },
  dead: { type: Boolean, default: false },
  messageSent: { type: String },
  photo: { type: String },
  receivedMessages: [messageSchema]
});

module.exports = mongoose.model('players', playerSchema)
