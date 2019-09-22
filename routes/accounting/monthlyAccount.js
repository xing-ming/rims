var express = require('express');
var router = express.Router();
const MonthlyAccount = require('../../model/accounting/MonthlyAccount');
const Month = require('../../model/accounting/Month');
const PaymentMethod = require('../../model/product/PaymentMethod');

// security
let auth = function (req, res, next) {
  if (req.user && req.user.administrator === 'Accountant') {
    next();
  } else {
    res.redirect('/auth/users/signin');
  }
};

/**
 * @method: post { create, update }
 * @access: /accountant/monthlyAccount/create
 * @description: display monthlyAccount
 * @private: accountant
 */
router.get('/create', auth, (req, res, next) => {
  Month.find({}).sort({ _id: -1 }).exec((err, months) => {
    if (err) throw err;
    PaymentMethod.find((err, paymentMethod) => {
      if (err) throw err;
      res.render('accountant/monthly/monthlyAccount', {
        months,
        paymentMethod
      });
    });
  });
});

/**
 * @method: post
 * @access: /accountant/monthlyAccount/create
 * @description: create monthlyAccount
 * @private: accountant
 */
router.post('/create', (req, res) => {
  if (req.body.monthlyAccount_id === '') {
    createMonthlyAccount(req, res);
  } else {
    updateMonthlyAccount(req, res);
  }
});

// post function
function createMonthlyAccount(req, res) {
  const newAccount = new MonthlyAccount({
    month_name: req.body.month_name,
    username: req.body.username,
    amount: req.body.amount,
    account_type: req.body.account_type,
    account_title: req.body.account_title
  });
  newAccount.save((err) => {
    if (err) throw err;
    req.flash('success', 'save successful');
    res.redirect('/accountant/monthlyAccount/monthlyAccountDisplay')
  });
}

/**
 * @method: get
 * @access: /accountant/monthlyAccount/edit/:id
 * @description: edit monthly account
 * @private: accountant
 */
router.get('/edit/:id', auth, (req, res) => {
  MonthlyAccount.findById({ _id: req.params.id }, (err, monthlyAccount) => {
    if (err) throw err;
    Month.find((err, months) => {
      if (err) throw err;
      PaymentMethod.find((err, paymentMethod) => {
        if (err) throw err;
        res.render('accountant/monthly/monthlyAccount', {
          months,
          monthlyAccount,
          paymentMethod
        });
      });
    });
  });
});

/**
 * @method: update call function
 * @description: update monthly account
 * @private: accountant
 */
function updateMonthlyAccount(req, res) {
  MonthlyAccount.findByIdAndUpdate({ _id: req.body.monthlyAccount_id }, req.body, { new: true }, (err) => {
    if (err) throw err;
    req.flash('success', 'update successful');
    res.redirect('/accountant/monthlyAccount/monthlyAccountDisplay');
  });
}

/**
 * @method: get
 * @access: /accountant/monthlyAccount/monthlyAccountDisplay
 * @description: display monthlyAccount
 * @private: accountant
 */
router.get('/monthlyAccountDisplay', auth, (req, res) => {
  const success = req.flash('success');
  MonthlyAccount.find({}).sort({ _id: -1 }).exec((err, monthlyAccount) => {
    if (err) {
      throw err;
    } else {
      res.render('accountant/monthly/monthlyAccountDisplay', {
        monthlyAccount,
        success
      });
    }
  });
});

module.exports = router;
