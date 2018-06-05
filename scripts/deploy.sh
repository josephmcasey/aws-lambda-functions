#!/usr/bin/env bash

sam deploy --template-file ./sam.prod.yaml --capabilities CAPABILITY_NAMED_IAM --tags 'cli=true' 'automation=true' 'name=Lambda Functions' --stack-name sam-stack-for-aws-lambda