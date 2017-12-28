var express = require('express');
var router = express.Router();
const config = require('config');

// create authentication system,
// this auth system only uses token.
// this machine does not communicate directly with FE, only with another BE machine

/* CHARGE */
router.post('/token', (req, res, next) => {
    
    if(!req.body.hasOwnProperty('transaction_details') ||
       !req.body.hasOwnProperty('item_details') ||
       !req.body.hasOwnProperty('customer_details')
      ){
        return res.status(400).json({reason: 'Some Required fields are empty'});
    }

    let transaction_details = req.body.transaction_details;
        transaction_details.gross_amount = Number(transaction_details.gross_amount);
    let item_details = req.body.item_details;
    let customer_details = req.body.customer_details;

    const url = config.midtrans.snap;
    const serverKey = config.midtrans.Server_Key + ':';
    const encodeServerKey = new Buffer(serverKey).toString('base64');
    fetch(url, { 
        method: 'POST', 
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Basic ${encodeServerKey}`
        },
        body: JSON.stringify({
            transaction_details,
            item_details,
            customer_details,
        })
    })
    .then(result => result.json())
    .then(result => res.json(result))
    .catch(err => res.send(err));
});

/* POST */
/** fetch payment status from midtrans*/
router.post('/status', function(req, res, next) {
    // req.body.authToken
    fetch(config.midtrans.snap)
    .then(result => result.json())
    .then(result => res.json(result))
    .catch(err => req.status(400).json({reason: 'midtrans failed ' + err}))
  });


  
router.get('/unfinish');
router.get('/error');
router.get('/notification');

/* Midtrans will use this token 
   to notify the result of the payment */
router.get('/finish', function(req, res, next) {

    const url = config.midtrans.snap;
    const serverKey = config.midtrans.Server_Key + ':';
    const encodeServerKey = new Buffer(serverKey).toString('base64');
    fetch(url, { 
        method: 'POST', 
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `BASIC ${serverKey}`
        },
        body: JSON.stringify({
            "transaction_details": {
              "order_id": "ORDER-101",
              "gross_amount": 10000
            }
          })
    })
    .then(result => {
        res.send(result)
    });
});


/** POST status payment to User */
// can user initiate request?




module.exports = router;
