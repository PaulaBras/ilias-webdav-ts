import { ipcMain } from "electron";
import { getCourses } from "../../services/getCourses.service";

function setupIpcListener() {
    ipcMain.handle('mainpage:getCourses', () => {
        return getCourses();
    });

    ipcMain.handle('mainpage:getData', () => {
        return getCourses();
    });
}

export default { setupIpcListener };