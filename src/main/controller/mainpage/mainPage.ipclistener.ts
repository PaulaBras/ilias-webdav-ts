import { ipcMain } from "electron";
import { getCoursesList, setCoursesList, setDownloadOption } from "../../services/courses.service";
import { login } from "../../services/loginToIlias.service";
import { CourseList } from "../../../shared/types/courseList";
import { checkFolderContents } from "../../services/fileOperation.service";

function setupIpcListener() {
    ipcMain.handle('mainpage:getCourses', () => {
        return getCoursesList();
    });

    ipcMain.handle('mainpage:setCourses', (_event, courses: CourseList[]) => {
        return setCoursesList(courses);
    });

    ipcMain.handle('mainpage:login', () => {
        return login();
    });

    ipcMain.handle('mainpage:checkFolderContents', (_event, folderPath: string) => {
        return checkFolderContents(folderPath);
    });

    ipcMain.handle('mainpage:downloadOption', (_event, refId: string, downloadBool: boolean) => {
        return setDownloadOption(refId, downloadBool);
    });

    ipcMain.handle('mainpage:startDownload', (_event, courses: CourseList[]) => {
        console.log(courses);
    });
}

export default { setupIpcListener };