var express = require('express');
var router = express.Router();
const DayAccount = require('../../model/accounting/DayAccount');
const Day = require('../../model/accounting/Day');

/**
 * @method: post { update, create }
 * @access: /accountant/dayAccount/create
 * @description: display dayAccount
 * @private: accountant
 */
router.get('/create', (req, res, next) => {
  Day.find({}).sort({ day_name: 1 }).exec((err, days) => {
    if (err) {
      console.log(`Unable to display day: ${err}`);
    }
    res.render('accountant/dayAccount', { days });
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
    amount: req.body.amount
  });
  newAccount.save((err) => {
    if (err) {
      console.log(`Unable to create account: ${err}`);
    }
    req.flash('success', 'save successful');
    res.redirect('/accountant/dayAccount/dayAccountDisplay')
  });
}

/**
 * @method: get
 * @access: /accountant/dayAccount/edit/:id
 * @description: edit item
 * @private: ict
 */
router.get('/edit/:id', (req, res) => {
  DayAccount.findById({ _id: req.params.id }, (err, dayAccount) => {
    if (err) {
      console.log(`Unable to edit day account: ${err}`);
    }
    Day.find((err, days) => {
      if (err) {
        throw err;
      } else {
        res.render('accountant/dayAccount', { days, dayAccount });
      }
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
    if (err) {
      console.log(`Unable to update day account: ${err}`);
    }
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
router.get('/dayAccountDisplay', (req, res) => {
  const success = req.flash('success');
  const danger = req.flash('danger');
  DayAccount.find({}).sort({ createdAt: -1 }).exec((err, dayAccount) => {
    if (err) {
      console.log(`Unable to display dayAccount: ${err}`);
    } else {
      res.render('accountant/dayAccountDisplay', {
        dayAccount,
        success,
        danger
      });
    }
  });
});

module.exports = router;
