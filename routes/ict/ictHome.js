let express = require('express');
let router = express.Router();
let Category = require('../../model/ict/Category');
let Brand = require('../../model/ict/Brand');

/**
 * @method: get
 * @access: /ict/home/ict-home
 * @private: ict
 * @description: display ict home base
 */
router.get('/ict-home', (req, res) => {
  Category.find((err, doc) => {
    if (err) throw err;
    Brand.find((err, docs) => {
      res.render('ict/ictHome', {docs, doc});
    })
  })
});

module.exports = router;
