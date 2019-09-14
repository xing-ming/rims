const express = require('express');
const router = express.Router();
const Item = require('../../../model/ict/Item');

// security
let auth = function (req, res, next) {
  if (req.user && req.user.administrator === 'Manager') {
    next();
  } else {
    req.flash('auth_danger', 'Please sign in to continue !!!!!');
    res.redirect('/auth/users/signin');
  }
};

/**
 * @method: get
 * @route : /manager/item/display
 * @description: display item
 * @access: manager
 */
router.get('/display', auth, (req, res) => {
  Item.find({}).sort({
    item_name: -1
  }).exec((err, items) => {
    if (err) throw err
    res.render('manager/item/itemDisplay', {
      items
    });
  });
});

/**
 * @method: get
 * @route : manager/item/delete/:id
 * @description: delete item
 * @access: manager
 */
router.get('/delete/:id', auth, (req, res) => {
  Item.findByIdAndDelete({
    _id: req.params.id
  }, (err) => {
    if (err) {
      console.log(`Unable to delete item: ${err}`);
    }
    req.flash('success', 'delete successful');
    res.redirect('/manager/item/display');
  });
});

module.exports = router;
