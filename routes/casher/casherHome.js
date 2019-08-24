let express = require('express');
let router = express.Router();

/**
 * @method: get
 * @access: /casher/home/casher-home
 * @private: casher
 * @description: display casher home base
 */
router.get('/casher-home', (req, res) => {
  res.render('casher/casherHome');
});

module.exports = router;
