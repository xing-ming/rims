const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const schema = new Schema({
  employee_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  date_of_birth: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  phone_1: {
    type: String,
    required: true
  },
  phone_2: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  city: {
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
  },
  marital_status: {
    type: String,
    required: true
  },
  photo: {
    type: String,
  },
  department_name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  allowance_1: {
    type: String
  },
  allowance_1_amount: {
    type: Number
  },
  allowance_2: {
    type: String
  },
  allowance_2_amount: {
    type: Number
  },
  total_allowance: {
    type: Number,
    required: true
  },
  total_deduction: {
    type: Number,
    required: true
  },
  tax: {
    type: Number
  },
  total_salary: {
    type: Number,
    required: true
  },
  net_pay: {
    type: Number,
    required: true
  },
  account_holder_name: {
    type: String,
    required: true
  },
  account_number: {
    type: String,
    required: true
  },
  bank_name: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  }
}, {
    timestamps: true
  });

module.exports = mongoose.model('Employee', schema, 'employee');

// 5 personal detail start
// 49 personal detail end
// 52 company detail start
// 60 company detail end
// 64 financail detail start
// 95 financail detail end
// 84 bank detail start
// 96 bank detail end
