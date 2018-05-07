export function handler (event: any, context: AWSLambda.Context, callback: AWSLambda.Callback) {

  console.log('LOG: Name is ' + event.name)
  callback(null, 'Hello ' + event.name)

}