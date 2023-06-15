import * as fs from 'fs';
import * as path from 'path';

interface File {
    id: string;
}

/**
 * Deletes all files in a folder
 * @param drive drive object from googleapis
 * @param folderId folder id to delete files of
 */
export async function deleteAllFilesInFolder(drive: any, folderId: string) {
    // Get the list of all files in the folder
    const res = await drive.files.list({
        q: `'${folderId}' in parents`,
    });

    const files = res.data.files || [];

    // Split files array into chunks of 10
    const chunks = Array(Math.ceil(files.length / 10)).fill(0).map((_, index) => index * 10).map(begin => files.slice(begin, begin + 10));

    // For each chunk (containing max 10 files)
    for (let chunk of chunks) {
        // Delete the files in this chunk
        await Promise.all(chunk.map((file: File) => {
            return new Promise<void>((resolve, reject) => {
                drive.files.delete({
                    fileId: file.id,
                }, (err: any) => {
                    if (err) {
                        console.log(`Error deleting file ${file.id}: ${err}`);
                        reject(err);
                    } else {
                        console.log(`Deleted file ${file.id}`);
                        resolve();
                    }
                });
            });
        }));

        // After deleting a chunk of files, wait for 5 seconds
        await new Promise(resolve => setTimeout(resolve, parseInt(process.env.UPLOAD_DELAY || '5000')))
    }
}



/**
 * Uploads all files in a folder to google drive
 * @param drive drive object from googleapis
 * @param folderId folder id to upload files to
 * @param directoryPath path where the files to upload are
 */
export async function uploadFilesToFolder(drive: any, folderId: string, directoryPath: string) {
    const files = fs.readdirSync(directoryPath);

    // Split files array into chunks of 10
    const chunks = Array(Math.ceil(files.length / 10)).fill(0).map((_, index) => index * 10).map(begin => files.slice(begin, begin + 10));

    // For each chunk (containing max 10 files)
    for (let chunk of chunks) {
        // Upload the files in this chunk
        await Promise.all(chunk.map(file => {
            const filePath = path.join(directoryPath, file);

            // Create a new file and upload the content
            return new Promise((resolve, reject) => {
                drive.files.create({
                    requestBody: {
                        name: file,
                        parents: [folderId],
                    },
                    media: {
                        mimeType: 'text/markdown',
                        body: fs.createReadStream(filePath),
                    },
                }, (err: any, file: any) => {
                    if (err) {
                        console.log(`Error uploading file ${filePath}: ${err}`);
                        reject(err);
                    } else {
                        console.log(`Uploaded file ${filePath} to Drive with ID: ${file.data.id}`);
                        resolve(file.data.id);
                    }
                });
            });
        }));

        // After uploading a chunk of files, wait for 5 seconds
        await new Promise(resolve => setTimeout(resolve, parseInt(process.env.UPLOAD_DELAY || '5000')));
    }
}
