"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var net_1 = require("net");
function checkPort(port, host, basePort) {
    if (basePort === void 0) { basePort = 49152; }
    return new Promise(function (resolve, reject) {
        function _getPort(portNumber) {
            if (portNumber > 65535) {
                reject(new Error("There is no port available."));
            }
            var server = net_1.default.createServer();
            server
                .once('error', function (err) {
                if (err.code !== 'EADDRINUSE') {
                    reject(err);
                }
                else if (port === 0) {
                    _getPort(portNumber + 1);
                }
                else {
                    // If the port isn't available and we weren't looking for any port, throw error.
                    reject(new Error("Port " + port + " is already in use. Use '--port' to specify a different port."));
                }
            })
                .once('listening', function () {
                server.close();
                resolve(portNumber);
            })
                .listen(portNumber, host);
        }
        _getPort(port || basePort);
    });
}
exports.checkPort = checkPort;