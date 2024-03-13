import { App } from "electron";
import { AppSettings } from "src/shared/types/appSettings";

function getAppSettings(): Promise<AppSettings> {
    return window.api.settings.getAppSettings();
}

export { getAppSettings };