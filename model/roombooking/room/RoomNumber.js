const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const schema = new Schema({
  room_number: {
    type: Number,
    required: true
  },
  result: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('RoomNumber', schema, 'roomNumber');
