const express = require('express');
const router = express.Router();
const Bedding = require('../../model/roombooking/room/Bedding');
const Floor = require('../../model/roombooking/room/Floor');
const Room = require('../../model/roombooking/room/Room');
const RoomNumber = require('../../model/roombooking/room/RoomNumber');
const Reservation = require('../../model/roombooking/Reservation');

// security
let auth = function (req, res, next) {
  if (req.user && req.user.administrator === 'Front_office') {
    next();
  } else {
    res.redirect('/auth/users/signin');
  }
};

/**
 * @route : /guest/reservation/create
 * @access: front office
 * @method: get
 * @description: create room for guest using personal information
 */
router.get('/create', auth, (req, res) => {
  Bedding.find((err, bed) => {
    if (err) throw err;
    Floor.find((err, floor) => {
      if (err) throw err;
      Room.find((err, room) => {
        if (err) throw err;
        RoomNumber.find((err, roomNumber) => {
          if (err) throw err;
          res.render('roombooking/reservation', {
            bed,
            floor,
            room,
            roomNumber
          });
        });
      });
    });
  });
});

/**
 * @route : /guest/reservation/create
 * @access: front office
 * @method: post
 * @description: create room (reservation) for guest using personal information
 */
router.post('/create', (req, res) => {
  if (req.body.guest_id === '') {
    addReservation(req, res);
  } else {
    updateReservation(req, res);
  }
});

/**
 * @route : /guest/reservation/create
 * @access: front office
 * @method: post
 * @description: create room (reservation) call function
 */
function addReservation(req, res) {
  const { name, username, floor, room_type, email, room_number, number_of_people,
    phone, bed_type, state, check_in, country, check_out, price } = req.body;
  let newReservation = new Reservation({
    name,
    username,
    floor,
    room_type,
    email,
    room_number,
    number_of_people,
    phone,
    bed_type,
    state,
    check_in,
    country,
    check_out,
    price
  });
  newReservation.save((err) => {
    if (err) throw err;
    req.flash('success', `Please confirm room number ${req.body.room_number}`);
    res.redirect('/room/room-number/display');
  });
}

/**
 * @route : /guest/reservation/edit/id
 * @access: front desk
 * @description: edit reservation
 */
router.get('/edit/:id', auth, (req, res) => {
  Reservation.findById({ _id: req.params.id }, (err, guest) => {
    if (err) throw err;
    Bedding.find((err, bed) => {
      if (err) throw err;
      Floor.find((err, floor) => {
        if (err) throw err;
        Room.find((err, room) => {
          if (err) throw err;
          RoomNumber.find((err, roomNumber) => {
            if (err) throw err;
            res.render('roombooking/reservation', {
              bed,
              floor,
              room,
              roomNumber,
              guest
            });
          });
        });
      });
    });
  });
});

/**
 * @route : /guest/reservation/edit/id
 * @access: front desk
 * @description: edit reservation
 */
function updateReservation(req, res) {
  Reservation.findByIdAndUpdate({
    _id: req.body.guest_id
  }, req.body, {
    new: true
  }, (err) => {
    if (err) throw err;
    req.flash('success', 'Reservation successfully updated !!!');
    res.redirect('/guest/reservation/display');
  });
}

/**
 * @route : /guest/reservation/display
 * @access: front office
 * @method: get
 * @description: display room (reservation)
 */
router.get('/display', auth, (req, res) => {
  const success = req.flash('success');
  Reservation.find({}).sort({ _id: -1 }).exec((err, reservation) => {
    if (err) throw err;
    res.render('roombooking/displayReservation', {
      success,
      reservation
    });
  });
});

/**
 * @route : /guest/reservation/details/id
 * @access: front office
 * @method: get
 * @description: display room (reservation)
 */
router.get('/details/:id', auth, (req, res) => {
  Reservation.findById({ _id: req.params.id }, (err, guest) => {
    if (err) throw err;
    res.render('roombooking/displayEachGuest', {
      guest
    });
  });
});

/**
 * @route : /guest/reservation/delete/id
 * @access: front desk
 * @description: delete room number
 */
router.get('/delete/:id', auth, (req, res) => {
  Reservation.findByIdAndDelete({ _id: req.params.id }, (err) => {
    if (err) throw err;
    req.flash('success', 'delete successful please update room number');
    res.redirect('/guest/reservation/display');
  });
});

module.exports = router;