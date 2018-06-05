import * as request from 'request'

export async function handler (event: any, context: AWSLambda.Context, callback: AWSLambda.Callback) {
    try {

        const airlinePromise = new Promise( (resolve) => {
            request('https://raw.githubusercontent.com/jpatokal/openflights/master/data/airlines.dat', (error: any, response: any, body: any) => {
                console.log('error:', error); // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                console.log('body:', body); // Print the HTML for the Google homepage.

                resolve(body)
            })
        })

        const airportPromise = new Promise( (resolve) => {
            request('https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat', (error: any, response: any, body: any) => {
                console.log('error:', error); // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                console.log('body:', body); // Print the HTML for the Google homepage.

                resolve(body)
            })
        })

        const xyz = await Promise.all([airlinePromise, airportPromise])

        callback(null, xyz)
    }
    catch( err ) {
        console.error(err, 'Error occurred')
        callback(err, err)
    }
    finally {
        console.log( "exiting openFlightsToS3: [" + context.awsRequestId + "]." );
    }
}