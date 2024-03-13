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

    // Call the download function once every interval
    const downloadAndScheduleNext = async () => {
        const courseList = await getCoursesList();

        await startDownload(courseList);
        
        console.log('Download startet');
        // Schedule the next download
        if(automaticDownload) {
            downloadIntervalId = await setTimeout(downloadAndScheduleNext, appSettings.timeinterval * 60 * 1000);
        }
    };

    // Start the first download
    downloadAndScheduleNext();
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
