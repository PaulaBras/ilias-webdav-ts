import Store from 'electron-store';
import { AppSettings } from '../../shared/types/appSettings';
import axios from 'axios';

const store = new Store();

function getAppSettings(): AppSettings {
    return store.get('appSettings', {}) as AppSettings;
}

function setAppSettings(settings: AppSettings): void {
    getWebDavID(settings).then(webdavId => {
        settings.webdavId = webdavId;
        store.set('appSettings', settings);
    });
}

async function getWebDavID(settings: AppSettings): Promise<string> {
    // Get Ilias client id
    return (await axios.get(settings.url)).request.res.responseUrl.match(/client_id=([^&]*)/)?.[1];
}

export { getAppSettings, setAppSettings };
