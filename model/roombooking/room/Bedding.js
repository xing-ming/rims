const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const schema = new Schema({
  bed_type: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Bedding', schema, 'bedding');
