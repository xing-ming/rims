const express = require('express');
const router = express.Router();
const Reservation = require('../../../model/roombooking/Reservation');

// security
let auth = function (req, res, next) {
  if (req.user && req.user.administrator === 'Accountant') {
    next();
  } else {
    res.redirect('/auth/users/signin');
  }
};

/**
 * @route : /accountant/reservation/display
 * @access: front office
 * @method: get
 * @description: display room (reservation)
 */
router.get('/display', auth, (req, res) => {
  const success = req.flash('success');
  Reservation.find({}).sort({ _id: -1 }).exec((err, reservation) => {
    if (err) throw err;
    res.render('accountant/roombooking/displayReservation', {
      reservation
    });
  });
});

module.exports = router;