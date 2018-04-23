import * as AWS from 'aws-sdk';

const s3 = new AWS.S3({ apiVersion: '2006-03-01', region: 'us-west-2' });

interface CloudBuildToS3WebsiteEvent {
  s3SourceDirectory: string;
  s3DestinationDirectory: string;
}

async function run (event: CloudBuildToS3WebsiteEvent, context: AWSLambda.Context) {

  const { s3SourceDirectory, s3DestinationDirectory } = event;

  const hasBucket = (s3Bucket: string) => s3.waitFor('bucketExists', { Bucket: s3Bucket });

  return Promise.all([ hasBucket(s3DestinationDirectory), hasBucket(s3SourceDirectory)])
    .then((result: any) => {
      console.log({
        destination: result[0].response,
        source: result[1].response
      });
    }).catch((reason: any) => {
      console.warn(reason);
    });

    // s3.listObjectsV2(params, function(err, data) {
    //     if (err) console.log(err, err.stack); // an error occurred
    //     else     console.log(data);           // successful response
    // });

}

export function handler (event: any, context: AWSLambda.Context, callback: AWSLambda.Callback) {
  run(event, context).then((result: any) => {
    callback(null, result);
  }).catch((err) => {
    console.error(err, 'Error occurred');
    callback(err);
  });
}
