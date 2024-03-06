import axios from 'axios';
import { getAppSettings } from './config.service';

async function login(): Promise<string> {
    const { url, username, password, webdavId } = getAppSettings();

    if(!url || !username || !password || !webdavId) {
        return "Please enter all required fields in the settings.";
    }

    // Login to Ilias
    await axios.post(url + `/ilias.php?lang=de&client_id=${webdavId}&cmd=post&cmdClass=ilstartupgui&baseClass=ilStartUpGUI&rtoken=`, {
        username: username,
        password: password,
        "cmd[doStandardAuthentication]": 'Anmelden'
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    return "changeme"
}


export { login };
