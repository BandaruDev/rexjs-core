"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
;
;
;
function rexBuild() {
    return new Promise(function (resolve, reject) {
        try {
            resolve(Promise.resolve().then(function () { return require(process.cwd() + "/rex.json"); }));
        }
        catch (error) {
            reject("REJECTED");
        }
    });
}
exports.rexBuild = rexBuild;
;
