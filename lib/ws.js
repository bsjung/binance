const WebSocket = require('ws');
const Beautifier = require('./beautifier.js');

class UpbitWS {

    constructor() {
        this._baseUrl = 'wss://api.upbit.com/websocket/v1/';
        this._multiBaseUrl = 'wss://api.upbit.com/websocket/v1/';
        this._beautifier = new Beautifier();
    }

    _setupWebSocket(eventHandler, data) {
        const ws = new WebSocket(this._baseUrl);
        let reconnect = () => {
          setTimeout(() => {this._setupWebSocket(eventHandler, data)}, 3000);
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
          console.log('Connected to Websocket: ' + data);
          ws.send(data);
          console.log('Send to Server ' + data);
        });
        ws.on('close',  (e) => {
          switch (e) {
		        case 1000:	// CLOSE_NORMAL
			        console.log("Disconnected from Websocket.");
			        break;
            default:	// Abnormal closure
              console.log("WebSocket reconnecting.");
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

    onTickerStream(symbol, eventHandler) {
        var codes = [symbol];
        var d = [{"ticket":"test"}, {"format" : "SIMPLE"}, {"type":"orderbook","codes":codes}]
        return this._setupWebSocket(eventHandler, JSON.stringify(d));
    }

    onMultiTickerStream(symbols, eventHandler) {
        var codes = symbols;
        var d = [{"ticket":"test"}, {"format" : "SIMPLE"}, {"type":"orderbook","codes":codes}]
        return this._setupWebSocket(eventHandler, JSON.stringify(d));
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

module.exports = UpbitWS;
