import Store from 'electron-store';
import { AppSettings } from '../../shared/types/appSettings';
import axios from 'axios';

const store = new Store();

function getAppSettings(): AppSettings {
    // console.log(store.get('appSettings', {}));
    return store.get('appSettings', {}) as AppSettings;
}

function setAppSettings(settings: AppSettings): void {
    getWebDavID(settings).then(webdavId => {
        settings.webdavId = webdavId;
        store.set('appSettings', settings);
    });
}

async function getWebDavID(settings: AppSettings): Promise<string> {
    const { url } = settings;

    // Get Ilias client id
    const res = await axios.get(url);
    const regex = /client_id=([^&]*)/;
    const match = res.request.res.responseUrl.match(regex);
    const webdavId = match && match[1];

    return webdavId;
}

export { getAppSettings, setAppSettings };
