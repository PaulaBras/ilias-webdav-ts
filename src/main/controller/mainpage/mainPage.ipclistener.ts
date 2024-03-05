import { ipcMain } from "electron";
import { getCourses, getData } from "../../services/getCourses.service";
import { login } from "../../services/loginToIlias.service";

function setupIpcListener() {
    ipcMain.handle('mainpage:getCourses', () => {
        return getCourses();
    });

    ipcMain.handle('mainpage:getData', () => {
        return getData();
    });

    ipcMain.handle('mainpage:login', (url, username, password) => {
        return login(url, username, password);
    });
}

export default { setupIpcListener };