import * as AWS from 'aws-sdk'
// import mime from 'mime-types'
import * as JSZip from 'jszip'
import * as mime from 'mime-types'

const s3 = new AWS.S3({ apiVersion: '2006-03-01', region: 'us-west-2' })
const codepipeline = new AWS.CodePipeline({ apiVersion: '2015-07-09' })

export async function handler (event: any, context: AWSLambda.Context, callback: AWSLambda.Callback) {

  const codePipelineJob = event['CodePipeline.job']

  try {
    console.log('Entering Unzip#Run')

    const s3OutputBucket = codePipelineJob.data.actionConfiguration.configuration.UserParameters
    const codePipelineInput = codePipelineJob.data.inputArtifacts[0]
    const s3Input = codePipelineInput.location.s3Location
    const s3InputBucket = s3Input.bucketName
    const s3InputKey = s3Input.objectKey

    console.log(`
    S3 Output Bucket: ${s3OutputBucket}
    S3 Input Bucket: ${s3InputBucket}
    S3 Input Key: ${s3InputKey}
  `)

    await s3.waitFor('bucketExists', { Bucket: s3OutputBucket }).promise()
    await s3.waitFor('bucketExists', { Bucket: s3InputBucket }).promise()
    await s3.waitFor('objectExists', { Bucket: s3InputBucket, Key: s3InputKey }).promise()

    const s3GetResponse: any = await s3.getObject({ Bucket: s3InputBucket, Key: s3InputKey }).promise()
    const zipContentBuffer: Buffer = s3GetResponse.Body

    const zip: JSZip = await new JSZip().loadAsync(zipContentBuffer)

    let fileMap = Object.entries(zip.files)

    let uploadResults = []

    // TODO: Handle dir in Zip Objects - https://stuk.github.io/jszip/documentation/api_zipobject.html
    for (let [key, file] of fileMap) {
      console.log('File: ', key, file)

      const mimetype = mime.lookup(file.name) || 'application/octet-stream'
      const s3Param = {
        Bucket: s3OutputBucket,
        Key: file.name,
        Body: await file.async('nodebuffer'),
        ContentType: mimetype
      }

      uploadResults.push(await s3.upload(s3Param).promise())
    }

    console.log('uploadResults: ', uploadResults)

    const pipelineJob = await codepipeline.putJobSuccessResult({ jobId: codePipelineJob.id }).promise()

    callback(null, pipelineJob)

  } catch (err) {
    console.error(err, 'Error occurred')
    await codepipeline.putJobFailureResult({
      jobId: codePipelineJob.id,
      failureDetails: {
        type: 'ConfigurationError',
        message: err.message,
        externalExecutionId: context.awsRequestId
      }
    }).promise()
    callback(err)
  }
}
