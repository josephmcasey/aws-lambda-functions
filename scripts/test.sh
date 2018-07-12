#!/usr/bin/env bash

# test # concurrently --kill-others 'npm run start-watch' 'npm run wp-server'
npm run clean

# test
tsc && nyc ava 'test/**/*.test.js'