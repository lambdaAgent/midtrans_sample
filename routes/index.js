var express = require('express');
var router = express.Router();

// create authentication system,
// this auth system only uses token.
// this machine does not communicate directly with FE, only with another BE machine

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ hello: 'world' });
});

module.exports = router;
