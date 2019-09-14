const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const schema = new Schema({
  status: {
    type: String,
    required: true
  }
}, {
    timestamps: true
  });

module.exports = mongoose.model('Status', schema, 'status');