const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const schema = new Schema({
    position: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Position', schema, 'position');