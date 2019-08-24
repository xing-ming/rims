var express = require('express');
var router = express.Router();
const Month = require('../../model/accounting/Month');

/**
 * @method: post { delete }
 * @access: /accountant/Month/create
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
        if (err) {
          console.log(`Unable to save: ${err}`);
        }
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
router.get('/getSaleMonth', (req, res, next) => {
  const success = req.flash('success');
  const danger = req.flash('danger');
  Month.find({}).sort({ month_name: -1 }).exec((err, months) => {
    if (err) {
      console.log(`Unable to display month: ${err}`);
    }
    res.render('accountant/month', { months, success, danger });
  });
});

/**
 * @access: /accountant/month/delete/id
 * @private: accountant
 * @description: delete Month
 */
router.get('/delete/:id', (req, res) => {
  Month.findByIdAndDelete({ _id: req.params.id }, (err) => {
    if (err) {
      console.log(`Unable to delete month: ${err}`);
    }
    req.flash('success', 'delete successful');
    res.redirect('/accountant/month/getSaleMonth');
  });
});

module.exports = router;
