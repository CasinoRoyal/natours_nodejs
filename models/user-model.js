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
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'senior-guide', 'admin'],
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
  passwordChangedAt: Date
});

userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.isCorrectPassword = async (confirmPass, userPass) => {
  return await bcrypt.compare(confirmPass, userPass);
};

userSchema.methods.isPasswordChanged = function (timestampJWT) {
  if (this.passwordChangedAt) {
    const passwordCreate = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return (timestampJWT < passwordCreate);
  }

  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;