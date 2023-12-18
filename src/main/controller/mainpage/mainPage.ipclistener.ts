import { ipcMain } from "electron";
import { getCourses, getData } from "../../services/getCourses.service";

function setupIpcListener() {
    ipcMain.handle('mainpage:getCourses', () => {
        return getCourses();
    });

    ipcMain.handle('mainpage:getData', () => {
        return getData();
    });
}

export default { setupIpcListener };