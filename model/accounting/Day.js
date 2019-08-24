const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const schema = new Schema({
    day_name: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Day', schema, 'days');