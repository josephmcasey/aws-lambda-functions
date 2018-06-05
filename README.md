# Personal Lambda Functions

I like to ball out from time to time with personal projects and use AWS Lambda. This is a repository
for my personal AWS Lambda Functions. I like to keep it around publicly, so I can reference it when talking
with other engineers

## Sample SAM CLI Invocations

### Targeted SAM Template

Warning SAM CLI Invocations are based on the bundled distribution. Be sure the dist/ is bundled before making local sam cli invocations.

### Provided Sample Events

The events used for experimental local sam cli invocations are potentially unstable due to the reference of live resources,
such as the input and output artifacts.

### Example Invocations

sam local invoke "HelloWorld" -e event/hello-world.json  -t sam.yaml --debug
sam local invoke "Unzip" -e event/unzip.json  -t sam.yaml  --log-file ./output.log --profile josephmcasey --debug