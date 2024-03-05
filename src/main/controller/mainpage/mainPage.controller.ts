import { ipcRenderer } from 'electron';

function getMainPageController() {
    return {
        getLayout: () => {
            return ipcRenderer.invoke('mainpage:getLayout');
        },
        login: () => {
            return ipcRenderer.invoke('mainpage:login');
        }
    }
}

export default { getMainPageController };