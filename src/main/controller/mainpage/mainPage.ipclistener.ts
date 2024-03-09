import { ipcMain } from "electron";
import { getCoursesList, setCoursesList } from "../../services/courses.service";
import { login } from "../../services/loginToIlias.service";
import { CourseList } from "../../../shared/types/courseList";

function setupIpcListener() {
    ipcMain.handle('mainpage:getCourses', () => {
        return getCoursesList();
    });

    ipcMain.handle('mainpage:setCourses', (_event, courses: CourseList) => {
        return setCoursesList(courses);
    });

    ipcMain.handle('mainpage:login', () => {
        return login();
    });
}

export default { setupIpcListener };