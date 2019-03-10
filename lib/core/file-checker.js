"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var fs_1 = require("fs");
var path_1 = require("path");
exports.checkRequiredFiles = function (files) {
    var currentFilePath = '';
    try {
        files.forEach(function (filePath) {
            currentFilePath = filePath;
            // tslint:disable-next-line: no-bitwise
            fs_1.default.accessSync(filePath, fs_1.default.constants.R_OK | fs_1.default.constants.W_OK | fs_1.default.constants.F_OK);
        });
        return true;
    }
    catch (err) {
        var dirName = path_1.dirname(currentFilePath);
        var fileName = path_1.basename(currentFilePath);
        console.log(chalk_1.default.red("Required File Not Found."));
        console.log(chalk_1.default.red('FileName: ') + chalk_1.default.cyan(fileName));
        console.log(chalk_1.default.red('FilePath: ') + chalk_1.default.cyan(dirName));
        return false;
    }
};
