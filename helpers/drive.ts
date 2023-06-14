import * as fs from 'fs';
import * as path from 'path';

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

    // Iterate over each file and delete it
    for (let file of res.data.files || []) {
        await drive.files.delete({
            fileId: file.id!,
        });
        console.log(`Deleted file ${file.id}`);
    }
}

/**
 * Uploads all files in a folder to google drive
 * @param drive drive object from googleapis
 * @param folderId folder id to upload files to
 * @param directoryPath path where the files to upload are
 */
export async function uploadFilesToFolder(drive: any, folderId: string, directoryPath: string) {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.log(`Unable to read directory: ${err}`);
            return;
        }

        // Iterate over each file in the local directory
        for (let file of files) {
            const filePath = path.join(directoryPath, file);

            // Create a new file and upload the content
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
                } else {
                    console.log(`Uploaded file ${filePath} to Drive with ID: ${file.data.id}`);
                }
            });
        }
    });
}