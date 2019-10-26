# install-self

[![Build Status](https://travis-ci.com/jamesadarich/install-self.svg?branch=master)](https://travis-ci.com/jamesadarich/install-self)

reference your npm module from itself

## Usage

```npm install install-self --save-dev```

Add ```install-self``` to your npm scripts or install it globally and run direct from your CLI

Reference your package

```javascript
// es5
var package = require("package-name");

// es6
import { something } from "package-name";
```

Good news it works with TypeScript too (including typings!)

## Why?

Simplify the process of integration testing NPM modules

If your NPM module depends on a package that depends on a different version of the original module then this can cause problems with using things like ```npm link```

## How?

It simply puts your package.json into the node_modules folder and updates the references
