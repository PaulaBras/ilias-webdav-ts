import Store from 'electron-store';
import { FileStat } from 'webdav';

const store = new Store();

function getFileList(refId: string): FileStat[] {
    return store.get(`fileStatus:${refId}`, {}) as FileStat[];
}

function setFileList(refId: string, fileStatus: FileStat[]): void {
    store.set(`fileStatus:${refId}`, fileStatus);
}

export { getFileList, setFileList };