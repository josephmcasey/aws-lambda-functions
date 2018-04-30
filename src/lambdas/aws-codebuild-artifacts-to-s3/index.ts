import { createInflateRaw } from 'zlib'
import * as AWS from 'aws-sdk'
const s3 = new AWS.S3({ apiVersion: '2006-03-01', region: 'us-west-2' })

async function run (event: any, context: AWSLambda.Context) {

  const s3OutputBucket = event['CodePipeline.job'].data.actionConfiguration.configuration.UserParameters
  const s3Input = event['CodePipeline.job'].data.inputArtifacts[0].location.s3Location
  const s3InputBucket = s3Input.bucketName
  const s3InputKey = s3Input.objectKey

  await s3.waitFor('bucketExists', { Bucket: s3OutputBucket }).promise()
  await s3.waitFor('bucketExists', { Bucket: s3InputBucket }).promise()
  await s3.waitFor('objectExists', { Bucket: s3InputBucket, Key: s3InputKey }).promise()

  // TODO: Figure out how to unzip the contents of a zipped file and upload that into an s3 bucket.
  let readStream = s3.getObject({ Bucket: s3InputBucket, Key: s3InputKey }).createReadStream().pipe(createInflateRaw())

  let data = await s3.upload({ Bucket: s3OutputBucket, Key: 'some_key', Body: readStream }).promise()

  return data

}

export function handler (event: any, context: AWSLambda.Context, callback: AWSLambda.Callback) {
  run(event, context)
    .then((result: any) => {
      callback(null, result)
    })
    .catch((err) => {
      console.error(err, 'Error occurred')
      callback(err)
    })
}
