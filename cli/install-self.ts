#!/usr/bin/env node

import * as FileSystem from "fs";

const packageDirectory = process.cwd();

// get package name
const packageName = require(packageDirectory + "/package.json").name;

// create folder with package name

// create index file to that folder
// with the following contents
// module.exports = require("..");

const packageNodeModuleDirectory = packageDirectory + "/node_modules/" + packageName;

if (!FileSystem.existsSync(packageNodeModuleDirectory)) {
    FileSystem.mkdirSync(packageNodeModuleDirectory);
}
FileSystem.writeFileSync(packageNodeModuleDirectory + "/index.js", "module.exports = require(\"../..\");");

// log errors or log everything's A-OK