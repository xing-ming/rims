let express = require('express');
let router = express.Router();
const Employee = require('../../../model/employee/Employee');

// security
let auth = function (req, res, next) {
  if (req.user && req.user.administrator === 'Manager') {
    next();
  } else {
    req.flash('auth_danger', 'Please sign in to continue !!!!!');
    res.redirect('/auth/users/signin');
  }
};

/**
 * @method: get
 * @access: /manager/employee/display
 * @private: manager
 * @description: display employee
 */
router.get('/display', auth, (req, res) => {
  const success = req.flash('success');
  Employee.find({}).sort({
    employee_name: -1
  }).exec((err, employee) => {
    if (err) throw err;
    res.render('manager/employee/employeeDisplay', {
      employee,
      success
    });
  });
});

/**
 * @method: get
 * @access: /manager/employee/display/personal-detail/id
 * @private: manager
 * @description: display employee banking detail
 */
router.get('/display/personal-detail/:id', auth, (req, res) => {
  Employee.findById({
    _id: req.params.id
  }, (err, employee) => {
    if (err) {
      console.log(`Unable to view employee: ${err}`);
    }
    res.render('manager/employee/personalDetail', {
      employee
    });
  });
});

/**
 * @method: get
 * @access: /manager/employee/display/company-detail
 * @private: manager
 * @description: display employee company detail
 */
router.get('/display/company-detail/:id', auth, (req, res) => {
  Employee.findById({
    _id: req.params.id
  }, (err, employee) => {
    if (err) {
      console.log(`Unable to view employee: ${err}`);
    }
    res.render('manager/employee/companyDetail', {
      employee
    })
  });
});

/**
 * @method: get
 * @access: /manager/employee/display/financial-detail
 * @private: manager
 * @description: display employee financial detail
 */
router.get('/display/financial-detail/:id', auth, (req, res) => {
  Employee.findById({
    _id: req.params.id
  }, (err, employee) => {
    if (err) {
      console.log(`Unable to view employee: ${err}`);
    }
    res.render('manager/employee/financialDetail', {
      employee
    })
  });
});

/**
 * @method: get
 * @access: /manager/employee/display/bank-detail
 * @private: manager
 * @description: display employee bank detail
 */
router.get('/display/bank-detail/:id', auth, (req, res) => {
  Employee.findById({
    _id: req.params.id
  }, (err, employee) => {
    if (err) {
      console.log(`Unable to view employee: ${err}`);
    }
    res.render('manager/employee/bankDetail', {
      employee
    })
  });
});

/**
 * @method: get
 * @access: /manager/employee/delete/id
 * @private: manager
 * @description: delete employee
 */
router.get('/delete/:id', auth, (req, res) => {
  Employee.findByIdAndDelete({ _id: req.params.id }, (err) => {
    if (err) throw err;
    req.flash('success', 'delete successful');
    res.redirect('/manager/employee/display');
  });
});

module.exports = router;
