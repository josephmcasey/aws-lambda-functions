#!/usr/bin/env bash

sam package --template-file sam.yaml --s3-bucket ll-aws-sam-artifacts --output-template-file sam.prod.yaml