const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const schema = new Schema({
    brand_name: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Brand', schema, 'brands');