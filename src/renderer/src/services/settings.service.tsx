import { AppSettings } from "src/shared/types/appSettings";

function getAppSettings(setCourses: React.Dispatch<React.SetStateAction<AppSettings>>) {
    window.api.settings.getAppSettings().then((data) => {
        setCourses(data);
    });
}

export { getAppSettings };