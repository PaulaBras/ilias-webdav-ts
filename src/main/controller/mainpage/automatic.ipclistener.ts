import { ipcMain } from "electron";
import { getStatus, startDownloadProcess, stopDownloadProcess } from "../../services/downloadSync.service";

function setupIpcListener() {
    ipcMain.handle('automatic:startDownloadInterval', () => {
        return startDownloadProcess();
    });

    ipcMain.handle('automatic:stopDownloadInterval', () => {
        return stopDownloadProcess();
    });

    ipcMain.handle('automatic:getStatus', () => {
        return getStatus();
    });
}

export default { setupIpcListener };
