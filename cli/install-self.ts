#!/usr/bin/env node

import * as FileSystem from "fs";

const packageDirectory = process.cwd();

console.log("package directory:", packageDirectory);

// get package name
const packageJson = require(packageDirectory + "/package.json");

// create folder with package name

// create index file to that folder
// with the following contents
// module.exports = require("..");

const packageNodeModuleDirectory = packageDirectory + "/node_modules/" + packageJson.name;

if (!FileSystem.existsSync(packageNodeModuleDirectory)) {   

    console.log("creating directory:", packageNodeModuleDirectory);
    FileSystem.mkdirSync(packageNodeModuleDirectory);
}

packageJson.main = "../../" + packageJson.main;

console.log("new main:", packageJson.main);

console.log("creating new package.json in:", packageNodeModuleDirectory);

FileSystem.writeFileSync(packageNodeModuleDirectory + "/package.json", JSON.stringify(packageJson, null, 4));

// log errors or log everything's A-OK