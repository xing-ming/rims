const express = require('express');
const router = express.Router();
const Bedding = require('../../model/roombooking/room/Bedding');
const Room = require('../../model/roombooking/room/Room');

// security
let auth = function (req, res, next) {
  if (req.user && req.user.administrator === 'Front_office') {
    next();
  } else {
    res.redirect('/auth/users/signin');
  }
};

/**
 * @route : /room/room-type/create
 * @access: front office
 * @method: get
 * @description: create room type
 */
router.get('/create', auth, (req, res) => {
  const success = req.flash('success');
  const danger = req.flash('danger');
  Room.find((err, room) => {
    if (err) throw err;
    Bedding.find((err, bedding) => {
      if (err) throw err;
      res.render('roombooking/room/second_catalog', {
        success,
        danger,
        room,
        bedding
      });
    });
  });
});

/**
 * @route : /room/room-type/create
 * @access: front office
 * @method: post
 * @description: create room type
 */
router.post('/create', (req, res) => {
  addRoomType(req, res);
});

/**
 * @route : /room/room-type/create
 * @access: front office
 * @method: post
 * @description: create room type call function
 */
function addRoomType(req, res) {
  Room.findOne({ room_type: req.body.room_type }, (err, room_type) => {
    if (room_type) {
      req.flash('danger', `${req.body.room_type} already exist`);
      res.redirect('/room/room-type/create');
    } else {
      const { room_type } = req.body;
      const newRoomType = new Room({
        room_type
      });
      newRoomType.save((err) => {
        if (err) throw err;
        req.flash('success', `${room_type} save`);
        res.redirect('/room/room-type/create');
      });
    }
  });
}

/**
 * @route : /room/room-type/delete/id
 * @access: front desk
 * @description: delete room type
 */
router.get('/delete/:id', auth, (req, res) => {
  Room.findByIdAndDelete({ _id: req.params.id }, (err) => {
    if (err) throw err;
    req.flash('success', 'delete successful');
    res.redirect('/room/room-type/create');
  });
});

module.exports = router;