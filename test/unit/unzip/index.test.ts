import test from 'ava'
import * as proxyquire from 'proxyquire'
import invokeLambdaHandler from '../util/invokeLambdaHandler'
import MockAWS from '../util/mockAWS'

// TODO: Heavily utilize strictly-typed spies to ensure the proper value is being called on the various third-party APIs.

test('Should throw on missing Source Bucket', async (t) => {

  const lambdaCallerIdentity = proxyquire('~/src/lambdas/aws-codebuild-artifacts-to-s3', {
    'aws-sdk': MockAWS
  })

  const context = {} as AWSLambda.Context
  const event = {
    'CodePipeline.job': {
      'id': '11111111-abcd-1111-abcd-111111abcdef',
      'accountId': '111111111111',
      'data': {
        'actionConfiguration': {
          'configuration': {
            'FunctionName': 'aws-codebuild-artifacts-to-s3',
            'UserParameters': 's3://www.example.com'
          }
        },
        'inputArtifacts': [
          {
            'location': {
              's3Location': {
                'bucketName': 'codepipeline-us-east-2-1234567890',
                'objectKey': 'CodePipelineDemoApplication.zip'
              },
              'type': 'S3'
            },
            'revision': null,
            'name': 'ArtifactName'
          }
        ],
        'outputArtifacts': [],
        'artifactCredentials': {
          'secretAccessKey': 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
          'sessionToken': 'MIICiTCCAfICCQD6m7oRw0uXOjANBgkqhkiG9w0BAQUFADCBiDELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAldBMRAwDgYDVQQHEwdTZWF0dGxlMQ8wDQYDVQQKEwZBbWF6b24xFDASBgNVBAsTC0lBTSBDb25zb2xlMRIwEAYDVQQDEwlUZXN0Q2lsYWMxHzAdBgkqhkiG9w0BCQEWEG5vb25lQGFtYXpvbi5jb20wHhcNMTEwNDI1MjA0NTIxWhcNMTIwNDI0MjA0NTIxWjCBiDELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAldBMRAwDgYDVQQHEwdTZWF0dGxlMQ8wDQYDVQQKEwZBbWF6b24xFDASBgNVBAsTC0lBTSBDb25zb2xlMRIwEAYDVQQDEwlUZXN0Q2lsYWMxHzAdBgkqhkiG9w0BCQEWEG5vb25lQGFtYXpvbi5jb20wgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAMaK0dn+a4GmWIWJ21uUSfwfEvySWtC2XADZ4nB+BLYgVIk60CpiwsZ3G93vUEIO3IyNoH/f0wYK8m9TrDHudUZg3qX4waLG5M43q7Wgc/MbQITxOUSQv7c7ugFFDzQGBzZswY6786m86gpEIbb3OhjZnzcvQAaRHhdlQWIMm2nrAgMBAAEwDQYJKoZIhvcNAQEFBQADgYEAtCu4nUhVVxYUntneD9+h8Mg9q6q+auNKyExzyLwaxlAoo7TJHidbtS4J5iNmZgXL0FkbFFBjvSfpJIlJ00zbhNYS5f6GuoEDmFJl0ZxBHjJnyp378OD8uTs7fLvjx79LjSTbNYiytVbZPQUQ5Yaxu2jXnimvw3rrszlaEXAMPLE=',
          'accessKeyId': 'AKIAIOSFODNN7EXAMPLE'
        },
        'continuationToken': 'A continuation token if continuing job'
      }
    }
  }

  const result: any = await invokeLambdaHandler(lambdaCallerIdentity.handler, event, context)

  t.deepEqual(result, {
    Account: '123456789012',
    Arn: 'arn:aws:iam::123456789012:user/Alice',
    UserId: 'AKIAI44QH8DHBEXAMPLE'
  })

})

// test('Should throw on missing Destination Bucket', async (t) => {
//
// });
//
// test('Should return List of Bucket for Source', async (t) => {
//
// });
//
//
//
// test('Should select the Object List for Source Bucket', async (t) => {
//
// });
//
//
// test('Should collect a list of Object from Source', async (t) => {
//
// });
