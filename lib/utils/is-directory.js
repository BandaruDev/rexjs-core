"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
function isDirectory(path) {
    try {
        return fs_1.default.statSync(path).isDirectory();
    }
    catch (_) {
        return false;
    }
}
exports.isDirectory = isDirectory;
