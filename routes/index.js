var express = require('express');
var router = express.Router();

// create authentication system,
// this auth system only uses token.
// this machine does not communicate directly with FE, only with another BE machine

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ hello: process.env.environment });
});

router.post('/test', function(req, res, next){
  fetch('http:localhost:7000/token', {
    method: 'POST',
    body: JSON.stringify({
      token: 2457872398457907
    }),

  })
  .then(console.log)
  .catch(console.error)
})

module.exports = router;
