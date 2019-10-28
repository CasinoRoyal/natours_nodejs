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
  }
});

userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.isCorrectPassword = async (confirmPass, userPass) => {
  return await bcrypt.compare(confirmPass, userPass);
}

const User = mongoose.model('User', userSchema);

module.exports = User;