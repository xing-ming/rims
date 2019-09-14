var express = require('express');
var router = express.Router();
const Day = require('../../model/accounting/Day');

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
 * @method: post
 * @access: /accountant/day/create
 * @private: accountant
 * @description: create day
 */
router.post('/create', function (req, res, next) {
  Day.findOne({ day_name: req.body.day_name }, (err, day_name) => {
    if (day_name) {
      req.flash('danger', `${req.body.day_name} already exist`);
      res.redirect('/accountant/day/getSaleDay');
    } else {
      newDay = new Day({
        day_name: req.body.day_name
      });
      newDay.save((err) => {
        if (err) {
          console.log(`Unable to save: ${err}`);
        }
        req.flash('success', 'save successful');
        res.redirect('/accountant/day/getSaleDay')
      });
    }
  });
});

/**
* @method: get 
* @access: /accountant/day/getSaleDay
* @private: accountant and admin
* @description: display days
*/
router.get('/getSaleDay', auth, (req, res, next) => {
  const success = req.flash('success');
  const danger = req.flash('danger');
  Day.find({}).sort({ day_name: -1 }).exec((err, days) => {
    if (err) {
      console.log(`Unable to display day: ${err}`);
    }
    res.render('accountant/daily/day', { days, success, danger });
  });
});

/**
 * @method: get
 * @access: /accountant/day/delete/id
 * @private: accountant
 * @description: delete day
 */
router.get('/delete/:id', auth, (req, res) => {
  Day.findByIdAndDelete({ _id: req.params.id }, (err) => {
    if (err) {
      console.log(`Unable to delete day: ${err}`);
    }
    req.flash('success', 'delete successful');
    res.redirect('/accountant/day/getSaleDay');
  });
});

module.exports = router;
