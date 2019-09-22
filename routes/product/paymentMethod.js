let express = require('express');
let router = express.Router();
let PaymentMethod = require('../../model/product/PaymentMethod');

// security
let auth = function (req, res, next) {
  if (req.user && req.user.administrator === 'Accountant') {
    next();
  } else {
    res.redirect('/auth/users/signin');
  }
};

/**
 * @method: post
 * @route : /product/paymentMethod/create
 * @access: account
 * @description: create payment method
 */
router.post('/create', function (req, res, next) {
  PaymentMethod.findOne({ payment_method: req.body.payment_method }, (err, payment_method) => {
    if (payment_method) {
      req.flash('danger', `${req.body.payment_method} already exist`);
      res.redirect('/product/category/create');
    } else {
      newPayment = new PaymentMethod({
        payment_method: req.body.payment_method
      });
      newPayment.save((err) => {
        if (err) throw err;
        req.flash('success', 'save successful');
        res.redirect('/product/category/create')
      });
    }
  });
});

/**
 * @route : /product/paymentMethod/delete/id
 * @access: account
 * @description: delete payment method
 */
router.get('/delete/:id', auth, (req, res) => {
  PaymentMethod.findByIdAndDelete({ _id: req.params.id }, (err) => {
    if (err) throw err;
    req.flash('success', 'delete successful');
    res.redirect('/product/category/create');
  });
});

module.exports = router;
