const api = require('binance-api');

var env = require('node-env-file');
env(__dirname + '/binance.key');

console.log('key ', process.env.key);
console.log('secret ', process.env.secret);

const binanceRest = new api.BinanceRest({
  key: process.env.key, // Get this from your account on binance.com
  secret: process.env.secret, // Same for this
  timeout: 15000, // Optional, defaults to 15000, is the request time out in milliseconds
  recvWindow: 10000, // Optional, defaults to 5000, increase if you're getting timestamp errors
  disableBeautification: false
  //
  // Optional, default is false. Binance's API returns objects with lots of one letter keys.  By
  // default those keys will be replaced with more descriptive, longer ones.
  //
});


// REST
binanceRest.allOrders({
      symbol: 'BNBBTC'  // Object is transformed into a query string, timestamp is automatically added
  })
  .then((data) => {
      console.log(data);
  })
  .catch((err) => {
      console.error(err);
  });

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
