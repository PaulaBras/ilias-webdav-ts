import * as fs from 'fs';
import * as path from 'path';

function checkFolderContents(folderPath: string) {
    const items = fs.readdirSync(folderPath);

    if (items.length === 0) {
        return 'empty';
    }

    for (const item of items) {
        const itemPath = path.join(folderPath, item);
        const stats = fs.statSync(itemPath);

        if (stats.isFile() || stats.isDirectory()) {
            return 'files in Folder';
        }
    }

    return 'empty';
}

export { checkFolderContents };