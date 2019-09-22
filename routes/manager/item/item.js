const express = require('express');
const router = express.Router();
const Item = require('../../../model/product/Item');

// security
let auth = function(req, res, next) {
  if (req.user && req.user.administrator === 'Manager' || req.user && req.user.administrator === 'Developer') {
    next();
  } else {
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
  const success = req.flash('success');
  Item.find({}).sort({
    _id: -1
  }).exec((err, items) => {
    if (err) throw err
    res.render('manager/item/itemDisplay', {
      items,
      success
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
