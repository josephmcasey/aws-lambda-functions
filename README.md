# Lambda Functions for JosephMCasey.com

Project Based on https://github.com/lifeomic/lambda-typescript-webpack-babel-starter

# Sample SAM CLI Invocations

## Targeted SAM Template

Warning SAM CLI Invocations are based on the bundled distribution. Be sure the dist/ is bundled before making local sam cli invocations.

## Provided Sample Events

The events used for experimental local sam cli invocations are potentially unstable due to the reference of live resources,
such as the input and output artifacts.

## Example Invocations

sam local invoke "HelloWorld" -e event/hello-world.json  -t sam.yaml --debug
sam local invoke "Unzip" -e event/unzip.json  -t sam.yaml  --log-file ./output.log --profile josephmcasey --debug