import { AppSettings } from "src/shared/types/appSettings";
import { alert } from '../middleware/alert.middleware';

function checkSettings(appSettings: AppSettings) {
    if(appSettings.url === '') {
        alert.error('Please set the ILIAS URL in the settings page.');
        return false;
    }
    if(appSettings.username === '') {
        alert.error('Please set the username in the settings page.');
        return false;
    }
    if(appSettings.password === '') {
        alert.error('Please set the password in the settings page.');
        return false;
    }
    if(appSettings.rootFolder === '') {
        alert.error('Please set the root folder in the settings page.');
        return false;
    }
    return true;
}

export { checkSettings };