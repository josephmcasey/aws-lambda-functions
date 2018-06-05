#!/usr/bin/env bash

# concurrently --kill-others 'npm run start-watch' 'npm run wp-server'
npm run clean
tsc -p tsconfig-src.json
webpack --watch
rm -rf dist/src
