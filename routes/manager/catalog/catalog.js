const express = require('express');
const router = express.Router();
const Department = require('../../../model/employee/department/Department');
const Allowance = require('../../../model/employee/allowance/Allowance');
const PaymentMethod = require('../../../model/ict/PaymentMethod');
const Status = require('../../../model/employee/statusAndPosition/Status');
const Position = require('../../../model/employee/statusAndPosition/Position');
const Expenses = require('../../../model/expenses/Expenses');
const Budget = require('../../../model/budget/Budget');
const Category = require('../../../model/ict/Category');
const Brand = require('../../../model/ict/Brand');

/**
 * @department
 * @allowance
 * @payment_method
 * @status
 * @position
 * @expenses
 * @budget
 * @category
 * @brand
 */

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
* DEPARTMENT AND ALLOWANCE START
*/

/**
 * @method: get
 * @access:/manager/catalog/departmentAndAllowance
 * @private: manager /manager
 * @description: display department and allowance
 */
router.get('/departmentAndAllowance', auth, (req, res) => {
  Department.find({}).sort({
    _id: -1
  }).exec((err, department) => {
    if (err) throw err;
    Allowance.find({}).sort({
      allowance: -1
    }).exec((err, allowance) => {
      if (err) throw err;
      res.render('manager/catalog/departmentAndAllowance', {
        department,
        allowance,
      });
    });
  });
});

/**
 * PAYMENT METHOD START
 */

/**
 * @route : /manager/catalog/paymentMethod
 * @access: manager
 * @description: display payment method
 */
router.get('/paymentMethod', auth, (req, res, next) => {
  PaymentMethod.find({}).sort({
    _id: -1
  }).exec((err, payment_method) => {
    if (err) {
      console.log(`Unable to display payment method: ${err}`);
    }
    res.render('manager/catalog/paymentMethod', {
      payment_method
    });
  });
});

/**
 * STATUS AND POSITION START
 */

/**
 * @method: get
 * @access: /manager/catalog/statusAndPosition
 * @private: ict
 * @description: display status and position
 */
router.get('/statusAndPosition', auth, (req, res) => {
  Status.find({}).sort({
    _id: -1
  }).exec((err, status) => {
    if (err) throw err;
    Position.find({}).sort({
      position: -1
    }).exec((err, position) => {
      if (err) throw err;
      res.render('manager/catalog/statusAndPosition', {
        status,
        position
      })
    });
  });
});

/**
 * EXPENSES AND BUDGET START
 */

/**
 * @method: get
 * @access: /manager/catalog/expenses/display
 * @private: manager
 * @description: display expenses
 */
router.get('/expenses/display', auth, (req, res) => {
  Expenses.find({}).sort({
    _id: -1
  }).exec((err, expenses) => {
    if (err) throw err;
    res.render('manager/expensesAndBudget/expensesDisplay', {
      expenses
    });
  });
});

/**
 * BUDGET START
 */

/**
 * @method: get
 * @access: /manager/catalog/budget/display
 * @private: manager
 * @description: display budget
 */
router.get('/budget/display', auth, (req, res) => {
  Budget.find({}).sort({
    budget: -1
  }).exec((err, budget) => {
    if (err) throw err;
    res.render('manager/expensesAndBudget/budgetDisplay', {
      budget
    });
  });
});

/**
* @method: get 
* @access: /manager/catalog/budget/delete/id
* @private: now accountant
* @description: delete budget
*/
router.get('/budget/delete/:id', auth, (req, res) => {
  Budget.findByIdAndDelete({ _id: req.params.id }, (err) => {
    if (err) {
      console.log(`Unable to delete budget: ${err}`);
    }
    req.flash('success', 'delete successful');
    res.redirect('/manager/catalog/budget/display');
  });
});

/**
 * @method: get
* @route : /manager/catalog/category/brand/display
* @access: manager
* @description: display category and brand
*/
router.get('/category/brand/display', auth, (req, res, next) => {
  Category.find((err, category) => {
    if (err) throw err;
    Brand.find((err, brand) => {
      if (err) throw err;
      res.render('manager/catalog/categoryAndBrand', {
        category,
        brand
      });
    });
  });
});

module.exports = router;
