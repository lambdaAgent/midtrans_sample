var express = require('express');
var router = express.Router();
const fetch = require('whatwg-fetch');
const userController = require('../Controller/userController')
// create authentication system,
// this auth system only uses token.
// this machine does not communicate directly with FE, only with another BE machine

/* GET home page. */
// router.get('/', userController.);

router.post('/test', userController.checkToken)

module.exports = router;
