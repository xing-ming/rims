var express = require('express');
var router = express.Router();
const Weekly = require('../../model/accounting/Weekly');

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
 * @access: /accountant/week/create
 * @private: accountant
 * @description: create week
 */
router.post('/create', function (req, res, next) {
  Weekly.findOne({ week_name: req.body.week_name }, (err, week_name) => {
    if (week_name) {
      req.flash('danger', `${req.body.week_name} already exist`);
      res.redirect('/accountant/week/displayWeeklyAccount');
    } else {
      newWeek = new Weekly({
        week_name: req.body.week_name
      });
      newWeek.save((err) => {
        if (err) {
          console.log(`Unable to save: ${err}`);
        }
        req.flash('success', 'save successful');
        res.redirect('/accountant/week/displayWeeklyAccount')
      });
    }
  });
});

/**
* @access: /accountant/week/displayWeeklyAccount
* @private: accountant and admin
* @description: display weeks
*/
router.get('/displayWeeklyAccount', auth, (req, res, next) => {
  const success = req.flash('success');
  const danger = req.flash('danger');
  Weekly.find({}).sort({ week_name: -1 }).exec((err, weeks) => {
    if (err) {
      console.log(`Unable to display week: ${err}`);
    }
    res.render('accountant/weekly/week', { weeks, success, danger });
  });
});

/**
 * @access: /accountant/week/delete/id
 * @private: accountant
 * @description: delete week
 */
router.get('/delete/:id', auth, (req, res) => {
  Weekly.findByIdAndDelete({ _id: req.params.id }, (err) => {
    if (err) {
      console.log(`Unable to delete week: ${err}`);
    }
    req.flash('success', 'delete successful');
    res.redirect('/accountant/week/displayWeeklyAccount');
  });
});

module.exports = router;
