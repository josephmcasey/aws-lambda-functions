import * as https from 'https'

const AUTHORIZATION = 'Bearer 7_F-QKwegkAAAAAAAAAqwG9_WGf-2bOi8fKrTTR7TCUgiw0g7ocKZEjILdkKP_xG'

export async function listDropboxDirectories (directory: string): Promise<object> {

    const postData = JSON.stringify({
        'path': directory,
        'recursive': true,
        'include_media_info': false,
        'include_deleted': false,
        'include_has_explicit_shared_members': false,
        'include_mounted_folders': true
    })

    const options = {
        hostname: 'api.dropboxapi.com',
        port: 443,
        path: '/2/files/list_folder',
        method: 'POST',
        headers: {
            'Authorization': AUTHORIZATION,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    }

    const output: string = await request(options, postData)

    return JSON.parse(output)
}

export async function continueListDropboxDirectories (cursor: string): Promise<object> {

    const postData = JSON.stringify({
        cursor
    })

    const options = {
        hostname: 'api.dropboxapi.com',
        port: 443,
        path: '/2/files/list_folder/continue',
        method: 'POST',
        headers: {
            'Authorization': AUTHORIZATION,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    }

    const output: string = await request(options, postData)

    return JSON.parse(output)
}

export async function download (files: any[]): Promise<string[]> {

    files.map( async (file) => {

        const options = {
            hostname: 'content.dropboxapi.com',
            port: 443,
            path: '/2/files/download',
            method: 'POST',
            headers: {
                'Authorization': AUTHORIZATION,
                'Dropbox-API-Arg': JSON.stringify({ path: file.path_display}),
                'Content-Type': 'text/plain'
            }
        }

        if(file['.tag'] === 'file') {
            return await request(options)
        }

    })

    console.log(files)

    return files
}

function request(options: object, data: string = ''): Promise<string> {

    return new Promise(
        (resolve, reject) => {

            let output: string = ''

            const req = https.request(options, (res) => {
                res.setEncoding('utf8')
                res.on('data', (chunk) => output += chunk)
                res.on('end', () => output)
            })

            req.on('error', (e) => reject(e))

            req.write(data)
            req.end()

        }
    )
}