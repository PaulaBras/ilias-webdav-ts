import { ipcMain } from "electron";
import { getCourses } from "../../services/getCourses.service";
import { login } from "../../services/loginToIlias.service";

function setupIpcListener() {
    ipcMain.handle('mainpage:getCourses', () => {
        return getCourses();
    });

    ipcMain.handle('mainpage:login', () => {
        return login();
    });
}

export default { setupIpcListener };