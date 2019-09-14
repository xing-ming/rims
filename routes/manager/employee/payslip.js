const express = require('express');
const router = express.Router();
const Payslip = require('../../../model/employee/payslip/Payslip');

// security
let auth = function (req, res, next) {
  if (req.user && req.user.administrator === 'Manager' || req.user && req.user.administrator === 'Developer') {
    next();
  } else {
    req.flash('auth_danger', 'Please sign in to continue !!!!!');
    res.redirect('/auth/users/signin');
  }
};

/**
 * @router : /manager/payroll/payslip/display
 * @method : get
 * @access : manager
 * @description : display payslip
 */
router.get('/display', auth, (req, res) => {
  const success = req.flash('success');
  Payslip.find({}).sort({
    employee_name: -1
  }).exec((err, payslip) => {
    if (err) throw err;
    res.render('manager/payroll/payslipDisplay', {
      payslip,
      success
    });
  });
});

/**
 * @router : /manager/payroll/payslip/display/each/id
 * @method : get
 * @access : manager
 * @description : display payslip by individual
 */
router.get('/display/each/:id', auth, (req, res) => {
  Payslip.findById({
    _id: req.params.id
  }, (err, payslip) => {
    if (err) throw err;
    res.render('manager/payroll/payslipDisplayEach', {
      payslip
    });
  });
});

/**
 * @router : /manager/payroll/payslip/print-payslip/invoice/each/id
 * @method : get
 * @access : manager
 * @description : display payslip by individual
 */
router.get('/print-payslip/invoice/each/:id', auth, (req, res) => {
  Payslip.findById({
    _id: req.params.id
  }, (err, payslip) => {
    if (err) throw err;
    res.render('manager/payroll/printPayslip', {
      payslip
    });
  });
});

/**
 * @router : /manager/payroll/payslip/delete/id
 * @method : get
 * @access : manager
 * @description : display payslip by individual
 */
router.get('/delete/:id', (req, res) => {
  Payslip.findOneAndDelete({ _id: req.params.id }, (err) => {
    if (err) throw err;
    res.redirect('/manager/payroll/payslip/display')
  });
});

module.exports = router;
