import { AppSettings } from "src/shared/types/appSettings";
import { alert } from '../middleware/alert.middleware';

function checkSettings(appSettings: AppSettings): boolean {
    let errors: string[] = [];

    if(!appSettings) {
        errors.push('Please set the settings in the settings page.');
        return false;
    }

    if(appSettings.url === '') {
        errors.push('Please set the ILIAS URL in the settings page.');
    } else if (appSettings.url.slice(8).includes('/')) {
        errors.push('Warning: The ILIAS URL should not contain any slashes after "https://".');
    }

    if(appSettings.username === '') {
        errors.push('Please set the username in the settings page.');
    }

    if(appSettings.password === '') {
        errors.push('Please set the password in the settings page.');
    }

    if(appSettings.rootFolder === '') {
        errors.push('Please set the root folder in the settings page.');
    }

    if (errors.length > 0) {
        alert.error(errors.join('\n'));
        return false;
    }

    return true;
}

export { checkSettings };