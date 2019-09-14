const express = require('express');
const router = express.Router();
const Roster = require('../../../model/roster/Roster');

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
 * @route : /manager/employee/duty-roster/display
 * @method: get
 * @access: manager
 * @description: display duty roster
 */
router.get('/display', auth, (req, res) => {
  const success = req.flash('success');
  Roster.find((err, roster) => {
    if (err) throw err;
    res.render('manager/roster/displayDutyRoster', {
      roster,
      success
    })
  });
});

module.exports = router;