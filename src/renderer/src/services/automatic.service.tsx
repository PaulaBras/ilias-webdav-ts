function handleAutomaticService(isPaused: boolean, setIsPaused: React.Dispatch<React.SetStateAction<boolean>>) {
    if(isPaused) {
        window.api.mainPageAutomatic.startDownloadInterval();
        setIsPaused(false);
    }
    else {
        window.api.mainPageAutomatic.stopDownloadInterval();
        setIsPaused(true);
    }
}

function getStatus(setIsPaused: React.Dispatch<React.SetStateAction<boolean>>) {
    window.api.mainPageAutomatic.getStatus().then((status) => {
        setIsPaused(status);
    });
}

export { handleAutomaticService, getStatus };
