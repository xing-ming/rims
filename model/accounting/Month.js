const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const schema = new Schema({
    month_name: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Month', schema, 'months');