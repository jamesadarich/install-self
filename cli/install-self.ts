#!/usr/bin/env node

import * as FileSystem from "fs";

(async() => {
    const packageDirectory = process.cwd();

    // get package name
    const packageJson = await import(packageDirectory + "/package.json");

    // create folder with package name

    // create index file to that folder
    // with the following contents
    // module.exports = require("..");

    const nodeModulesFolder = `${packageDirectory}/node_modules`;

    const packageNodeModuleDirectory = `${nodeModulesFolder}/${packageJson.name}`;

    if (!FileSystem.existsSync(packageNodeModuleDirectory)) {
        FileSystem.mkdirSync(packageNodeModuleDirectory);
    }

    packageJson.main = updatePath(packageJson.main);

    if (packageJson.typings) {
        packageJson.typings = updatePath(packageJson.typings);
    }

    FileSystem.writeFileSync(`${packageNodeModuleDirectory}/package.json`, JSON.stringify(packageJson, null, 4));

    console.log(packageJson.bin);

    Object.keys(packageJson.bin || {}).map(binName => {
        const binPath = updatePath(packageJson.bin[binName]);

        FileSystem.writeFileSync(`${nodeModulesFolder}/.bin/${binName}`, buildUnixBin(binPath));
        FileSystem.writeFileSync(`${nodeModulesFolder}/.bin/${binName}.cmd`, buildWindowsBin(binPath));
    });
})();

function updatePath(path: string) {
    return `../../${path}`;
}

const buildUnixBin = (path: string) => 
`#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\\\,/,g')")

case \`uname\` in
    *CYGWIN*) basedir=\`cygpath -w "$basedir"\`;;
esac

if [ -x "$basedir/node" ]; then
  "$basedir/node"  "$basedir/${path}" "$@"
  ret=$?
else 
  node  "$basedir/${path}" "$@"
  ret=$?
fi
exit $ret
`.replace(/\r\n/g, "\n");

const buildWindowsBin = (path: string) => 
`@IF EXIST "%~dp0\\node.exe" (
    "%~dp0\\node.exe"  "%~dp0\\${path}" %*
  ) ELSE (
    @SETLOCAL
    @SET PATHEXT=%PATHEXT:;.JS;=;%
    node  "%~dp0\\${path}" %*
  )
`.replace(/\r\n/g, "\n");

// log errors or log everything's A-OK
