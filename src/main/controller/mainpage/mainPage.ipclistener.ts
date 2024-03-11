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
        const appSettings = getAppSettings();
        if (appSettings?.webdavId === null) return;
        courses.forEach((course) => {
            if (appSettings.webdavId !== null) {
                let safeName = course.name.replace(/[\\/:*?"<>|]/g, '_');
                createWebDAV(appSettings.username, appSettings.password, appSettings.url, course.refId, appSettings.webdavId).then((client) => {
                    if (appSettings.webdavId !== null) {
                        donwloadWebDAV(safeName, client, appSettings.url, course.refId, course.download, appSettings.rootFolder, appSettings.webdavId);
                    }
                });
            }
        });
    });

    ipcMain.handle('mainpage:downloadSize', async (_event, courses: CourseList[]) => {
        const appSettings = getAppSettings();
        if (appSettings?.webdavId === null) return;
        let sizes: DownloadSize[] = [];
    
        const promises = courses.map(async (course) => {
            if (appSettings.webdavId !== null) {
                const client = await createWebDAV(appSettings.username, appSettings.password, appSettings.url, course.refId, appSettings.webdavId);
                if (appSettings.webdavId !== null) {
                    const data = await recursivelyGetAllItemsInWebDAVDirectory(client);
                    let size = calculateWebDAVSize(data);
                    sizes.push({ refId: course.refId, size: size });
                }
            }
        });
    
        await Promise.all(promises);
    
        return sizes;
    });
}

export default { setupIpcListener };
