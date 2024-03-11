import { ipcRenderer } from 'electron';

function getMainPageController() {
    return {
        getCourses: () => {
            return ipcRenderer.invoke('mainpage:getCourses');
        },
        setCourses: (courses) => {
            return ipcRenderer.invoke('mainpage:setCourses', courses);
        },
        getFileList: (refId) => {
            return ipcRenderer.invoke('mainpage:getFileList', refId);
        },
        setFileList: (refId, fileList) => {
            return ipcRenderer.invoke('mainpage:getFileList', refId, fileList);
        },
        login: () => {
            return ipcRenderer.invoke('mainpage:login');
        },
        checkFolderContents: (folderPath) => {
            return ipcRenderer.invoke('mainpage:checkFolderContents', folderPath);
        },
        downloadOption: (refId, downloadBool) => {
            return ipcRenderer.invoke('mainpage:downloadOption', refId, downloadBool);
        },
        startDownload: (courses) => {
            return ipcRenderer.invoke('mainpage:startDownload', courses);
        },
        downloadSize: (courses) => {
            return ipcRenderer.invoke('mainpage:downloadSize', courses);
        }
    }
}

export default { getMainPageController };