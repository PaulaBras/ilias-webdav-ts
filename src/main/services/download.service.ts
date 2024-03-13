import { appWindow } from "..";
import { CourseList } from "../../shared/types/courseList";
import { DownloadSize } from "../../shared/types/downloadSize";
import { getAppSettings } from "./config.service";
import { calculateWebDAVSize, createWebDAV, donwloadWebDAV, recursivelyGetAllItemsInWebDAVDirectory } from "./webdav.service";

async function startDownload(courses: CourseList[]) {
    const appSettings = getAppSettings();
    if (appSettings?.webdavId === null) return;
    courses.forEach((course) => {
        if (appSettings.webdavId !== null) {
            let safeName = course.name.replace(/[\\/:*?"<>|]/g, '_');
            createWebDAV(appSettings.username, appSettings.password, appSettings.url, course.refId, appSettings.webdavId).then((client) => {
                if (appSettings.webdavId !== null) {
                    donwloadWebDAV(safeName, client, course.refId, course.download, appSettings.rootFolder);
                }
            });
        }
    });
};

async function downloadSize(courses: CourseList[]) {
    const appSettings = getAppSettings();
    if (appSettings?.webdavId === null) return;
    let sizes: DownloadSize[] = [];

    const promises = courses.map(async (course) => {
        appWindow?.webContents.send('mainpage:downloadSize', {size: 0, done: false}, course.refId);
        if (appSettings.webdavId !== null) {
            const client = await createWebDAV(appSettings.username, appSettings.password, appSettings.url, course.refId, appSettings.webdavId);
            if (appSettings.webdavId !== null) {
                const data = await recursivelyGetAllItemsInWebDAVDirectory(client);
                let size = calculateWebDAVSize(data);
                sizes.push({ size: size, done: true});

                // send the size async to the renderer
                appWindow?.webContents.send('mainpage:downloadSize', {size: size, done: true}, course.refId);
            }
        }
    });

    await Promise.all(promises);

    return sizes;
}

export { startDownload, downloadSize };
