"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = __importDefault(require("net"));
function checkPort(port, host, basePort = 49152) {
    return new Promise((resolve, reject) => {
        function _getPort(portNumber) {
            if (portNumber > 65535) {
                reject(new Error(`There is no port available.`));
            }
            const server = net_1.default.createServer();
            server
                .once('error', (err) => {
                if (err.code !== 'EADDRINUSE') {
                    reject(err);
                }
                else if (port === 0) {
                    _getPort(portNumber + 1);
                }
                else {
                    // If the port isn't available and we weren't looking for any port, throw error.
                    reject(new Error(`Port ${port} is already in use. Use '--port' to specify a different port.`));
                }
            })
                .once('listening', () => {
                server.close();
                resolve(portNumber);
            })
                .listen(portNumber, host);
        }
        _getPort(port || basePort);
    });
}
exports.checkPort = checkPort;
