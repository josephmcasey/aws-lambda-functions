#!/usr/bin/env bash

tslint --fix --format codeFrame --project tsconfig.json 'src/**/*.ts' 'test/**/*.ts'