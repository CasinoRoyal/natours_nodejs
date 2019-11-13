const crypto = require('crypto');
const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter correct email']
  },
  photo:{
    type: String,
    default: 'default.jpg'
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please add password'],
    trim: true,
    minlength: [6, 'Password length must be greather then 6 symbols'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function(confirm) {
        return confirm === this.password; 
      },
      message: 'Password is not the same'
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordTokenExpire: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre('save', function(next) {
  if(!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function(next) {
  this.find({active: {$ne: false}});

  next();
});

userSchema.methods.isCorrectPassword = async (confirmPass, userPass) => {
  return await bcrypt.compare(confirmPass, userPass);
};

userSchema.methods.isPasswordChanged = function(timestampJWT) {
  if (this.passwordChangedAt) {
    const passwordCreate = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return (timestampJWT < passwordCreate);
  }

  return false;
};

userSchema.methods.createForgotPasswordToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordTokenExpire = Date.now() + (10 * 60 * 1000);

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;