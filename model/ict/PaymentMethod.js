const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const schema = new Schema({
    payment_method: {
        type: String,
        required: true
    }
}, {
        timestamps: true
    });

module.exports = mongoose.model('PaymentMethod', schema, 'paymentMethod');