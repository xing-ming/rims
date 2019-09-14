const express = require('express');
const router = express.Router();

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
 * @access: /manager/home/manager-home
 * @private: manager
 * @description: manager home
 */
router.get('/home/manager-home', auth, (req, res) => {
  res.render('manager/adminHome');
});

module.exports = router;
