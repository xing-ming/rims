let express = require('express');
let router = express.Router();
// model
const Payslip = require('../../../model/employee/payslip/Payslip');
const Employee = require('../../../model/employee/Employee');
const Status = require('../../../model/employee/statusAndPosition/Status');
const Position = require('../../../model/employee/statusAndPosition/Position');
const Department = require('../../../model/employee/department/Department');
const Allowance = require('../../../model/employee/allowance/Allowance');
const PaymentMethod = require('../../../model/product/PaymentMethod');

// security
let auth = function (req, res, next) {
  if (req.user && req.user.administrator === 'Accountant') {
    next();
  } else {
    res.redirect('/auth/users/signin');
  }
};

/**
* @method: get 
* @access: /payroll/payslip/employee-information/display
* @private: accountant
* @description: display employee to have acess to create payroll
*/
router.get('/employee-information/display', auth, (req, res) => {
  const success = req.flash('success');
  Employee.find({}).sort({ _id: -1 }).exec((err, employee) => {
    if (err) throw err;
    res.render('employee/payslip/employeeDisplay', {
      employee,
      success
    });
  });
});

/**
 * @router : /payroll/payslip/create
 * @method : post
 * @access : accountant
 * @description : create payslip
 */
router.post('/create', (req, res) => {
  const { department_name, employee_name, position, payslip_date, allowance_1, allowance_1_amount,
    allowance_2, allowance_2_amount, status, tax, other_deduction, other_deduction_amount,
    salary, total_deduction, total_salary, total_net_pay, email, phone_1, dateOfJoining,
    total_allowance, payment_method, comment, employee_id_code, account_holder_name,
    account_number, bank_name } = req.body;
  let newPayslip = new Payslip({
    department_name,
    employee_name,
    position,
    payslip_date,
    allowance_1,
    allowance_1_amount,
    allowance_2,
    allowance_2_amount,
    status,
    tax,
    other_deduction,
    other_deduction_amount,
    salary,
    email,
    phone_1,
    dateOfJoining,
    total_deduction,
    total_salary,
    total_net_pay,
    total_allowance,
    payment_method,
    comment,
    employee_id_code,
    account_holder_name,
    account_number,
    bank_name
  });
  newPayslip.save((err) => {
    if (err) throw err;
    req.flash('success', 'payment slip create successful');
    res.redirect('/payroll/payslip/display');
  });
});

/**
* @method: get 
* @access: /payroll/payslip/employee-information/create/:id
* @private: now accountant
* @description: edit employee-information to create payroll
*/
router.get('/employee-information/create/:id', auth, (req, res) => {
  Employee.findById({ _id: req.params.id }, (err, employee) => {
    if (err) throw err;
    Department.find((err, department) => {
      if (err) throw err;
      Status.find((err, status) => {
        if (err) throw err;
        Position.find((err, position) => {
          if (err) throw err;
          Allowance.find((err, allowance) => {
            if (err) throw err;
            PaymentMethod.find((err, payment) => {
              if (err) throw err; 
              res.render('employee/payslip/payslip', {
                employee,
                department,
                status,
                position,
                allowance,
                payment
              });
            });
          });
        });
      });
    });
  });
});

/**
 * @router : /payroll/payslip/display
 * @method : get
 * @access : accountant
 * @description : display payslip
 */
router.get('/display', auth, (req, res) => {
  const success = req.flash('success');
  const danger = req.flash('danger');
  Payslip.find({}).sort({ _id: -1 }).exec((err, payslip) => {
    if (err) throw err;
    res.render('employee/payslip/payslipDisplay', {
      success,
      danger,
      payslip,
    });
  });
});

/**
 * @router : /payroll/payslip/display/each/id
 * @method : get
 * @access : accountant
 * @description : display payslip by individual
 */
router.get('/display/each/:id', auth, (req, res) => {
  Payslip.findById({ _id: req.params.id }, (err, payslip) => {
    if (err) throw err;
    res.render('employee/payslip/payslipDisplayEach', {
      payslip
    });
  });
});

/**
 * @router : /payroll/payslip/print-payslip/invoice/each/id
 * @method : get
 * @access : accountant
 * @description : display payslip by individual
 */
router.get('/print-payslip/invoice/each/:id', auth, (req, res) => {
  Payslip.findById({ _id: req.params.id }, (err, payslip) => {
    if (err) throw err;
    res.render('employee/payslip/printPayslip', {
      payslip
    });
  });
});

/**
 * @router : /payroll/payslip/employee-information/delete/id
 * @method : get
 * @access : accountant
 * @description : delete employee show to accountant by individual
 */
router.get('/employee-information/delete/:id', auth, (req, res) => {
  Employee.findOneAndDelete({ _id: req.params.id }, (err) => {
    if (err) throw err;
    req.flash('success', 'employee delete successful');
    res.redirect('/payroll/payslip/employee-information/display');
  });
});

module.exports = router;