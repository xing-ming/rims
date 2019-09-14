const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const schema = new Schema({
  employee_id_code: {
    type: String,
    required: true
  },
  employee_name: {
    type: String,
    required: true
  },
  department_name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  payslip_date: {
    type: String,
    required: true
  },
  allowance_1: {
    type: String,
  },
  allowance_1_amount: {
    type: Number,
  },
  allowance_2: {
    type: String
  },
  allowance_2_amount: {
    type: Number
  },
  status: {
    type: String,
    required: true
  },
  tax: {
    type: Number
  },
  other_deduction: {
    type: String
  },
  other_deduction_amount: {
    type: Number
  },
  salary: {
    type: Number,
    required: true
  },
  total_salary: {
    type: String,
    required: true
  },
  total_net_pay: {
    type: Number,
    required: true
  },
  total_deduction: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone_1: {
    type: String,
    required: true
  },
  dateOfJoining: {
    type: String,
    required: true
  },
  total_allowance: {
    type: Number,
    required: true
  },
  account_holder_name: {
    type: String,
    required: true
  },
  payment_method: {
    type: String,
    required: true
  },
  account_number: {
    type: String,
    required: true
  },
  comment: {
    type: String
  },
  bank_name: {
    type: String,
    required: true
  }
}, {
    timestamps: true
  });

module.exports = mongoose.model('Payslip', schema, 'payslip');