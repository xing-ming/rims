const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Users = require('../../model/auth/Users');

/**
 * @access: /auth/users/signup
 * @author: admin
 * @method: get
 * @description: signup page
 */
router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

/**
 * @access: /auth/users/signup
 * @author: admin
 * @method: post
 * @description: signup page
 */
router.post('/signup', (req, res) => {
  console.log(req.body);
  const { name, email, password, password2, administrator } = req.body;
  let errors = [];

  // check required fields
  if (!name || !email || !password || !password2 || !administrator) {
    errors.push({ msg: 'Please fill the fields' });
  }

  // check password match
  if (password !== password2) {
    errors.push({ msg: 'Password do not match' });
  }

  // check password length
  if (password.length < 6) {
    errors.push({ msg: 'Password must be up to 6 or more' });
  }

  // check error
  if (errors.length > 0) {
    res.render('auth/signup', {
      errors, name, email, password, password2, administrator
    });
  } else {
    Users.findOne({ email: email })
      .then(user => {
        if (user) {
          // user exist
          errors.push({ msg: 'Email in use' });
          res.render('auth/users', {
            errors,
            name,
            email,
            password,
            password2,
            administrator
          });
        } else {
          const newUser = new Users({
            name, email, password, administrator
          });
          // Hash password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) {
                throw err;
              }
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'Continue');
                  res.redirect('/auth/users/signup');
                })
                .catch((err) => { console.log(err) });
            });
          });
        }
      })
  }
});

module.exports = router;