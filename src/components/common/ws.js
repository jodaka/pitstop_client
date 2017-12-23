/* global EventEmitter:tru */
angular.module('k.services').service('ws', [
    'AppConfig', 'eventsList',
    function wsFactory (AppConfig, EVENTS) {
        // Implement automatic reconnect interface on top of standart
        // websockets API
        let ws = null;
        const wsReconnectTimeout = 5 * 1000;
        const wsTimeout = 2500;
        let wsTimeoutHit = false;
        let keepAliveInterval = null;
        let wsConnected = false;

        const emitter = new EventEmitter();
        let eventer;

        const emit = function() {
            const params = Array.prototype.slice.call(arguments, 0);

            if (ws) {
                const wsParams = params[1];
                wsParams.event = params[0];
                ws.send(JSON.stringify(wsParams));
            }

            emitter.emit.apply(this, params);
        };

        const disconnectWS = function() {
            if (ws && wsConnected) {
                ws.onclose = function() {};
                ws.connected = false;
                ws.close();
                ws = null;
            }
        };


        const wsOnopen = function() {
            console.log(1, ' ws connection established');

            keepAliveInterval = setInterval(() => {
                ws.send('ping');
            }, 30000);

            wsConnected = true;
            eventer.emitLocal(EVENTS.WS_CONNECTED);
        };

        const wsOnclose = function() {
            clearInterval(keepAliveInterval);
            console.log(1, ' ws connection closed ');
            wsConnected = false;
            eventer.emitLocal(EVENTS.WS_DISCONNECTED);
        };

        const wsOnmessage = function(evt) {
            if (!evt || !evt.data) {
                return null;
            }

            if (evt.data === 'pong') {
                return null;
            }

            try {
                const data = JSON.parse(evt.data);
                // return {
                //     'type': data[ 0 ],
                //     'data': data[ 1 ]
                // };

                if (data[0]) {
                    eventer.emitLocal(data[0], data[1]);
                } else {
                    console.warn('onMessage no event type', data, evt);
                }
            } catch (e) {
                console.error(e, evt.data);
            }

            return null;
        };

        const wsOnerror = function(evt) {
            console.error(evt);
        };

        var connectWS = function(isReconnecting) {
            ws = new WebSocket(AppConfig.ws.url);

            const localWS = ws;

            const _timeout = setTimeout(() => {
                wsTimeoutHit = true;
                localWS.close();
                wsTimeoutHit = false;
            }, wsTimeout);

            ws.onopen = function(evt) {
                clearTimeout(_timeout);
                isReconnecting = false;
                wsOnopen(evt);
            };

            ws.onclose = function(evt) {
                clearTimeout(_timeout);
                ws = null;

                if (!isReconnecting && !wsTimeoutHit) {
                    wsOnclose(evt);
                }

                setTimeout(() => {
                    connectWS(true);
                }, wsReconnectTimeout);
            };

            ws.onmessage = wsOnmessage;
            ws.onerror = wsOnerror;
        };

        // basic EventEmitter wrapper to provide websocket events
        eventer = {
            on: emitter.on,
            off: emitter.off,
            emit,
            emitLocal: emitter.emit,
            isConnected () {
                return wsConnected;
            },
            disconnect: disconnectWS,
            connect: connectWS
        };

        // connectWS();

        return eventer;
    }]);
