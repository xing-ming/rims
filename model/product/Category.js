const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const schema = new Schema({
    category_name: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', schema, 'categories');