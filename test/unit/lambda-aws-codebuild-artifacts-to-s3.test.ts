import test from 'ava';
import * as proxyquire from 'proxyquire';
import invokeLambdaHandler from './util/invokeLambdaHandler';
import * as AWS from 'aws-sdk';
// import MockAWS from './util/mockAWS';

test('Should throw on missing Source Bucket', async (t) => {

  const lambdaCallerIdentity = proxyquire('~/src/lambdas/aws-codebuild-artifacts-to-s3', {
    'aws-sdk': AWS
  });

  const context = {} as AWSLambda.Context;
  const result: any = await invokeLambdaHandler(lambdaCallerIdentity.handler, {}, context);

  t.deepEqual(result, {
    Account: '123456789012',
    Arn: 'arn:aws:iam::123456789012:user/Alice',
    UserId: 'AKIAI44QH8DHBEXAMPLE'
  });

});

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
