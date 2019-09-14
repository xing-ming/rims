const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const schema = new Schema({
  employee_id: {
    type: String,
    required: true
  }
}, {
    timestamps: true
  });

module.exports = mongoose.model('Attendance', schema, 'attendance');