let express = require('express');
let router = express.Router();
let PaymentMethod = require('../../model/ict/PaymentMethod');

// security
let auth = function (req, res, next) {
  if (req.user && req.user.administrator === 'ICT') {
    next();
  } else {
    req.flash('auth_danger', 'Please sign in to continue !!!!!');
    res.redirect('/auth/users/signin');
  }
};

/**
 * method: post
 * route: /ict/paymentMethod/create
 * access: ict
 * description: create payment method
 */
router.post('/create', function (req, res, next) {
  PaymentMethod.findOne({ payment_method: req.body.payment_method }, (err, payment_method) => {
    if (payment_method) {
      req.flash('danger', `${req.body.payment_method} already exist`);
      res.redirect('/ict/paymentMethod/getPaymentMethod');
    } else {
      newPayment = new PaymentMethod({
        payment_method: req.body.payment_method
      });
      newPayment.save((err) => {
        if (err) {
          console.log(`Unable to save: ${err}`);
        }
        req.flash('success', 'save successful');
        res.redirect('/ict/paymentMethod/getPaymentMethod')
      });
    }
  });
});

/**
* @route : /ict/paymentMethod/getPaymentMethod
* @access: ict and admin
* @description: display payment method
*/
router.get('/getPaymentMethod', auth, (req, res, next) => {
  let success = req.flash('success');
  let danger = req.flash('danger');
  PaymentMethod.find({}).sort({ payment_method: -1 }).exec((err, payment_method) => {
    if (err) {
      console.log(`Unable to display payment method: ${err}`);
    }
    res.render('ict/paymentMethod', { payment_method, success, danger });
  });
});

/**
 * route: /ict/paymentMethod/delete/id
 * access: ict
 * description: delete payment method
 */
router.get('/delete/:id', auth, (req, res) => {
  PaymentMethod.findByIdAndDelete({ _id: req.params.id }, (err) => {
    if (err) {
      console.log(`Unable to delete payment method: ${err}`);
    }
    req.flash('success', 'delete successful');
    res.redirect('/ict/paymentMethod/getPaymentMethod');
  });
});

module.exports = router;
