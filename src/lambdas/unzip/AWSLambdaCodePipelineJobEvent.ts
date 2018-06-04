import * as AWS from 'aws-sdk'

export interface AWSLambdaCodePipelineJobEvent {
  'CodePipeline.job': AWS.CodePipeline.JobDetails
}
