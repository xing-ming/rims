const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const schema = new Schema({
    item_name: {
        type: String,
        required: true
    },
    item_quantity: {
        type: Number,
        required: true
    },
    item_price: {
        type: Number,
        required: true
    },
    category_name: {
        type: String,
        required: true
    },
    brand_name: {
        type: String,
        required: true
    }
}, {
        timestamps: true
    });

module.exports = mongoose.model('Item', schema, 'items');