const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const schema = new Schema({
    allowance: {
        type: String,
        required: true
    }
}, {
        timestamps: true
    });

module.exports = mongoose.model('Allowance', schema, 'allowance');