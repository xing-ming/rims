const express = require('express');
const router = express.Router();
const passport = require('passport');
let csrf = require('csurf'),
  csrfProtection = csrf();
router.use(csrfProtection);

/**
 * @access: /auth/users/signin
 * @author: admin
 * @method: get
 * @description: signin page
 */
router.get('/signin', (req, res) => {
  res.render('auth/signin', {
    csrfToken: req.csrfToken()
  });
});

/**
 * @access: /auth/users/signin
 * @author: admin
 * @method: post
 * @description: signin page
 */
router.post('/signin', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/users/signin',
    failureFlash: true,
    successFlash: true
  })(req, res, next);
});

/**
 * @access: /auth/users/logout
 * @author: all
 * @method: get
 * @description: logout route
 */
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;