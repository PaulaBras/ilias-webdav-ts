import { ipcRenderer } from 'electron';

function getMainPageController() {
    return {
        getCourses: () => {
            return ipcRenderer.invoke('mainpage:getCourses');
        },
        setCourses: (courses) => {
            return ipcRenderer.invoke('mainpage:setCourses', courses);
        },
        login: () => {
            return ipcRenderer.invoke('mainpage:login');
        },
        checkFolderContents: (folderPath) => {
            return ipcRenderer.invoke('mainpage:checkFolderContents', folderPath);
        }
    }
}

export default { getMainPageController };