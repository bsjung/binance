const WebSocket = require('ws');
const Beautifier = require('./beautifier.js');

class BinanceWS {

    constructor() {
        this._baseUrl = 'wss://stream.binance.com:9443/ws/'
        this._multiBaseUrl = 'wss://stream.binance.com:9443/'
        this._sockets = {};
        this._beautifier = new Beautifier();
    }

    _setupWebSocket(eventHandler, path) {
        if (this._sockets[path]) {
            return this._sockets[path];
        }
        path = this._baseUrl + path;
        const ws = new WebSocket(path);
        let reconnect = () => {
          setTimeout(() => {this._setupWebSocket(eventHandler, path)}, 3000);
				};

        ws.on('message', (json) => {
          try{
            const data = JSON.parse(json);
            eventHandler(this._beautifier.beautify(data, data.e + 'Event'));
          } catch(error) {
            console.log(`Unable to parse JSON:`)
            console.log(error)
            console.log(json)
          }

        });
        ws.on('open', () => {
          console.log('Connected to Websocket: ' + path);
        });
        ws.on('close',  (e) => {
          switch (e) {
		        case 1000:	// CLOSE_NORMAL
			        console.log("Disconnected from Websocket: ' + path");
			        break;
            default:	// Abnormal closure
              console.log("WebSocket reconnecting to: "  + path);
			        reconnect();
			        break;
		      }
        });
        ws.on('error',(error)=>{
          switch (error.code) {
            case 'ECONNREFUSED':
              reconnect();
              break;
            default:
              console.log("WebSocket connection error: " + error.message);
              break;
          }
        });


        return ws;
    }

    _setupMultiWebSocket(eventHandler, path) {
        if (this._sockets[path]) {
            return this._sockets[path];
        }
        path = this._multiBaseUrl + path;
        const ws = new WebSocket(path);
        ws.on('message', (json) => {
            const data = JSON.parse(json);
            eventHandler(this._beautifier.beautify(data, data.e + 'Event'));
        });
        return ws;
    }

    onDepthUpdate(symbol, eventHandler) {
        const path = `${symbol.toLowerCase()}@depth`;
        return this._setupWebSocket(eventHandler, path);
    }

    onKline(symbol, interval, eventHandler) {
        const path = `${symbol.toLowerCase()}@kline_${interval}`;
        return this._setupWebSocket(eventHandler, path);
    }

    onAggTrade(symbol, eventHandler) {
        const path = `${symbol.toLowerCase()}@aggTrade`;
        return this._setupWebSocket(eventHandler, path);
    }

    onAllTickerStream(eventHandler) {
        const path = `!ticker@arr`;
        return this._setupWebSocket(eventHandler, path);
    }

    onTickerStream(symbol, eventHandler) {
        const path = `${symbol.toLowerCase()}@ticker`;
        return this._setupWebSocket(eventHandler, path);
    }

    onMultiTickerStream(symbols, eventHandler) {
      var streams =''
      symbols.forEach(function(element) {
        streams += element.toLowerCase() + '@ticker/'
      });
        //const path = `stream?streams=${streams}`;
        //const path = 'stream?streams=adaeth@ticker'
       const path = ' /stream?streams=adaeth@ticker/xvgeth@ticker'
        console.log(path)

        return this._setupMultiWebSocket(eventHandler, path);
    }

    onUserData(binanceRest, eventHandler, interval) {
        return binanceRest.startUserDataStream()
            .then((response) => {
                return this._setupWebSocket(eventHandler, response.listenKey);
                setInterval(() => {
                    binanceRest.keepAliveUserDataStream(response);
                }, interval || 60000);
            });
    }
}

module.exports = BinanceWS;
