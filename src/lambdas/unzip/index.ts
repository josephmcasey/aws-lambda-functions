import * as AWS from 'aws-sdk'
import * as JSZip from 'jszip'
import * as mime from 'mime-types'

const s3 = new AWS.S3({ apiVersion: '2006-03-01', region: 'us-west-2' })
const codePipeline = new AWS.CodePipeline({ apiVersion: '2015-07-09' })

// TODO: Assign interface AWSLambdaCodePipelineJobEvent to handler event
export async function handler (event: any, context: AWSLambda.Context, callback: AWSLambda.Callback) {

  const codePipelineJob = event['CodePipeline.job']

  try {
    console.log('Entering Unzip#Run')

    const outputBucket = codePipelineJob.data.actionConfiguration.configuration.UserParameters
    const codePipelineInput = codePipelineJob.data.inputArtifacts[0]
    const { bucketName, objectKey } = codePipelineInput.location.s3Location

    console.log(`
    S3 Output Bucket: ${outputBucket}
    S3 Input Bucket: ${bucketName}
    S3 Input Key: ${objectKey}
  `)

    await s3.waitFor('bucketExists', { Bucket: outputBucket }).promise()
    await s3.waitFor('bucketExists', { Bucket: bucketName }).promise()
    await s3.waitFor('objectExists', { Bucket: bucketName, Key: objectKey }).promise()

    const s3GetResponse: any = await s3.getObject({ Bucket: bucketName, Key: objectKey }).promise()
    const zipContentBuffer: Buffer = s3GetResponse.Body

    const zip: JSZip = await new JSZip().loadAsync(zipContentBuffer)

    const fileMap = Object.entries(zip.files)

    const uploadResults = []

    for (const [key, file] of fileMap) {
      console.log('File: ', key, file)

      const mimetype = mime.lookup(file.name) || 'application/octet-stream'
      const s3Param = {
        Bucket: outputBucket,
        Key: file.name,
        Body: await file.async('nodebuffer'),
        ContentType: mimetype
      }

      uploadResults.push(await s3.upload(s3Param).promise())
    }

    console.log('uploadResults: ', uploadResults)

    const pipelineJob = await codePipeline.putJobSuccessResult({ jobId: codePipelineJob.id }).promise()

    callback(null, pipelineJob)

  } catch (err) {
    console.error(err, 'Error occurred')
    await codePipeline.putJobFailureResult({
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

/*
// TODO: Function that validates the structure, logs pertinent information, and returns pertinent data
async function prevalidateEventStructure (codePipelineJob: AWS.CodePipeline.JobDetails, callback: AWSLambda.Callback) {
  console.log('Attempting to Validate Event Structure: ', event)

  try {

    await s3.waitFor('bucketExists', { Bucket: outputBucket }).promise()
    await s3.waitFor('bucketExists', { Bucket: bucketName }).promise()
    await s3.waitFor('objectExists', { Bucket: bucketName, Key: objectKey }).promise()

  } catch (MissingDataError) {

  }

   console.log(`
   CodePipeline ID: ${id}
   Output: ${outputBucket}
   Input: ${bucketName}/${bucketKey}
  `)

  return { outputBucket, inputBucket, inputKey, codePipelineId }
}
*/

/*
// TODO: Upload compressed file content to s3, log results, return results
async function uploadZipFileContentToS3(file) {
      console.log('Attempting to Upload File: ', file)

      const mimetype = mime.lookup(file.name) || 'application/octet-stream'
      const s3Param = {
        Bucket: outputBucket,
        Key: file.name,
        Body: await file.async('nodebuffer'),
        ContentType: mimetype
      }

      return await s3.upload(s3Param).promise()
}
 */
