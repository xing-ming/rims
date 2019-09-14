const express = require('express');
const router = express.Router();
const Users = require('../../../model/auth/Users');

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
 * @route : /manager/signup/users/display
 * @method: get
 * @description: display sign up users
 * @access: manager
 */
router.get('/display', auth, (req, res) => {
  const success = req.flash('success');
  Users.find({}).sort({ _id: -1 }).exec((err, users) => {
    if (err) throw err;
    res.render('manager/users/displayUsers', {
      success,
      users
    })
  });
});

/**
 * @route : /manager/signup/users/delete/id
 * @method: get
 * @description: delete sign up users
 * @access: manager
 */
router.get('/delete/:id', auth, (req, res) => {
  Users.findByIdAndDelete({ _id: req.params.id }, (err) => {
    if (err) throw err;
    req.flash('success', 'user deleted successful');
    res.redirect('/manager/signup/users/display');
  });
});

module.exports = router;