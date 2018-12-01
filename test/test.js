<<<<<<< HEAD
const api = require('upbit-api');

var env = require('node-env-file');
env(__dirname + '/upbit.key');
=======
const api = require('binance-api');

var env = require('node-env-file');
env(__dirname + '/binance.key');
>>>>>>> 8e008d41d49aafe84bb800c1f9b15212c1a00ff9

console.log('key ', process.env.key);
console.log('secret ', process.env.secret);

<<<<<<< HEAD
const upbitRest = new api.UpbitRest({
  key: process.env.key, // Get this from your account on upbit.com
=======
const binanceRest = new api.BinanceRest({
  key: process.env.key, // Get this from your account on binance.com
>>>>>>> 8e008d41d49aafe84bb800c1f9b15212c1a00ff9
  secret: process.env.secret, // Same for this
  timeout: 15000, // Optional, defaults to 15000, is the request time out in milliseconds
  recvWindow: 10000, // Optional, defaults to 5000, increase if you're getting timestamp errors
  disableBeautification: false
  //
<<<<<<< HEAD
  // Optional, default is false. Upbit's API returns objects with lots of one letter keys.  By
=======
  // Optional, default is false. Binance's API returns objects with lots of one letter keys.  By
>>>>>>> 8e008d41d49aafe84bb800c1f9b15212c1a00ff9
  // default those keys will be replaced with more descriptive, longer ones.
  //
});


// REST
<<<<<<< HEAD
/*
upbitRest.allOrders({
=======
binanceRest.allOrders({
>>>>>>> 8e008d41d49aafe84bb800c1f9b15212c1a00ff9
      symbol: 'BNBBTC'  // Object is transformed into a query string, timestamp is automatically added
  })
  .then((data) => {
      console.log(data);
  })
  .catch((err) => {
      console.error(err);
  });
<<<<<<< HEAD
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
=======

// WebSocket
const binanceWS = new api.BinanceWS();

binanceWS.onAllTickerStream( (data) => {
  console.log(data);
});

/*
binanceWS.onDepthUpdate('BNBBTC', (data) => {
  console.log(data);
});

binanceWS.onAggTrade('BNBBTC', (data) => {
  console.log(data);
});

binanceWS.onKline('BNBBTC', '1m', (data) => {
  console.log(data);
});
*/
>>>>>>> 8e008d41d49aafe84bb800c1f9b15212c1a00ff9
