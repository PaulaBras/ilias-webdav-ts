import axios from 'axios';
import Store from 'electron-store';
import { getAppSettings } from './config.service';

const store = new Store();

function getCourses(): string {
    return store.get('appCourses', {}) as string;
}

async function login() {
    const { url, username, password } = getAppSettings();

    // Get Ilias client id
    const res = await axios.get(url);
    const regex = /client_id=([^&]*)/;
    const match = res.request.res.responseUrl.match(regex);
    const webdavId = match && match[1];

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
}

function getData(): string {
    return store.get('appData', {}) as string;
}

export { getCourses, login, getData };