import { appWindow } from "..";
import { CourseList } from "../../shared/types/courseList";
import { DownloadSize } from "../../shared/types/downloadSize";
import { getAppSettings } from "./config.service";
import { calculateWebDAVSize, createWebDAV, donwloadWebDAV, recursivelyGetAllItemsInWebDAVDirectory } from "./webdav.service";

async function startDownload(courses: CourseList[]) {
    const appSettings = getAppSettings();
    
    if (!appSettings?.webdavId) {
        return;
    }
    
    courses.forEach((course) => {
        let safeName = course.name.replace(/[\\/:*?"<>|]/g, '_');
        
        // Make sure webdavId is not null before calling createWebDAV
        if (!appSettings.webdavId) {
            return;
        }
        
        createWebDAV(
            appSettings.username, 
            appSettings.password, 
            appSettings.url, 
            course.refId, 
            appSettings.webdavId // Now we know this is not null
        ).then((client) => {
            donwloadWebDAV(safeName, client, course.refId, course.download, appSettings.rootFolder);
        }).catch(error => {
            // Silent error handling
        });
    });
};

async function downloadSize(courses: CourseList[]) {
    const appSettings = getAppSettings();
    
    if (!appSettings?.webdavId) {
        return;
    }
    
    let sizes: DownloadSize[] = [];

    const promises = courses.map(async (course) => {
        try {
            // Send initial state - size 0, not done, no error
            appWindow?.webContents.send('mainpage:downloadSize', {size: 0, done: false, error: null}, course.refId);
            
            // Make sure webdavId is not null before calling createWebDAV
            if (!appSettings.webdavId) {
                // Send error state - WebDAV ID missing
                appWindow?.webContents.send('mainpage:downloadSize', {
                    size: 0, 
                    done: true, 
                    error: 'WebDAV ID missing'
                }, course.refId);
                return;
            }
            
            const client = await createWebDAV(
                appSettings.username, 
                appSettings.password, 
                appSettings.url, 
                course.refId, 
                appSettings.webdavId // Now we know this is not null
            );
            
            try {
                // Explicitly pass the root path '/'
                const data = await recursivelyGetAllItemsInWebDAVDirectory(client, '/');
                
                let size = calculateWebDAVSize(data);
                
                sizes.push({ size: size, done: true, error: null });

                // send the size async to the renderer
                appWindow?.webContents.send('mainpage:downloadSize', {
                    size: size, 
                    done: true, 
                    error: null
                }, course.refId);
            } catch (dirError: any) {
                // Check if it's a 500 error or other server error
                let errorMessage = 'Error fetching directory contents';
                if (dirError.status === 500) {
                    errorMessage = 'Server error (500)';
                } else if (dirError.status) {
                    errorMessage = `Server error (${dirError.status})`;
                }
                
                // Send error state with appropriate message
                appWindow?.webContents.send('mainpage:downloadSize', {
                    size: 0, 
                    done: true, 
                    error: errorMessage
                }, course.refId);
            }
        } catch (error: any) {
            // Determine appropriate error message
            let errorMessage = 'Error connecting to WebDAV';
            if (error.status === 500) {
                errorMessage = 'Server error (500)';
            } else if (error.status) {
                errorMessage = `Server error (${error.status})`;
            }
            
            // Send error state with message
            appWindow?.webContents.send('mainpage:downloadSize', {
                size: 0, 
                done: true, 
                error: errorMessage
            }, course.refId);
        }
    });

    try {
        await Promise.all(promises);
    } catch (error) {
        // Silent error handling
    }

    return sizes;
}

export { startDownload, downloadSize };
