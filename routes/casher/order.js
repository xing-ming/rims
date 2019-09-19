var express = require('express');
var router = express.Router();
const Order = require('../../model/casher/Order');
const Cart = require('../../model/casher/Cart');
const PaymentMethod = require('../../model/ict/PaymentMethod');

// security
let auth = function (req, res, next) {
  if (req.user && req.user.administrator === 'Cashier') {
    next();
  } else {
    req.flash('auth_danger', 'Please sign in to continue !!!!!');
    res.redirect('/auth/users/signin');
  }
};

/**
 * @method: post
 * @access: /casher/item/order
 * @description: create and update order in database
 * @private: casher
 */
router.post('/order', (req, res) => {
  if (req.body.order_id === '') {
    addOrder(req, res);
  } else {
    updateOrder(req, res);
  }
});

/**
 * @route : /casher/item/order
 * @access: casher
 * @method: post
 * @description: save order or sales to database
*/
function addOrder(req, res) {
  if (!req.session.cart) {
    return res.render('casher/cartItem');
  }
  const cart = new Cart(req.session.cart);
  const newOrder = new Order({
    order: cart,
    username: req.body.username,
    payment_method: req.body.payment_method,
    department_name: req.body.department_name
  });
  newOrder.save((err) => {
    if (err) {
      console.log(`Unable to save order: ${err}`);
    }
    req.flash('success', 'order save successful');
    res.redirect('/casher/item/invoice');
  });
}

/**
 * @method: get
 * @access: /casher/item/order/edit/:id
 * @description: edit order by updating the payment methode
 * @private: casher
 */
router.get('/order/edit/:id', auth, (req, res) => {
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
router.get('/order-display', auth, (req, res) => {
  const success = req.flash('success');
  Order.find({}).sort({ _id: -1 }).exec((err, orders) => {
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

module.exports = router;
