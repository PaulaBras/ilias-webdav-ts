import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import settingsController from '../main/controller/settings/settings.controller';
import mainPageController from '../main/controller/mainpage/mainPage.controller';
import automaticController from '../main/controller/mainpage/automatic.controller';

// Custom APIs for renderer
export const api = {
    settings: settingsController.getController(),
    mainPage: mainPageController.getMainPageController(),
    mainPageAutomatic: automaticController.getAutomaticController(),

    callbacks: {
        onProgress: ipcRenderer.on.bind(ipcRenderer, 'webdav:progress'),
        offProgress: ipcRenderer.off.bind(ipcRenderer, 'webdav:progress'),
        onDownloadSize: ipcRenderer.on.bind(ipcRenderer, 'mainpage:downloadSize'),
        offDownloadSize: ipcRenderer.off.bind(ipcRenderer, 'mainpage:downloadSize')
    }
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI);
        contextBridge.exposeInMainWorld('api', api);
    } catch (error) {
        console.error(error);
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI;
    // @ts-ignore (define in dts)
    window.api = api;
}
