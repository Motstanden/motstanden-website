"use strict";
// *******************************************************
// Summary:
//      This script converts plain text to a safe hash 
//      that can be stored as a password in the database
//
// Run from terminal:
//      1.  npm install
//      2.  node CalcPasswordHash
// *******************************************************
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const readline = require("readline");
const CalcHash = input => {
    const saltRounds = 15;
    const salt = bcrypt.genSaltSync(saltRounds);
    console.log(`Calculating hash with random salt, and ${saltRounds} salt rounds...`);
    const hash = bcrypt.hashSync(input, salt);
    return hash;
};
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question('Password: ', (terminalInput) => {
    const hash = CalcHash(terminalInput);
    console.log(`${terminalInput} --> ${hash}`);
    rl.close();
});
