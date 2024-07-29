// models/Card.js

const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  category1: {
    type: String,
    default: 'all'
  },
  category2: {
    type: String,
    default: 'all'
  },
  startingPrice: {
    type: Number,
    default: 0
  },
  endingPrice: {
    type: Number,
    default: 0
  },
}, {
  timestamps: true,
});

const CardAdjuster = mongoose.model('CardAdjuster', cardSchema);

module.exports = CardAdjuster;
