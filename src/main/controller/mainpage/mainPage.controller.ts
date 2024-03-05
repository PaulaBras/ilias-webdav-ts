import { ipcRenderer } from 'electron';
import { login } from '../../services/loginToIlias.service';

function getMainPageController() {
    return {
        getData: () => {
            return ipcRenderer.invoke('mainpage:getData');
        },
        getLayout: () => {
            return ipcRenderer.invoke('mainpage:getLayout');
        },
        login: (url, username, password) => {
            return ipcRenderer.invoke('mainpage:login');
        }
    }
}

export default { getMainPageController };