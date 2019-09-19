const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const schema = new Schema({
  floor: {
    type: String,
    required: true
  },
  room_type: {
    type: String,
    required: true
  },
  bed_type: {
    type: String,
    required: true
  },
  room_number: {
    type: String,
    required: true
  },
  number_of_people: {
    type: String,
    required: true
  },
  check_in: {
    type: String,
    required: true
  },
  check_out: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reservation', schema, 'reservation');
// 36 end reservation
// 37 guest start