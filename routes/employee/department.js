var express = require('express');
var router = express.Router();
const Department = require('../../model/employee/Department');

/**
* @method: get 
* @access: /employee/department/create
* @private: ict
* @description: display create department
*/
router.get('/create', (req, res) => {
  res.render('employee/department');
});

/**
 * @method: post { create, update, delete }
 * @access: /employee/department/create
 * @private: ict
 * @description: create department
 */
router.post('/create', function (req, res) {
  if (req.body.department_id === '') {
    createDepartment(req, res)
  } else {
    updateDepartment(req, res)
  }
});

// create department function call
function createDepartment(req, res) {
  Department.findOne({ department_name: req.body.department_name }, (err, department_name) => {
    if (department_name) {
      req.flash('danger', `${req.body.department_name} already exist`);
      res.redirect('/employee/department/displayDepartment');
    } else {
      newDep = new Department({
        department_name: req.body.department_name,
        department_code: req.body.department_code
      });
      newDep.save((err) => {
        if (err) {
          console.log(`Unable to save department: ${err}`);
        }
        req.flash('success', 'save successful');
        res.redirect('/employee/department/displayDepartment')
      });
    }
  });
}

/**
 * @method: get
 * @access: /employee/department/edit/id
 * @description: edit employee
 * @private: ict
 */
router.get('/edit/:id', (req, res) => {
  Department.findById({ _id: req.params.id }, (err, department) => {
    if (err) {
      console.log(`Unable to edit department: ${err}`);
    }
    res.render('employee/department', { department });
  });
});

/**
 * @method: update call function
 * @description: update department
 * @private: ict
 */
function updateDepartment(req, res) {
  Department.findByIdAndUpdate({ _id: req.body.department_id }, req.body, { new: true }, (err) => {
    if (err) {
      console.log(`Unable to update department: ${err}`);
    }
    req.flash('success', 'update successful');
    res.redirect('/employee/department/displayDepartment');
  });
}

/**
 * @method: get
 * @access: /employee/department/delete/id
 * @private: ict
 * @description: delete department
 */
router.get('/delete/:id', (req, res) => {
  Department.findByIdAndDelete({ _id: req.params.id }, (err) => {
    if (err) {
      console.log(`Unable to delete department: ${err}`);
    }
    req.flash('success', 'delete successful');
    res.redirect('/employee/department/displayDepartment');
  });
});

/**
* @method: get 
* @access: /employee/department/displayDepartment
* @private: ict
* @description: display department
*/
router.get('/displayDepartment', (req, res) => {
  const success = req.flash('success');
  const danger = req.flash('danger');
  Department.find({}).sort({ department_name: -1 }).exec((err, department) => {
    if (err) {
      console.log(`Unable to display department: ${err}`);
    }
    res.render('employee/displayDepartment', { department, success, danger });
  });
});

module.exports = router;
