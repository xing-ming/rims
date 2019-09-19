const express = require('express');
const router = express.Router();

// security
let auth = function (req, res, next) {
  if (req.user && req.user.administrator === 'Front_office') {
    next();
  } else {
    res.redirect('/auth/users/signin');
  }
};

/**
 * @method: get
 * @access: front office
 * @route : /front-office-home
 */
router.get('/', auth, (req, res) => {
  res.render('frontOffice/home');
});

module.exports = router;