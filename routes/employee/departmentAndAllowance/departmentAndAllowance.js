var express = require('express');
var router = express.Router();
const Department = require('../../../model/employee/department/Department');
const Allowance = require('../../../model/employee/allowance/Allowance');

// security
let auth = function (req, res, next) {
  if (req.user && req.user.administrator === 'ICT') {
    next();
  } else {
    req.flash('auth_danger', 'Please sign in to continue !!!!!');
    res.redirect('/auth/users/signin');
  }
};

/**
* @method: get 
* @access: /employee/catalog/create
* @private: ict
* @description: display create department
*/
router.get('/create', auth, (req, res) => {
  const success = req.flash('success');
  const danger = req.flash('danger');
  Department.find({}).sort({ department_name: -1 }).exec((err, department) => {
    if (err) throw err;
    Allowance.find({}).sort({ allowance: -1 }).exec((err, allowance) => {
      if (err) throw err;
      res.render('employee/departmentAndAllowance/departmentAndAllowance', {
        department,
        allowance,
        success,
        danger
      });
    });
  });
});

/**
 * @method: post
 * @access: /employee/catalog/department/create
 * @private: ict
 * @description: create department
 */
router.post('/department/create', function (req, res) {
  Department.findOne({ department_name: req.body.department_name }, (err, department_name) => {
    if (department_name) {
      req.flash('danger', `${req.body.department_name} already exist`);
      res.redirect('/employee/catalog/create');
    } else {
      const newDep = new Department({
        department_name: req.body.department_name
      });
      newDep.save((err) => {
        if (err) {
          console.log(`Unable to save department: ${err}`);
        }
        req.flash('success', 'save successful');
        res.redirect('/employee/catalog/create');
      });
    }
  });
});

/**
 * @method: get
 * @access: /employee/catalog/department/delete/id
 * @private: ict
 * @description: delete department
 */
router.get('/department/delete/:id', auth, (req, res) => {
  Department.findByIdAndDelete({ _id: req.params.id }, (err) => {
    if (err) {
      console.log(`Unable to delete department: ${err}`);
    }
    req.flash('success', 'delete successful');
    res.redirect('/employee/catalog/create');
  });
});

/**
 * creating allowance
 * allowance start
 */

/**
 * @method: post
 * @access: /employee/catalog/allowance/create
 * @private: ict
 * @description: create allowance
 */
router.post('/allowance/create', function (req, res) {
  Allowance.findOne({ allowance: req.body.allowance }, (err, allowance) => {
    if (allowance) {
      req.flash('danger', `${req.body.allowance} already exist`);
      res.redirect('/employee/catalog/create');
    } else {
      const newAllowance = new Allowance({
        allowance: req.body.allowance
      });
      newAllowance.save((err) => {
        if (err) {
          console.log(`Unable to save allowance: ${err}`);
        }
        req.flash('success', 'save successful');
        res.redirect('/employee/catalog/create');
      });
    }
  });
});

/**
 * @method: get
 * @access: /employee/catalog/allowance/delete/id
 * @private: ict
 * @description: delete allowance
 */
router.get('/allowance/delete/:id', auth, (req, res) => {
  Allowance.findByIdAndDelete({ _id: req.params.id }, (err) => {
    if (err) {
      console.log(`Unable to delete allowance: ${err}`);
    }
    req.flash('success', 'delete successful');
    res.redirect('/employee/catalog/create');
  });
});

module.exports = router;
