import Store from 'electron-store';
import { FileStat } from 'webdav';

const store = new Store();

function getFileList(): FileList[] {
    return store.get('fileStatus', {}) as FileList[];
}

function setFileList(fileStatus: FileStat[]): void {
    store.set('fileStatus', fileStatus);
}

export { getFileList, setFileList };