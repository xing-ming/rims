const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const schema = new Schema({
    department_name: {
        type: String,
        required: true
    },
    department_code: {
      type: String,
      required: true
  }
}, {
    timestamps: true
});

module.exports = mongoose.model('Department', schema, 'department');