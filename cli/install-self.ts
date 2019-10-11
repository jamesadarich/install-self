#!/usr/bin/env node

import * as FileSystem from "fs-extra";
import * as packlist from "npm-packlist";
import * as path from 'path'

(async () => {

  // get package name
  const packageJson = require(path.resolve(process.cwd(), 'package.json'));

  const packageNodeModuleDirectory = path.join('node_modules', packageJson.name);
  const filenames = await packlist();

  await Promise.all(
      filenames.map(async filename => {
          await FileSystem.ensureDir(path.join(packageNodeModuleDirectory, path.dirname(filename)));
          await FileSystem.copyFile(filename, path.join(packageNodeModuleDirectory, filename));
      })
  );

  await Promise.all(
      Object.keys(packageJson.bin || {})
          .map(async name => {
              const filename = packageJson.bin[name]
              await FileSystem.ensureDir(path.join('node_modules', '.bin'));
              await FileSystem.remove(path.join('node_modules', '.bin', name))
              await FileSystem.symlink(
                path.relative(path.join('node_modules', '.bin'), path.join(packageNodeModuleDirectory, filename)),
                path.join('node_modules', '.bin', name)
              );
          })
  )

  // log errors or log everything's A-OK
})()
