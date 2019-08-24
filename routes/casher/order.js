var express = require('express');
var router = express.Router();
const Order = require('../../model/casher/Order');
const Cart = require('../../model/casher/Cart');
const PaymentMethod = require('../../model/ict/PaymentMethod');

/**
 * @method: post
 * @access: /casher/item/order/update
 * @description: update order in database
 * @private: casher
 */
router.post('/order/update', (req, res) => {
  if (req.body.order_id !== '') {
    updateOrder(req, res);
  }
});

/**
 * @method: get
 * @access: /casher/item/order/edit/:id
 * @description: edit order by updating the payment methode
 * @private: casher
 */
router.get('/order/edit/:id', (req, res) => {
  Order.findById({ _id: req.params.id }, (err, order) => {
    if (err) {
      console.log(`Unable to edit order: ${err}`);
    }
    PaymentMethod.find((err, payment) => {
      if (err) {
        console.log(`Unable to edit order: ${err}`);
      }
      res.render('casher/orderUpdate', { order, payment });
    });
  });
});

/**
 * @method: update call function
 * @description: update order
 * @private: casher
 */
function updateOrder(req, res) {
  Order.findByIdAndUpdate({ _id: req.body.order_id }, req.body, { new: true }, (err) => {
    if (err) {
      console.log(`Unable to update order: ${err}`);
    }
    req.flash('success', 'update successful');
    res.redirect('/casher/item/order-display');
  });
}

/**
 * @method: get
 * @access: /casher/item/order-display
 * @description: display order
 * @private: casher
 */
router.get('/order-display', (req, res) => {
  const success = req.flash('success');
  Order.find({}).sort({ createdAt: -1 }).exec((err, orders) => {
    if (err) {
      throw err;
    }
    let cart;
    orders.forEach((order) => {
      cart = new Cart(order.order);
      order.items = cart.generateArray();
      // console.log(order.items);
    });
    res.render('casher/order', { orders, success });
  });
});

/**
 * @method: get
 * @access: /casher/item/invoice
 * @description: print invoice
 * @private: casher
 */
router.get('/invoice', (req, res) => {
  if (!req.session.cart) {
    return res.render('casher/cartItem', { items: null });
  }
  let cart = new Cart(req.session.cart);
  res.render('casher/invoice', {
    items: cart.generateArray(),
    totalPrice: cart.totalPrice,
  });
});

module.exports = router;
