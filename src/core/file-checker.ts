import chalk from "chalk";
import fs from 'fs';
import { basename, dirname } from "path";

export const checkRequiredFiles = (files: string[]): boolean => {
    let currentFilePath: string = '';
    try {
        files.forEach((filePath: string) => {
            currentFilePath = filePath;
// tslint:disable-next-line: no-bitwise
            fs.accessSync(filePath, fs.constants.R_OK | fs.constants.W_OK | fs.constants.F_OK);
        });
        return true;
    } catch (err) {
        const dirName = dirname(currentFilePath);
        const fileName = basename(currentFilePath);
        console.log(chalk.red(`Required File Not Found.`));
        console.log(chalk.red('FileName: ') + chalk.cyan(fileName));
        console.log(chalk.red('FilePath: ') + chalk.cyan(dirName));
        return false;
    }
};
