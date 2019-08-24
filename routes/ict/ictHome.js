let express = require('express');
let router = express.Router();

/**
 * @method: get
 * @access: /ict/home/ict-home
 * @private: ict
 * @description: display ict home base
 */
router.get('/ict-home', (req, res) => {
  res.render('ict/ictHome');
});

module.exports = router;
