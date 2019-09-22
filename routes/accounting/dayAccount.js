var express = require('express');
var router = express.Router();
const DayAccount = require('../../model/accounting/DayAccount');
const Day = require('../../model/accounting/Day');
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
 * @method: post { update, create }
 * @access: /accountant/dayAccount/create
 * @description: display dayAccount
 * @private: accountant
 */
router.get('/create', auth, (req, res, next) => {
  Day.find({}).sort({ _id: -1 }).exec((err, days) => {
    if (err) throw err;
    PaymentMethod.find((err, paymentMethod) => {
      if (err) throw err;
      res.render('accountant/daily/dayAccount', {
        days,
        paymentMethod
      });
    });
  });
});

/**
 * @method: post
 * @access: /accountant/dayAccount/create
 * @description: create dayAccount
 * @private: accountant
 * stage: create, update
 */
router.post('/create', (req, res) => {
  if (req.body.dayAccount_id === '') {
    createDayAccount(req, res);
  } else {
    updateDayAccount(req, res);
  }
});

// post function
function createDayAccount(req, res) {
  const newAccount = new DayAccount({
    day_name: req.body.day_name,
    username: req.body.username,
    amount: req.body.amount,
    account_type: req.body.account_type,
    account_title: req.body.account_title
  });
  newAccount.save((err) => {
    if (err) throw err;
    req.flash('success', 'save successful');
    res.redirect('/accountant/dayAccount/dayAccountDisplay')
  });
}

/**
 * @method: get
 * @access: /accountant/dayAccount/edit/:id
 * @description: edit item
 * @private: product
 */
router.get('/edit/:id', auth, (req, res) => {
  DayAccount.findById({ _id: req.params.id }, (err, dayAccount) => {
    if (err) throw err;
    Day.find((err, days) => {
      if (err) throw err;
      PaymentMethod.find((err, paymentMethod) => {
        if (err) throw err;
        res.render('accountant/daily/dayAccount', {
          days,
          dayAccount,
          paymentMethod
        });
      });
    });
  });
});

/**
 * @method: update call function
 * @description: update day account
 * @private: accountant
 */
function updateDayAccount(req, res) {
  DayAccount.findByIdAndUpdate({ _id: req.body.dayAccount_id }, req.body, { new: true }, (err) => {
    if (err) throw err;
    req.flash('success', 'update successful');
    res.redirect('/accountant/dayAccount/dayAccountDisplay');
  });
}

/**
 * @method: get
 * @access: /accountant/dayAccount/displayDayAccount
 * @description: display dayAccount
 * @private: accountant
 * stage: create, update
 */
router.get('/dayAccountDisplay', auth, (req, res) => {
  const success = req.flash('success');
  DayAccount.find({}).sort({ _id: -1 }).exec((err, dayAccount) => {
    if (err) {
      throw err;
    } else {
      res.render('accountant/daily/dayAccountDisplay', {
        dayAccount,
        success
      });
    }
  });
});

module.exports = router;
