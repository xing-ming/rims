const express = require('express');
const router = express.Router();

/**
 * @method : get
 * @route : /front-office-home
 * @access : all
 * @description: display home page
 */
router.get('/', (req, res) => {
  const success = req.flash('success');
  res.render('home/index', { success });
});

module.exports = router;
