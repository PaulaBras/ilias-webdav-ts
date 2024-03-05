import { ipcRenderer } from 'electron';

function getController() {
    return {
        getAppSettings: () => {
            return ipcRenderer.invoke('settings:getAppSettings');
        },
        setAppSettings: (settings) => {
            return ipcRenderer.invoke('settings:setAppSettings', settings);
        },
        openDialog: () => {
            return ipcRenderer.invoke('settings:openDialog');
        }
    }
}

export default { getController };