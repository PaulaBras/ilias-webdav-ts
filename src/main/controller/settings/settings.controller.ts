import { ipcRenderer } from 'electron';

function getController() {
    return {
        getAppSettings: () => {
            return ipcRenderer.invoke('settings:getAppSettings');
        },
        setAppSettings: (settings) => {
            return ipcRenderer.invoke('settings:setAppSettings', settings);
        }
    }
}

export default { getController };