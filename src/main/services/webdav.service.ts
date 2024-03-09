// WIP
import * as webdav from 'webdav';
import * as fs from 'fs';
import * as path from 'path';

async function downloadDirectory(client: webdav.WebDAVClient, remotePath: string, localPath: string) {
    const directoryItems = await client.getDirectoryContents(remotePath);

    for (const item of directoryItems) {
        const remoteItemPath = path.join(remotePath, item.filename);
        const localItemPath = path.join(localPath, item.filename);

        if (item.type === 'directory') {
            fs.mkdirSync(localItemPath, { recursive: true });
            await downloadDirectory(client, remoteItemPath, localItemPath);
        } else if (item.type === 'file') {
            const fileData = await client.getFileContents(remoteItemPath);
            fs.writeFileSync(localItemPath, fileData);
        }
    }
}

async function syncWebDav(url: string, id: string, download: boolean, localPath: string, username: string, password: string) {
    if (!download) {
        return;
    }

    const client = webdav.createClient(url, {
        username: username,
        password: password
    });

    await downloadDirectory(client, id, localPath);

    // Send status to frontend
    // This will depend on how your frontend is set up
    // For example, you might use WebSocket or HTTP to send the status
    sendStatusToFrontend('syncing');
}

export { syncWebDav };