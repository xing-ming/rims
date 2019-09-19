const express = require('express');
const router = express.Router();
const RoomNumber = require('../../model/roombooking/room/RoomNumber');
const Floor = require('../../model/roombooking/room/Floor');

// security
let auth = function (req, res, next) {
  if (req.user && req.user.administrator === 'Front_office') {
    next();
  } else {
    res.redirect('/auth/users/signin');
  }
};

/**
 * @route : /room/room-number/create
 * @access: front office
 * @method: post
 * @description: create room number
 */
router.post('/create', (req, res) => {
  if (req.body.room_number_id === '') {
    addRoomNumber(req, res);
  } else {
    updateRoomNumber(req, res);
  }
});

/**
 * @route : /room/room-number/create
 * @access: front office
 * @method: post
 * @description: create room number call function
 */
function addRoomNumber(req, res) {
  RoomNumber.findOne({ room_number: req.body.room_number }, (err, room_number) => {
    if (room_number) {
      req.flash('danger', `room ${req.body.room_number} already exist`);
      res.redirect('/room/floor/create');
    } else {
      const { room_number, result } = req.body;
      const newRoomNumber = new RoomNumber({
        room_number,
        result
      });
      newRoomNumber.save((err) => {
        if (err) throw err;
        req.flash('success', `room ${room_number} save`);
        res.redirect('/room/floor/create');
      });
    }
  });
}

/**
 * @route : /room/room-number/edit/id
 * @access: front desk
 * @description: edit room number
 */
router.get('/edit/:id', auth, (req, res) => {
  RoomNumber.findById({ _id: req.params.id }, (err, roomNumber) => {
    if (err) throw err;
    Floor.find((err, floor) => {
      if (err) throw err;
      res.render('roombooking/room/first_catalog', {
        floor,
        roomNumber
      });
    });
  });
});

/**
 * @route : /room/room-number/edit/id
 * @access: front desk
 * @description: edit room number call function
 */

function updateRoomNumber(req, res) {
  RoomNumber.findByIdAndUpdate({
    _id: req.body.room_number_id
  }, req.body, {
    new: true
  }, (err) => {
    if (err) throw err;
    req.flash('success', 'done !!!');
    res.redirect('/room/room-number/display');
  });
}

/**
 * @route : /room/room-number/display
 * @access: front desk
 * @description: display room number
 */
router.get('/display', auth, (req, res) => {
  const success = req.flash('success');
  RoomNumber.find((err, roomNumber) => {
    if (err) throw err;
    res.render('roombooking/room/displayRoomNumber', {
      roomNumber,
      success
    });
  });
});

/**
 * @route : /room/room-number/delete/id
 * @access: front desk
 * @description: delete room number
 */
router.get('/delete/:id', auth, (req, res) => {
  RoomNumber.findByIdAndDelete({ _id: req.params.id }, (err) => {
    if (err) throw err;
    req.flash('success', 'delete successful');
    res.redirect('/room/floor/create');
  });
});

module.exports = router;