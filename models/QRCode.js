const { Schema, model, Types } = require('mongoose');

const StyleSchema = new Schema(
  {
    bgColor: { type: String, required: true },
    patternColor: { type: String, required: true },
    type: { type: String, required: true },
  },
  { _id: false },
);

const LogoSchema = new Schema(
  {
    src: { type: String },
  },
  { _id: false },
);



const schema = new Schema({
  name: { type: String },
  tag: { type: String },
  link: { type: String, required: true },
  style: { type: StyleSchema, required: true },
  logo: { type: LogoSchema },
  transitions: { type: Number, default: 0 },
  shortLink: { type: String },
  user: { type: Types.ObjectId, ref: 'User' },
  data: { type: Object, default: null },
  is_lucky_users: { type: Boolean, default: false },
  payment_resp: { type: Object, default: false },
  transaction_details: { type: Object, default: false }

}, { timestamps: true });

// Add an index on the 'tag' field
schema.index({ tag: 1 });

// Add indexes for transitions, is_lucky_users, and payment_resp
schema.index({ transitions: 1, is_lucky_users: 1, 'payment_resp.id': 1 });

module.exports = model('qrcode', schema);
