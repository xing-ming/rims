const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const schema = new Schema({
  expenses_type: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  detail: {
    type: String,
    required: true
  }
}, {
    timestamps: true
  });

module.exports = mongoose.model('Expenses', schema, 'expenses');