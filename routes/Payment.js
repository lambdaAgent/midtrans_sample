var express = require('express');
var router = express.Router();
const config = require('config');
const fetch = require('node-fetch');


// create authentication system,
// this auth system only uses token.
// this machine does not communicate directly with FE, only with another BE machine

/* CHARGE */
router.post('/token', (req, res, next) => {
    if(!req.body.hasOwnProperty('transaction_detail')){
        res.status(400)
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
})

/* GET token */
router.get('/token2', function(req, res, next) {

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

/* POST */
router.get('/', function(req, res, next) {
    // req.body.authToken
    const ccData =  req.body.ccData;
    const grossPrice = req.body.grossPrice;
    
    const serverKey = "94960ece-9513-4265-9cf2-67a4da330213:"
    const encodeServerKey = new Buffer(serverKey).toString('base64');
    console.log(serverKey);
    fetch(config.midtrans.apiUrl, { 
        method: 'POST', 
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": serverKey 
        },
        body: 'a=1' 
    })
    .then(result => {
        res.send(result)
    });
});

module.exports = router;
