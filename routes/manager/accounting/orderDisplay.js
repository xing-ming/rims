var express = require('express');
var router = express.Router();
const Order = require('../../../model/casher/Order');
const Cart = require('../../../model/casher/Cart');

// security
let auth = function (req, res, next) {
  if (req.user && req.user.administrator === 'Manager' || req.user && req.user.administrator === 'Developer') {
    next();
  } else {
    req.flash('auth_danger', 'Please sign in to continue !!!!!');
    res.redirect('/auth/users/signin');
  }
};

/**
 * @method: post
 * @access: /manager/order/order-display
 * @description: display order to manager
 * @private: manager
 */
router.get('/order-display', auth, (req, res) => {
  Order.find({}).sort({
    _id: -1
  }).exec((err, orders) => {
    if (err) {
      throw err;
    }
    let cart;
    orders.forEach((order) => {
      cart = new Cart(order.order);
      order.items = cart.generateArray();
      // console.log(order.items);
    });
    res.render('manager/accounting/orderDisplay', {
      orders
    });
  });
});

module.exports = router;
