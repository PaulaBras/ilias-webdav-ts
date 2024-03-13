import { getAppSettings } from './config.service';
import { getCoursesList } from './courses.service';
import { startDownload } from './download.service';

let downloadIntervalId: NodeJS.Timeout | null = null;
let automaticDownload = false;

function startDownloadProcess() {
    const appSettings = getAppSettings();
    if (downloadIntervalId) {
        console.log('Download interval is already running');
        return;
    }

    automaticDownload = true;
    
    downloadIntervalId = setInterval(() => {
        if(!automaticDownload) {
            return;
        }
        console.log('Download started');
        const courseList = getCoursesList();
        startDownload(courseList);
    }, appSettings.timeinterval * 60 * 1000);
}

function stopDownloadProcess() {
    automaticDownload = false;

    if (downloadIntervalId) {
        clearInterval(downloadIntervalId);
        downloadIntervalId = null;
    }
}

function getStatus(): boolean {
    return automaticDownload;
}

export { startDownloadProcess, stopDownloadProcess, getStatus };
