const { Schema, model } = require('mongoose');

const schema = new Schema({
  name: { type: String, required: true },
  count: { type: Number, required: true }
}, { timestamps: true });

module.exports = model('Tag', schema);
