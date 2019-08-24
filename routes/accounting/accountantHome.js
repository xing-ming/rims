let express = require('express');
let router = express.Router();

/**
 * @method: get
 * @access: /accountant/home/accountant-home
 * @private: accountant
 * @description: display accountant home base
 */
router.get('/accountant-home', (req, res) => {
  res.render('accountant/accountantHome');
});

module.exports = router;
