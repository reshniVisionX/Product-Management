const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brandSchema = new Schema({
  brand: {
    type: String,
    required: true,
    unique: true
  },
  link: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Brands', brandSchema);