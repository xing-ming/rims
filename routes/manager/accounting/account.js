const express = require('express');
const router = express.Router();
const DayAccount = require('../../../model/accounting/DayAccount');
const WeeklyAccount = require('../../../model/accounting/WeeklyAccount');
const MonthlyAccount = require('../../../model/accounting/MonthlyAccount');

// security
let auth = function(req, res, next) {
  if (req.user && req.user.administrator === 'Manager' || req.user && req.user.administrator === 'Developer') {
    next();
  } else {
    req.flash('auth_danger', 'Please sign in to continue !!!!!');
    res.redirect('/auth/users/signin');
  }
};

/**
 * @method: get
 * @access: /manager/accounting/dayAccountDisplay
 * @description: display day account
 * @private: manager
 */
router.get('/dayAccountDisplay', auth, (req, res) => {
  DayAccount.find({}).sort({
    _id: -1
  }).exec((err, dayAccount) => {
    if (err) {
      console.log(`Unable to display dayAccount: ${err}`);
    } else {
      res.render('manager/accounting/dayAccountDisplay', {
        dayAccount
      });
    }
  });
});

/**
 * @method: get
 * @access: /manager/accounting/weeklyAccountDisplay
 * @description: display weekly account
 * @private: manager
 */
router.get('/weeklyAccountDisplay', auth, (req, res) => {
  WeeklyAccount.find({}).sort({
    _id: -1
  }).exec((err, weeklyAccount) => {
    if (err) {
      console.log(`Unable to display weeklyAccount: ${err}`);
    } else {
      res.render('manager/accounting/weeklyAccountDisplay', {
        weeklyAccount
      });
    }
  });
});

/**
 * @method: get
 * @access: /manager/accounting/monthlyAccountDisplay
 * @description: display monthly account
 * @private: manager
 */
router.get('/monthlyAccountDisplay', auth, (req, res) => {
  MonthlyAccount.find({}).sort({
    _id: -1
  }).exec((err, monthlyAccount) => {
    if (err) {
      console.log(`Unable to display monthlyAccount: ${err}`);
    } else {
      res.render('manager/accounting/monthlyAccountDisplay', {
        monthlyAccount
      });
    }
  });
});

module.exports = router;
