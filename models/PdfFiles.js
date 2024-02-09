const { Schema, model } = require('mongoose');

const schema = new Schema({
  file_name: { type: String, required: true },
  status: { type: String }
}, { timestamps: true });

module.exports = model('Pdf', schema);
