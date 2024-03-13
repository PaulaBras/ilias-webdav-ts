import { ipcMain } from 'electron';
import { getCoursesList, setCoursesList, setDownloadOption } from '../../services/courses.service';
import { login } from '../../services/loginToIlias.service';
import { CourseList } from '../../../shared/types/courseList';
import { checkFolderContents } from '../../services/fileOperation.service';
import { calculateWebDAVSize, createWebDAV, donwloadWebDAV, recursivelyGetAllItemsInWebDAVDirectory } from '../../services/webdav.service';
import { getAppSettings } from '../../services/config.service';
import { DownloadSize } from '../../../shared/types/downloadSize';
import { getFileList, setFileList } from '../../services/fileList.service';
import { FileStat } from 'webdav';
import { appWindow } from '../..';
import { downloadSize, startDownload } from '../../services/download.service';

function setupIpcListener() {
    ipcMain.handle('mainpage:getCourses', () => {
        return getCoursesList();
    });

    ipcMain.handle('mainpage:setCourses', (_event, courses: CourseList[]) => {
        return setCoursesList(courses);
    });

    ipcMain.handle('mainpage:getFileList', (_event, refId: string) => {
        return getFileList(refId);
    });

    ipcMain.handle('mainpage:setFileList', (_event, refId: string, fileList: FileStat[]) => {
        return setFileList(refId, fileList);
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
        return startDownload(courses);
    });

    ipcMain.handle('mainpage:downloadSize', async (_event, courses: CourseList[]) => {
        return downloadSize(courses);
    });
}

export default { setupIpcListener };
