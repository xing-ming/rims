const express = require('express');
const router = express.Router();

// security
let auth = function (req, res, next) {
  if (req.user && req.user.administrator === 'ICT') {
    next();
  } else {
    req.flash('auth_danger', 'Please sign in to continue !!!!!');
    res.redirect('/auth/users/signin');
  }
};

/**
 * @method: get
 * @access: /ict/home/ict-home
 * @private: ict
 * @description: display ict home base
 */
router.get('/ict-home', auth, (req, res) => {
  res.render('ict/ictHome');
});

module.exports = router;
