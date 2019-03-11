"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
exports.checkRequiredFiles = (files) => {
    let currentFilePath = '';
    try {
        files.forEach((filePath) => {
            currentFilePath = filePath;
            // tslint:disable-next-line: no-bitwise
            fs_1.default.accessSync(filePath, fs_1.default.constants.R_OK | fs_1.default.constants.W_OK | fs_1.default.constants.F_OK);
        });
        return true;
    }
    catch (err) {
        const dirName = path_1.dirname(currentFilePath);
        const fileName = path_1.basename(currentFilePath);
        console.log(chalk_1.default.red(`Required File Not Found.`));
        console.log(chalk_1.default.red('FileName: ') + chalk_1.default.cyan(fileName));
        console.log(chalk_1.default.red('FilePath: ') + chalk_1.default.cyan(dirName));
        return false;
    }
};
