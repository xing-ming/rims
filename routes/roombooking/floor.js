const express = require('express');
const router = express.Router();
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
 * @route : /room/floor/create
 * @access: front office
 * @method: get
 * @description: create floor
 */
router.get('/create', auth, (req, res) => {
  const success = req.flash('success');
  const danger = req.flash('danger');
  Floor.find((err, floor) => {
    if (err) throw err;
    res.render('roombooking/room/first_catalog', {
      success,
      danger,
      floor
    });
  });
});

/**
 * @route : /room/floor/create
 * @access: front office
 * @method: post
 * @description: create floor
 */
router.post('/create', (req, res) => {
  addFloor(req, res);
});

/**
 * @route : /room/floor/create
 * @access: front office
 * @method: post
 * @description: create floor call function
 */
function addFloor(req, res) {
  Floor.findOne({ floor_name: req.body.floor_name }, (err, floor_name) => {
    if (floor_name) {
      req.flash('danger', `${req.body.floor_name} already exist`);
      res.redirect('/room/floor/create');
    } else {
      const { floor_name, floor_range } = req.body;
      const newFloor = new Floor({
        floor_name,
        floor_range
      });
      newFloor.save((err) => {
        if (err) throw err;
        req.flash('success', `${floor_name} save`);
        res.redirect('/room/floor/create');
      });
    }
  });
}

/**
 * @route : /room/floor/delete/id
 * @access: front desk
 * @description: delete floor
 */
router.get('/delete/:id', auth, (req, res) => {
  Floor.findByIdAndDelete({ _id: req.params.id }, (err) => {
    if (err) throw err;
    req.flash('success', 'delete successful');
    res.redirect('/room/floor/create');
  });
});

module.exports = router;