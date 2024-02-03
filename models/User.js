const { Schema, model } = require('mongoose');

const schema = new Schema({
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
}, { timestamps: true });

module.exports = model('User', schema);
