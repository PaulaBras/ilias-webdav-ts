import { AppSettings } from "src/shared/types/appSettings";

function handleAutomaticService(isPaused: boolean, setIsPaused: React.Dispatch<React.SetStateAction<boolean>>, appSettings: AppSettings) {
    if(isPaused) {
        window.api.mainPageAutomatic.startDownloadInterval();
        setIsPaused(false);
        appSettings.automaticDownload = true;
        window.api.settings.setAppSettings(appSettings);
    }
    else {
        window.api.mainPageAutomatic.stopDownloadInterval();
        setIsPaused(true);
        appSettings.automaticDownload = false;
        window.api.settings.setAppSettings(appSettings);
    }
}

export { handleAutomaticService };
