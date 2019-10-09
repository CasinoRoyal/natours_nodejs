const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'maxGroup is required']
  },
  difficulty: {
    type: String,
    required: [true, 'difficulty is required']
  },
  ratingsAverage: {
    type: Number
  },
  ratingsQuantity: {
    type: Number
  },
  summary: {
    type: String,
    trim: true
  },
  description: {
    type: String
  },
  imageCover: {
    type: String,
    required: [true, 'image is required']
  },
  images: {
    type: [String]
  },
  startDates: {
    type: [Date]
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  priceDiscount: Number,
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;