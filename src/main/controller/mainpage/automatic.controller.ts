import { ipcRenderer } from 'electron';

function getAutomaticController() {
    return {
        startDownloadInterval: () => {
            return ipcRenderer.invoke('automatic:startDownloadInterval');
        },
        stopDownloadInterval: () => {
            return ipcRenderer.invoke('automatic:stopDownloadInterval');
        },
        getStatus: () => {
            return ipcRenderer.invoke('automatic:getStatus');
        }
    }
}

export default { getAutomaticController };
