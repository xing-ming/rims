const express = require('express');
const router = express.Router();
const Month = require('../../model/accounting/Month');

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
 * @access: /accountant/month/create
 * @private: accountant
 * @description: create Month
 */
router.post('/create', function (req, res, next) {
  Month.findOne({ month_name: req.body.month_name }, (err, month_name) => {
    if (month_name) {
      req.flash('danger', `${req.body.month_name} already exist`);
      res.redirect('/accountant/month/getSaleMonth');
    } else {
      newMonth = new Month({
        month_name: req.body.month_name
      });
      newMonth.save((err) => {
        if (err) throw err;
        req.flash('success', 'save successful');
        res.redirect('/accountant/month/getSaleMonth')
      });
    }
  });
});

/**
* @access: /accountant/month/getSaleMonth
* @private: accountant and admin
* @description: display Month
*/
router.get('/getSaleMonth', auth, (req, res, next) => {
  const success = req.flash('success');
  const danger = req.flash('danger');
  Month.find({}).sort({ _id: -1 }).exec((err, months) => {
    if (err) throw err;
    res.render('accountant/monthly/month', { months, success, danger });
  });
});

/**
 * @access: /accountant/month/delete/id
 * @private: accountant
 * @description: delete Month
 */
router.get('/delete/:id', auth, (req, res) => {
  Month.findByIdAndDelete({ _id: req.params.id }, (err) => {
    if (err) throw err;
    req.flash('success', 'delete successful');
    res.redirect('/accountant/month/getSaleMonth');
  });
});

module.exports = router;
