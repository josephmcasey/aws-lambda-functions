import { listDropboxDirectories, continueListDropboxDirectories, download } from './https'

export async function handler (event: any, context: AWSLambda.Context, callback: AWSLambda.Callback) {

    try {

        const directory: any = await listDropboxDirectories('/MapsOnline/')

        const directoryContents: any = await continueListDropboxDirectories(directory.cursor)

        const downloadedContent = await download(directoryContents.entries)

        callback(null, downloadedContent)

    } catch (err) {
        console.error(err, 'Error occurred')
        callback(err, err)
    }
}
