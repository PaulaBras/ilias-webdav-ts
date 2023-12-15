import { ipcMain } from "electron";
import { AppSettings } from "../../../shared/types/appSettings";
import { getAppSettings, setAppSettings } from "../../services/config.service";

function setupIpcListener() {
    ipcMain.handle('settings:getAppSettings', () => {
        return getAppSettings();
    });

    ipcMain.handle('settings:setAppSettings', (event, settings: AppSettings) => {
        return setAppSettings(settings);
    });
}

export default { setupIpcListener };