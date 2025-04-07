const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const myProductSchema = new Schema({
  brand_id: {
    type: Schema.Types.ObjectId,
    ref: 'Brands',
    required: true
  },
  brandname: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  prize: {
    type: Number,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  rating: {
    type: Map,
    of: Number,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MyProducts', myProductSchema);