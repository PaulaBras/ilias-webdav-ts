import { ipcRenderer } from 'electron';

function getAutomaticController() {
    return {
        startDownloadInterval: () => {
            return ipcRenderer.invoke('automatic:startDownloadInterval');
        },
        stopDownloadInterval: () => {
            return ipcRenderer.invoke('automatic:stopDownloadInterval');
        },
        setStatus: (automaticDownload: boolean) => {
            return ipcRenderer.invoke('automatic:setStatus', automaticDownload);
        },
        getStatus: () => {
            return ipcRenderer.invoke('automatic:getStatus');
        }
    }
}

export default { getAutomaticController };
