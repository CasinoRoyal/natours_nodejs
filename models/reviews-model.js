const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review can not be empty']
  },
  rating: {
    type: Number,
    min: [1, 'Your minimal rating score must be at least 1.0'],
    max: [5, 'Your maximal rating score must not be bigger than 5.0']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Review must belong a tour']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong a user']
  }
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

reviewSchema.pre(/^find/, function(next){
  this.populate({
      path: 'user',
      select: 'name'
    })

  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;