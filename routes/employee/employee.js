let express = require('express');
let router = express.Router();
const Employee = require('../../model/employee/Employee');
const Department = require('../../model/employee/department/Department');
const Status = require('../../model/employee/statusAndPosition/Status');
const Position = require('../../model/employee/statusAndPosition/Position');
const Allowance = require('../../model/employee/allowance/Allowance');

// security
let auth = function (req, res, next) {
  if (req.user && req.user.administrator === 'ICT') {
    next();
  } else {
    res.redirect('/auth/users/signin');
  }
};

/**
* @method: get 
* @access: /employee/create
* @private: now ict
* @description: display create employee
*/
router.get('/create', auth, (req, res) => {
  const danger = req.flash('danger');
  Department.find((err, department) => {
    if (err) throw err;
    Status.find((err, status) => {
      if (err) throw err;
      Position.find((err, position) => {
        if (err) throw err;
        Allowance.find((err, allowance) => {
          if (err) throw err;
          res.render('employee/registration/registration', {
            department,
            status,
            position,
            allowance,
            danger
          });
        });
      });
    });
  });
});

/**
* @method: get 
* @access: /employee/create
* @private: now ict
* @description: create employee
*/
router.post('/create', (req, res) => {
  if (req.body.employee_id === '') {
    addEmployee(req, res);
  } else {
    updateEmployee(req, res);
  }
});

/**
* @method: get 
* @access: /employee/create
* @private: now ict
* @description: create employee function
*/
function addEmployee(req, res) {
  Employee.findOne({ employee_name: req.body.employee_name }, (err, employee_name) => {
    if (employee_name) {
      req.flash('danger', `${req.body.employee_name} exist already !`);
      res.redirect('/employee/create');
    } else {
      const { employee_name, email, date_of_birth, gender, phone_1, phone_2, street,
        city, state, country, marital_status, photo, department_name, status, position,
        salary, allowance_1, allowance_1_amount, allowance_2, allowance_2_amount,
        total_salary, net_pay, account_holder_name, account_number, bank_name, branch,
        tax, total_deduction, total_allowance } = req.body;
      const newEmployee = new Employee({
        employee_name, email, date_of_birth, gender, phone_1, phone_2, street,
        city, state, country, marital_status, photo, department_name, status, position,
        salary, allowance_1, allowance_1_amount, allowance_2, allowance_2_amount,
        total_salary, net_pay, account_holder_name, account_number, bank_name, branch, tax,
        total_deduction, total_allowance
      });
      newEmployee.save()
        .then(() => {
          req.flash('success', 'new employee save');
          res.redirect('/employee/display');
        })
        .catch(err => console.log(err));
    }
  });
}

/**
* @method: get 
* @access: /employee/edit/:id
* @private: now ict
* @description: edit employee
*/
router.get('/edit/:id', auth, (req, res) => {
  Employee.findById({ _id: req.params.id }, (err, employee) => {
    if (err) {
      console.log(`Unable to edit employee: ${err}`);
    }
    Department.find((err, department) => {
      if (err) throw err;
      Status.find((err, status) => {
        if (err) throw err;
        Position.find((err, position) => {
          if (err) throw err;
          Allowance.find((err, allowance) => {
            if (err) throw err;
            res.render('employee/registration/registration', {
              employee,
              department,
              status,
              position,
              allowance
            });
          });
        });
      });
    });
  });
});

/**
* @method: get 
* @access: /employee/edit/:id
* @private: now ict
* @description: update employee
*/
function updateEmployee(req, res) {
  Employee.findByIdAndUpdate({ _id: req.body.employee_id }, req.body, { new: true }, (err) => {
    if (err) {
      console.log(`Unable to update employee: ${err}`);
    }
    req.flash('success', 'update successful');
    res.redirect('/employee/display');
  });
}

/**
* @method: get 
* @access: /employee/display
* @private: now ict
* @description: display employee
*/
router.get('/display', auth, (req, res) => {
  const success = req.flash('success');
  Employee.find({}).sort({ _id: -1 }).exec((err, employee) => {
    if (err) throw err;
    res.render('employee/registration/employeeDisplay', {
      employee,
      success
    });
  });
});

/**
* @method: get 
* @access: /employee/display/personal-detail
* @private: now ict
* @description: display employee banking detail
*/
router.get('/display/personal-detail/:id', auth, (req, res) => {
  Employee.findById({ _id: req.params.id }, (err, employee) => {
    if (err) {
      console.log(`Unable to view employee: ${err}`);
    }
    res.render('employee/registration/personalDetail', { employee })
  });
});

/**
* @method: get 
* @access: /employee/display/company-detail
* @private: now ict
* @description: display employee company detail
*/
router.get('/display/company-detail/:id', auth, (req, res) => {
  Employee.findById({ _id: req.params.id }, (err, employee) => {
    if (err) {
      console.log(`Unable to view employee: ${err}`);
    }
    res.render('employee/registration/companyDetail', { employee })
  });
});

/**
* @method: get 
* @access: /employee/display/financial-detail
* @private: now ict
* @description: display employee financial detail
*/
router.get('/display/financial-detail/:id', auth, (req, res) => {
  Employee.findById({ _id: req.params.id }, (err, employee) => {
    if (err) {
      console.log(`Unable to view employee: ${err}`);
    }
    res.render('employee/registration/financialDetail', { employee })
  });
});

/**
* @method: get 
* @access: /employee/display/bank-detail
* @private: now ict
* @description: display employee bank detail
*/
router.get('/display/bank-detail/:id', auth, (req, res) => {
  Employee.findById({ _id: req.params.id }, (err, employee) => {
    if (err) {
      console.log(`Unable to view employee: ${err}`);
    }
    res.render('employee/registration/bankDetail', { employee })
  });
});

module.exports = router;