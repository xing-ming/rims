const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const schema = new Schema({
    day_name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    account_type: {
        type: String,
        required: true
    },
    account_title: {
        type: String,
        required: true
    }
}, {
        timestamps: true
    });

module.exports = mongoose.model('DayAccount', schema, 'daysAccount');