import * as fs from 'fs';
import * as path from 'path';
import * as posixPath from 'path/posix';

import type { WebDAVClient, FileStat } from 'webdav';
import { appWindow } from '..';
import { getFileList, setFileList } from './fileList.service';

let webdav: typeof import('webdav');

import('webdav').then((module) => {
    webdav = module;
});

async function downloadDirectory(client: WebDAVClient, remotePath: string, localPath: string, refId: string) {
    appWindow?.webContents.send(
        'webdav:progress',
        {
            fileName: '',
            fileCount: -1,
            fileIndex: 0,
            percentage: 100,
            done: false
        },
        refId
    );

    const directoryItems = await recursivelyGetAllItemsInWebDAVDirectory(client, remotePath);
    const oldDirectoryItems = await getFileList(refId);
    const sizeFull = calculateWebDAVSize(directoryItems);

    const status = {
        currentFileName: '',
        currentFileIndex: 0,
        downloadedBytes: 0,
        done: false
    };

    function sendStatus() {
        appWindow?.webContents.send(
            'webdav:progress',
            {
                fileName: status.currentFileName,
                fileCount: directoryItems.length,
                fileIndex: status.currentFileIndex,
                percentage: (status.downloadedBytes / sizeFull) * 100,
                done: status.done
            },
            refId
        );
    }

    const interval = setInterval(sendStatus, 100);

    for (const item of directoryItems) {
        const finalPath = path.join(localPath, item.filename);

        status.currentFileName = item.filename;
        status.currentFileIndex++;

        sendStatus();

        if (oldDirectoryItems.length !== 0) {
            const oldItem = await oldDirectoryItems.find((oldItem) => oldItem.filename === item.filename);
            if (oldItem && new Date(oldItem?.lastmod).getTime() >= new Date(item.lastmod).getTime()) {
                const localFilePath = path.join(localPath, item.filename);
                if (fs.existsSync(localFilePath)) {
                    status.downloadedBytes += item.size;
                    continue;
                }
            }
        }

        if (item.type === 'directory') {
            fs.mkdirSync(finalPath, { recursive: true });
        } else {
            const writeStream = fs.createWriteStream(finalPath);

            await new Promise((res) => {
                client
                    .createReadStream(item.filename)
                    .on('data', (buf: Buffer) => (status.downloadedBytes += buf.byteLength))
                    .on('end', res)
                    .pipe(writeStream);
            });
        }
    }

    clearInterval(interval);

    setFileList(refId, directoryItems);

    status.done = true;
    sendStatus();
}

async function recursivelyGetAllItemsInWebDAVDirectory(client: WebDAVClient, remotePath = '/') {
    const directoryItems = (await client.getDirectoryContents(remotePath)) as FileStat[];

    for (const item of [...directoryItems]) {
        const remoteItemPath = posixPath.join(remotePath, item.basename);

        if (item.type !== 'directory') {
            continue;
        }

        const items = await recursivelyGetAllItemsInWebDAVDirectory(client, remoteItemPath);

        directoryItems.push(...items);
    }

    return directoryItems;
}

function calculateWebDAVSize(directoryItems: FileStat[]) {
    return directoryItems.reduce((previousValue, currentValue) => previousValue + currentValue.size, 0);
}

async function createWebDAV(username: string, password: string, url: string, refid: string, webdavId: string): Promise<WebDAVClient> {
    let remotePath = `${url}/webdav.php/${webdavId}/ref_${refid}`;

    const client = await webdav.createClient(remotePath, {
        username: username,
        password: password
    });

    return client;
}

async function donwloadWebDAV(courseName: string, client: WebDAVClient, url: string, refid: string, download: boolean, localPath: string, webdavId: string) {
    if (!download) {
        return;
    }

    const coursePath = posixPath.join(localPath, courseName);
    let remotePath = `${url}/webdav.php/${webdavId}/ref_${refid}`;
    if (!fs.existsSync(coursePath)) {
        fs.mkdirSync(coursePath);
    }

    await downloadDirectory(client, '/', coursePath, refid);
}

export { createWebDAV, donwloadWebDAV, recursivelyGetAllItemsInWebDAVDirectory, calculateWebDAVSize };
