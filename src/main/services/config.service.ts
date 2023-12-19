import Store from 'electron-store';
import { AppSettings } from '../../shared/types/appSettings';

const store = new Store();

function getAppSettings(): AppSettings {
    console.log(store.get('appSettings', {}));
    return store.get('appSettings', {}) as AppSettings;
}

function setAppSettings(settings: AppSettings): void {
    return store.set('appSettings', settings);
}

export { getAppSettings, setAppSettings };
