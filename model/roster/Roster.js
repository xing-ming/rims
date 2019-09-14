const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const schema = new Schema({
  employee_id: {
    type: String,
    required: true
  },
  employee: {
    type: String,
    required: true
  },
  session_task: {
    type: String,
    required: true
  },
  session_task_start: {
    type: String,
    required: true
  },
  session_task_end: {
    type: String,
    required: true
  }
}, {
    timestamps: true
  });

module.exports = mongoose.model('Roster', schema, 'roster');