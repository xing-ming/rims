const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const schema = new Schema({
  room_type: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Room', schema, 'room');
