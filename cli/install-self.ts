#!/usr/bin/env node

import * as FileSystem from "fs";

// get package name
const packageName = require("../package.json").name;

// create folder with package name

// create index file to that folder
// with the following contents
// module.exports = require("..");
if (!FileSystem.existsSync("./node_modules/" + packageName)) {
    FileSystem.mkdirSync("./node_modules/" + packageName);
}
FileSystem.writeFileSync("./node_modules/" + packageName + "/index.js", "module.exports = require(\"../..\");");

// log errors or log everything's A-OK