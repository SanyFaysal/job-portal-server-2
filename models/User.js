const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,

      trim: true,
      lowercase: true,
      minLength: [3, 'Name is too small'],
      maxLength: [100, 'Name is too long'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    gender: String,
    password: {
      type: String,
      required: true,
      message: 'Please enter a password',
    },

    contactNumber: {
      type: String,

      validate: [
        validator.isMobilePhone,
        'Please provide a valid phone number',
      ],
    },
    dob: {
      type: Date,
      validate: [validator.isDate, 'Please provide a date'],
    },
    bio: String,
    address: String,
    city: String,
    pastExperience: {
      type: String,
    },
    designation: {
      type: String,
    },
    status: {
      type: String,
      default: 'active',
      enum: {
        values: ['active', 'in-active', 'blocked'],
        message: "{VALUE} can't be a status",
      },
    },
    role: {
      type: String,
      default: '',
      enum: {
        values: ['candidate', 'hiring-manager', 'admin', ''],
        message: "{VALUE} can't be a role",
      },
    },
    applications: [
      {
        type: Object,
        ref: 'Job',
      },
    ],
    company: {
      companyCategory: String,
      companyLocation: String,
      companyName: String,
      companyWebSite: String,
      employeeRange: String,
      roleInCompany: String,
    }
  },
  {
    timeStamps: true,
  }
);

userSchema.pre('save', function (next) {
  const password = this.password;
  const hash = bcrypt.hashSync(password);
  this.password = hash;

  next();
});

userSchema.methods.comparePassword = function (password, hash) {
  const isValidPassword = bcrypt.compareSync(password, hash);
  return isValidPassword;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
