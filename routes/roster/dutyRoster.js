const express = require('express');
const router = express.Router();
const Employee = require('../../model/employee/Employee');
const Roster = require('../../model/roster/Roster');

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
 * @route : /employee/duty-roster/create/id
 * @method: get
 * @access: ict
 * @description: create duty roster
 */
router.get('/create/:id', auth, (req, res) => {
  Employee.findById({ _id: req.params.id }, (err, employee) => {
    if (err) throw err;
    res.render('roster/dutyRoster', {
      employee
    })
  });
});

/** 
 * @route : /employee/duty-roster/create-roster
 * @method: post
 * @access: ict
 * @description: create duty roster
 */
router.post('/create-roster', (req, res) => {
  const { employee_id, employee, session_task, session_task_start, session_task_end } = req.body;
  let newRoster = new Roster({
    employee_id,
    employee,
    session_task,
    session_task_start,
    session_task_end
  });
  newRoster.save((err) => {
    if (err) throw err;
    req.flash('success', 'duty roster created');
    res.redirect('/employee/duty-roster/display');
  });
});

/** 
 * @route : /employee/duty-roster/display
 * @method: get
 * @access: ict
 * @description: display duty roster
 */
router.get('/display', auth, (req, res) => {
  const success = req.flash('success');
  Roster.find((err, roster) => {
    if (err) throw err;
    res.render('roster/displayDutyRoster', {
      roster,
      success
    })
  });
});

/** 
 * @route : /employee/duty-roster/delete/id
 * @method: get
 * @access: ict
 * @description: delete duty roster
 */
router.get('/delete/:id', auth, (req, res) => {
  Roster.findByIdAndDelete({ _id: req.params.id },(err, roster) => {
    if (err) throw err;
    req.flash('success', 'roster delete successful')
    res.redirect('/employee/duty-roster/display')
  });
});

module.exports = router;