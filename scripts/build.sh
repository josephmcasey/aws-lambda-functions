#!/usr/bin/env bash

npm run clean
tsc -p tsconfig-src.json
webpack --mode production
rm -rf dist/src