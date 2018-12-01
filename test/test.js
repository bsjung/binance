const api = require('upbit-api');

var env = require('node-env-file');
env(__dirname + '/upbit.key');

console.log('key ', process.env.key);
console.log('secret ', process.env.secret);

const upbitRest = new api.UpbitRest({
  key: process.env.key, // Get this from your account on upbit.com
  secret: process.env.secret, // Same for this
  timeout: 15000, // Optional, defaults to 15000, is the request time out in milliseconds
  recvWindow: 10000, // Optional, defaults to 5000, increase if you're getting timestamp errors
  disableBeautification: false
  //
  // Optional, default is false. Upbit's API returns objects with lots of one letter keys.  By
  // default those keys will be replaced with more descriptive, longer ones.
  //
});


// REST
/*
upbitRest.allOrders({
      symbol: 'BNBBTC'  // Object is transformed into a query string, timestamp is automatically added
  })
  .then((data) => {
      console.log(data);
  })
  .catch((err) => {
      console.error(err);
  });
*/

// coins
upbitRest.markets()
  .then((data) => {
      //console.log(data);
      // WebSocket
      const  upbitWS = new api.UpbitWS();

      var coins = [];
      for (var i=0; i<data.length; i++) {
        coins.push(data[i]['market']);
      }
      console.log(coins);

      upbitWS.onMultiTickerStream(coins, function(data) {
          console.log(data);
      });
  })
  .catch((err) => {
      console.error(err);
  });
