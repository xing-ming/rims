const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const schema = new Schema({
    order: {
        type: Object,
        required: true
    },
    payment_method: {
        type: String,
        required: true
    },
    department_name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    }
}, {
        timestamps: true
    });

module.exports = mongoose.model('Order', schema, 'orders');