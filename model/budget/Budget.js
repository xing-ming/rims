const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const schema = new Schema({
  category_name: {
    type: String
  },
  brand_name: {
    type: String
  },
  other_budget: {
    type: String
  },
  budget_amount: {
    type: String,
    required: true
  }
}, {
    timestamps: true
  });

module.exports = mongoose.model('Budget', schema, 'budget');