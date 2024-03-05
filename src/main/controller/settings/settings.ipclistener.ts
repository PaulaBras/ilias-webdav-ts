import { ipcMain } from "electron";
import { AppSettings } from "../../../shared/types/appSettings";
import { getAppSettings, setAppSettings } from "../../services/config.service";
import { dialog } from 'electron';

function setupIpcListener() {
    ipcMain.handle('settings:getAppSettings', () => {
        return getAppSettings();
    });

    ipcMain.handle('settings:setAppSettings', (_event, settings: AppSettings) => {
        return setAppSettings(settings);
    });

    ipcMain.handle('settings:openDialog', async (event) => {
        const result = await dialog.showOpenDialog({
            properties: ['openDirectory']
        });
        return result.filePaths;
    });
}

export default { setupIpcListener };