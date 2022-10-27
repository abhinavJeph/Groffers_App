const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  // refferal: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: false,
  //   ref: "Refferal",
  // },
  status: {
    type: Boolean,
    default: false,
  },
  cash: {
    type: Number,
    default: 0,
  },
  refferer: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "User",
    default: null,
  }
},
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
