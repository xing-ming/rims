const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const schema = new Schema({
  floor_name: {
    type: String,
    required: true
  },
  floor_range: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Floor', schema, 'floor');
