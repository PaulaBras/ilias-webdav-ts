import axios from 'axios';
import { getAppSettings } from './config.service';

async function login(): Promise<string> {
    const { url, username, password, webdavId } = getAppSettings();

    if (!url || !username || !password || !webdavId) {
        return 'Please enter all required fields in the settings.';
    }

    console.log(url, username, password, webdavId);

    // Login
    const login = await axios.post(url + `/ilias.php?lang=de&client_id=${webdavId}&cmd=post&cmdClass=ilstartupgui&baseClass=ilStartUpGUI&rtoken=`, {
        "username": username,
        "password": password,
        // "cmd[doStandardAuthentication]": 'Anmelden'
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        maxRedirects: 4,
        validateStatus: function (status) {
            return status < 305; // Resolve only if the status code is less than 300
        }
    });

    // console.log(login.data);
    // console.log(login.data, login.statusText, login.status);

    // //search if data contains password input field
    if (login.data.includes('password')) {
        console.log('Invalid login data');
        return 'Invalid login data';
    }

    // Get courses
    // let courses = await axios.get(url + '/ilias.php?baseClass=ilDashboardGUI&cmd=jumpToSelectedItems');
    // console.log(courses.data, courses.status);

    return 'changeme';
}

export { login };
