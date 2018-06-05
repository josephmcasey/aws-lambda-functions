#!/usr/bin/env bash

# pre test
npm run clean
tsc -p tsconfig-test.json
BABEL_ENV=test babel dist-test --out-dir dist-test --source-maps

# test
nyc ava 'dist-test/test/unit/**/*.test.js'