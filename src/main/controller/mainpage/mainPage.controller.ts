import { ipcRenderer } from 'electron';

function getMainPageController() {
    return {
        getData: () => {
            return ipcRenderer.invoke('mainpage:getData');
        },
        getLayout: () => {
            return ipcRenderer.invoke('mainpage:getLayout');
        }
    }
}

export default { getMainPageController };