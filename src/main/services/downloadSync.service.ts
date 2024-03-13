import { getAppSettings } from './config.service';
import { getCoursesList } from './courses.service';
import { startDownload } from './download.service';

let downloadIntervalId: NodeJS.Timeout | null = null;
let automaticDownloadIsPaused = true;

function startDownloadProcess() {
    const appSettings = getAppSettings();
    if (downloadIntervalId) {
        return;
    }

    automaticDownloadIsPaused = false;
    
    downloadIntervalId = setInterval(() => {
        if(automaticDownloadIsPaused) {
            return;
        }
        const courseList = getCoursesList();
        startDownload(courseList);
    }, appSettings.timeinterval * 60 * 1000);
}

function stopDownloadProcess() {
    automaticDownloadIsPaused = true;

    if (downloadIntervalId) {
        clearInterval(downloadIntervalId);
        downloadIntervalId = null;
    }
}

function setStatus(status: boolean) {
    automaticDownloadIsPaused = status;
}

function getStatus() {
    return automaticDownloadIsPaused;
}

export { startDownloadProcess, stopDownloadProcess, setStatus, getStatus };
