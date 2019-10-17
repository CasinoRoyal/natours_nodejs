const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: [5, 'Must be greather or equal then 5 characters'],
    maxlength: [40, 'Must be less then 40 characters']
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'Duration is required']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'maxGroup is required'],
    min: [2, 'Must be greather then 2 pearsons'],
    max: [60, 'Must be less then 40 persons']
  },
  difficulty: {
    type: String,
    required: [true, 'difficulty is required'],
    enum: {
      values: ['easy', 'medium', 'diffucult'],
      message: 'It must be only: easy, medium, diffucult'
    }
  },
  ratingsAverage: {
    type: Number,
    min: [1, 'Must be greather then 1.0 pearsons'],
    max: [5, 'Must be less then 5.0 persons']
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
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(val) {
        return val < this.price;
      },
      message: (props) => `${props.value} is greather then tour price`
    }
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, {lower: true});
  console.log(this)
  next();
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;