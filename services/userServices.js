const paymentDomain = process.env.DOMAIN;

exports.checkToken = function(token){
  return new Promise((resolve, reject) => {
    fetch('http:localhost:7000/token', {
      method: 'POST',
      body: JSON.stringify({
      token: 2457872398457907
      })
    })
    .then(console.log)
    .catch(console.error)
  })
}






