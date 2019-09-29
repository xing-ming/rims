const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const schema = new Schema({
  product_name: {
    type: String
  },
  new_carton_quantity: {
    type: String,
    required: true
  },
  new_carton_qty_unit: {
    type: String,
    required: true
  },
  new_carton_price_unit: {
    type: String,
    required: true
  },
  new_carton_total_qty: {
    type: String,
    required: true
  },
  new_product_total_amount: {
    type: String,
    required: true
  },
  
  old_carton_quantity: {
    type: Number,
    required: true
  },
  old_carton_qty_unit: {
    type: Number,
    required: true
  },
  old_carton_price_unit: {
    type: Number,
    required: true
  },
  sale_qty: {
    type: Number,
    required: true
  },
  qty_remainder: {
    type: Number,
    required: true
  },
  old_carton_total_qty: {
    type: String,
    required: true
  },
  old_product_total_amount: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Store', schema, 'store');