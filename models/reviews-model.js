const mongoose = require('mongoose');
const Tour = require('./tour-model');

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

reviewSchema.index({ tour: 1, user: 1 }, { unique: true })

reviewSchema.pre(/^find/, function(next){
  this.populate({
      path: 'user',
      select: 'name photo'
    })

  next();
});

reviewSchema.statics.calcAverageRating = async function(tourId) {
  const statRating = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: { 
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  console.log(statRating)
  if(statRating.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: statRating[0].nRating,
      ratingsAverage: statRating[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 3.5
    });
  }
};

reviewSchema.post('save', function() {
  this.constructor.calcAverageRating(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.currentDocRef = await this.findOne();

  next();
});

reviewSchema.post(/^findOneAnd/, async function(next) {
  this.currentDocRef.constructor.calcAverageRating(this.currentDocRef.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;