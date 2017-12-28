const paymentDomain = process.env.DOMAIN;
const fetch = require('node-fetch')

exports.checkToken = function(token){
  console.log('checkToken')
  return new Promise((resolve, reject) => {
    fetch('http://localhost:8000/token', {
      method: 'POST',
      body: JSON.stringify({
      token: 2457872398457907
      })
    })
    .then(response => {
      if(response.status === 403){
        return resolve(false)
      }
      resolve(true);
    })
    .catch(err => {
      reject(err);
      console.error(err);
    })
  })
}
