const express = require('express');
const router = express.Router();
const Attendance = require('../../model/attendance/Attendance');

/**
 * @method : post
 * @route : /attendance/create
 * @access : all
 * @description: create attendance
 */
router.post('/create', (req, res) => {
  if (req.body.attendance_id === '') {
    createAttendance(req, res);
  } else {
    updateAttendance(req, res);
  }
});

/**
 * @method : post
 * @route : /attendance/create
 * @access : all
 * @description: create attendance call function
 */
function createAttendance(req, res) {
  const { employee_id } = req.body;
  let newAttendance = new Attendance({
    employee_id
  });
  newAttendance.save((err) => {
    if (err) throw err;
    req.flash('success', "Welcome it's greate to have you with us.")
    res.redirect('/')
  })
}

/**
 * @method : get
 * @route : /attendance/edit/id
 * @access : all
 * @description: edit attendance
 */
router.get('/edit/:id', (req, res) => {
  Attendance.findById({ _id: req.params.id }, (err, employee_id) => {
    if (err) {
      console.log(`Unable to edit attendance: ${err}`);
    }
    res.render('home/index', { employee_id })
  });
});

/**
 * @method : get
 * @route : /attendance/edit/id
 * @access : all
 * @description: edit attendance
 */
function updateAttendance(req, res) {
  Attendance.findByIdAndUpdate({ _id: req.body.attendance_id }, req.body, { new: true }, (err) => {
    if (err) {
      console.log(`Unable to update attendance: ${err}`);
    }
    req.flash('success', 'Love you goodbye.');
    res.redirect('/');
  });
}

/**
 * @method : get
 * @route : /attendance/display
 * @access : all
 * @description: display attendance
 */
router.get('/display', (req, res) => {
  Attendance.find({}).sort({ employee_id: -1 }).exec((err, employee_id) => {
    if (err) throw err;
    res.render('attendance/displayAttendance', {
      employee_id
    })
  });
});

module.exports = router;
