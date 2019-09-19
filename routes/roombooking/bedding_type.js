const express = require('express');
const router = express.Router();
const Bedding = require('../../model/roombooking/room/Bedding');

// security
let auth = function (req, res, next) {
  if (req.user && req.user.administrator === 'Front_office') {
    next();
  } else {
    res.redirect('/auth/users/signin');
  }
};

/**
 * @route : /room/bedding-type/create
 * @access: front office
 * @method: post
 * @description: create bedding type
 */
router.post('/create', (req, res) => {
  addBedType(req, res);
});

/**
 * @route : /room/bedding-type/create
 * @access: front office
 * @method: post
 * @description: create bed type call function
 */
function addBedType(req, res) {
  Bedding.findOne({ bed_type: req.body.bed_type }, (err, bed_type) => {
    if (bed_type) {
      req.flash('danger', `${req.body.bed_type} bed already exist`);
      res.redirect('/room/room-type/create');
    } else {
      const { bed_type } = req.body;
      const newBedType = new Bedding({
        bed_type
      });
      newBedType.save((err) => {
        if (err) throw err;
        req.flash('success', `${bed_type} save`);
        res.redirect('/room/room-type/create');
      });
    }
  });
}

/**
 * @route : /room/bedding-type/delete/id
 * @access: front desk
 * @description: delete bed type
 */
router.get('/delete/:id', auth, (req, res) => {
  Bedding.findByIdAndDelete({ _id: req.params.id }, (err) => {
    if (err) throw err;
    req.flash('success', 'delete successful');
    res.redirect('/room/room-type/create');
  });
});

module.exports = router;