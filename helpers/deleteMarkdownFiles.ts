import * as fs from 'fs';
import * as path from 'path';

/**
 * Delete the markdown files in a directory. This is used to clear the markdown directory before
 * @param directoryPath path to the directory to delete files from
 */
export default function deleteMarkdownFiles(directoryPath: string) {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.log(`Unable to read directory: ${err}`);
            return;
        }

        // Iterate over each file in the directory
        for (let file of files) {
            const filePath = path.join(directoryPath, file);

            // Delete the file
            fs.unlink(filePath, err => {
                if (err) {
                    console.log(`Error deleting file ${filePath}: ${err}`);
                } else {
                    console.log(`Deleted file ${filePath}`);
                }
            });
        }
    });
}
