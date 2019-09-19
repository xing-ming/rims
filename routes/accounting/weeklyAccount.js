var express = require('express');
var router = express.Router();
const WeeklyAccount = require('../../model/accounting/WeeklyAccount');
const Weekly = require('../../model/accounting/Weekly');
const PaymentMethod = require('../../model/ict/PaymentMethod');

// security
let auth = function (req, res, next) {
  if (req.user && req.user.administrator === 'Accountant') {
    next();
  } else {
    req.flash('auth_danger', 'Please sign in to continue !!!!!');
    res.redirect('/auth/users/signin');
  }
};

/**
 * @method: get
 * @access: /accountant/weeklyAccount/create
 * @description: display WeeklyAccount
 * @private: accountant
 */
router.get('/create', auth, (req, res, next) => {
  Weekly.find({}).sort({ _id: -1 }).exec((err, weeks) => {
    if (err) {
      console.log(`Unable to display day: ${err}`);
    }
    PaymentMethod.find((err, paymentMethod) => {
      if (err) throw err;
      res.render('accountant/weekly/weeklyAccount', {
        weeks,
        paymentMethod
      });
    })
  });
});

/**
 * @method: post { create. update }
 * @access: /accountant/weeklyAccount/create
 * @description: create weeklyAccount
 * @private: accountant
 */
router.post('/create', (req, res) => {
  if (req.body.weeklyAccount_id === '') {
    createWeeklyAccount(req, res);
  } else {
    updateWeeklyAccount(req, res);
  }
});

// post function
function createWeeklyAccount(req, res) {
  const newAccount = new WeeklyAccount({
    week_name: req.body.week_name,
    username: req.body.username,
    amount: req.body.amount,
    account_title: req.body.account_title,
    account_type: req.body.account_type
  });
  newAccount.save((err) => {
    if (err) {
      console.log(`Unable to create account man: ${err}`);
    }
    req.flash('success', 'save successful');
    res.redirect('/accountant/weeklyAccount/weeklyAccountDisplay')
  });
}

/**
 * @method: get
 * @access: /accountant/weeklyAccount/edit/:id
 * @description: edit weekly account
 * @private: accountant
 */
router.get('/edit/:id', auth, (req, res) => {
  WeeklyAccount.findById({ _id: req.params.id }, (err, weeklyAccount) => {
    if (err) {
      console.log(`Unable to edit weekly account: ${err}`);
    }
    Weekly.find((err, weeks) => {
      if (err) throw err;
      PaymentMethod.find((err, paymentMethod) => {
        if (err) throw err;
        res.render('accountant/weekly/weeklyAccount', {
          weeks,
          weeklyAccount,
          paymentMethod
        });
      });
    });
  });
});

/**
 * @method: update call function
 * @description: update weekly account
 * @private: accountant
 */
function updateWeeklyAccount(req, res) {
  WeeklyAccount.findByIdAndUpdate({ _id: req.body.weeklyAccount_id }, req.body, { new: true }, (err) => {
    if (err) {
      console.log(`Unable to update monthly account: ${err}`);
    }
    req.flash('success', 'update successful');
    res.redirect('/accountant/weeklyAccount/weeklyAccountDisplay');
  });
}

/**
 * @method: get
 * @access: /accountant/WeeklyAccount/monthlyAccountDisplay
 * @description: display weekly account
 * @private: accountant
 */
router.get('/weeklyAccountDisplay', auth, (req, res) => {
  const success = req.flash('success');
  const danger = req.flash('danger');
  WeeklyAccount.find({}).sort({ _id: -1 }).exec((err, weeklyAccount) => {
    if (err) {
      console.log(`Unable to display weeklyAccount: ${err}`);
    } else {
      res.render('accountant/weekly/weeklyAccountDisplay', {
        weeklyAccount,
        success,
        danger
      });
    }
  });
});

module.exports = router;
