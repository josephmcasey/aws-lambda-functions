// Below is the general order of AWS Commands that need to be used.

// headBucket - https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#headBucket-property
// Determines if bucket is there.

// listObjectsV2 - https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjectsV2-property
// RESPONSE => Array<map> => data.Contents.Key

// copyObject - https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#copyObject-property

interface S3WaitForParameters {
  Bucket: string
}

class MockS3 {
  waitFor (params: S3WaitForParameters) {
    return {
      promise () {
        return new Promise((resolve, reject) => {
          if (params.Bucket === 'bad') {
            reject({
              Account: '123456789012',
              Arn: 'arn:aws:iam::123456789012:user/Alice',
              UserId: 'AKIAI44QH8DHBEXAMPLE'
            })
          } else {
            resolve({
              Account: '123456789012',
              Arn: 'arn:aws:iam::123456789012:user/Alice',
              UserId: 'AKIAI44QH8DHBEXAMPLE'
            })
          }
        })
      }
    }
  }

  listObjectsV2 () {
    return {
      promise () {
        return new Promise((resolve, reject) => {
          resolve({
            Account: '123456789012',
            Arn: 'arn:aws:iam::123456789012:user/Alice',
            UserId: 'AKIAI44QH8DHBEXAMPLE'
          })
        })
      }
    }
  }

  copyObject () {
    return {
      promise () {
        return new Promise((resolve, reject) => {
          resolve({
            Account: '123456789012',
            Arn: 'arn:aws:iam::123456789012:user/Alice',
            UserId: 'AKIAI44QH8DHBEXAMPLE'
          })
        })
      }
    }
  }
}

const MockAWS = {
  S3: MockS3
}

export default MockAWS
