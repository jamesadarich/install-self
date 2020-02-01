#!/usr/bin/env node
import { writeFile, exists, mkdir } from "fs";

async function writeFileAsync(path: string, content: string) {
    return new Promise((resolve, reject) => {
        writeFile(path, content, err => err ? reject(err) : resolve());
    });
}

async function existsAsync(path: string) {
    return new Promise((resolve, reject) => {
        exists(path, err => err ? reject(err) : resolve());
    });
}

async function mkdirAsync(path: string) {
    return new Promise((resolve, reject) => {
        mkdir(path, err => err ? reject(err) : resolve());
    });
}

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

    if (!await existsAsync(packageNodeModuleDirectory)) {
        await mkdirAsync(packageNodeModuleDirectory);
    }

    packageJson.main = updatePath(packageJson.main);

    if (packageJson.typings) {
        packageJson.typings = updatePath(packageJson.typings);
    }

    await writeFileAsync(`${packageNodeModuleDirectory}/package.json`, JSON.stringify(packageJson, null, 4));

    Object.keys(packageJson.bin || {}).map(async binName => {
        const binPath = updatePath(packageJson.bin[binName]);

        await writeFileAsync(`${nodeModulesFolder}/.bin/${binName}`, buildUnixBin(binPath));
        await writeFileAsync(`${nodeModulesFolder}/.bin/${binName}.cmd`, buildWindowsBin(binPath));
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
