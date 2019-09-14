let express = require('express');
let router = express.Router();

// security
let auth = function (req, res, next) {
  if (req.user && req.user.administrator === 'Accountant') {
    next();
  } else {
    req.flash('auth_danger', 'Please sign in to continue !!!!!');
    res.redirect('/auth/users/signin');
  }
};

/**
 * @method: get
 * @access: /accountant/home/accountant-home
 * @private: accountant
 * @description: display accountant home base
 */
router.get('/accountant-home', auth, (req, res) => {
  res.render('accountant/accountantHome');
});

module.exports = router;
