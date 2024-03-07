import axios from 'axios';
import { getAppSettings } from './config.service';

async function login(): Promise<string> {
    const { url, username, password, webdavId } = getAppSettings();

    if (!url || !username || !password || !webdavId) {
        return 'Please enter all required fields in the settings.';
    }

    // console.log(url, username, password, webdavId);

    const loginData = {
        username: username,
        password: password,
        'cmd[doStandardAuthentication]': 'Anmelden'
    }

    // Login
    const login = await axios.post(
        url + `/ilias.php?lang=de&client_id=${webdavId}&cmd=post&cmdClass=ilstartupgui&cmdNode=10l&baseClass=ilStartUpGUI&rtoken=`, loginData,
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Host': 'www.ilias.rfh-koeln.de',
                'Origin': 'https://www.ilias.rfh-koeln.de',
                'Referer': 'https://www.ilias.rfh-koeln.de/login.php?client_id=iliasrfh&cmd=force_login&lang=de'
            
            },

            maxRedirects: 3
        }
    );
    console.log(login.request);

    console.log(login.headers['set-cookie']);

    // Extract the PHPSESSID cookie
    const setCookieHeader = login.headers['set-cookie'];
    if(!setCookieHeader) {
        return 'Invalid login data';
    }
    const redirectUrl = "https://www.ilias.rfh-koeln.de/goto.php?target=root_1&client_id=iliasrfh";
    console.log(redirectUrl);
    const phpSessIdCookie = setCookieHeader.find((cookie) => cookie.startsWith('PHPSESSID'));
    if(!phpSessIdCookie) {
        return 'Invalid login data';
    }
    const phpSessId = phpSessIdCookie.split('=')[1].split(';')[0]
    console.log(phpSessId)


    const redirectResponse = await axios.get(redirectUrl, {
        headers: {
            'Cookie': `PHPSESSID=${phpSessId}`
        }
    });
    
    // console.log(redirectResponse.data);

    // Perform the redirect request with the PHPSESSID cookie

    // console.log(redirectResponse.data);
    // console.log(login.request._redirectable._redirectCount);
    // console.log(login.headers);
    // console.log(login.data, login.statusText, login.status);

    // //search if data contains password input field
    if (redirectResponse.data.includes('password')) {
        console.log('Invalid login data');
        // return 'Invalid login data';
    }

    // Get courses
    let courses = await axios.get(url + '/ilias.php?baseClass=ilDashboardGUI&cmd=jumpToSelectedItems');
    if (courses.data.includes('ref_id')) {
        console.log('Logged in');
        return 'Logged in';
    }

    return 'changeme';
}

export { login };
