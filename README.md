# Lambda Functions for JosephMCasey.com

Project Based on https://github.com/lifeomic/lambda-typescript-webpack-babel-starter

# Sample SAM CLI Invocations

Warning SAM CLI Invocations are based on the bundled distribution. Be sure the dist/ is bundled before making local sam cli invocations.

sam local invoke "HelloWorld" -e event/hello-world.json  -t sam.yaml --debug
sam local invoke "Unzip" -e event/unzip.json  -t sam.yaml  --log-file ./output.log --profile josephmcasey --debug