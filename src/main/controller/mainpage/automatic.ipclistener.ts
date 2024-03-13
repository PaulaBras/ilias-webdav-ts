import { ipcMain } from "electron";
import { getStatus, setStatus, startDownloadProcess, stopDownloadProcess } from "../../services/downloadSync.service";

function setupIpcListener() {
    ipcMain.handle('automatic:startDownloadInterval', () => {
        return startDownloadProcess();
    });

    ipcMain.handle('automatic:stopDownloadInterval', () => {
        return stopDownloadProcess();
    });

    ipcMain.handle('automatic:setStatus', (_event, automaticDownload: boolean) => {
        return setStatus(automaticDownload);
    });

    ipcMain.handle('automatic:getStatus', () => {
        return getStatus();
    });
}

export default { setupIpcListener };
