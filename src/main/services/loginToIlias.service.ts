import axios from 'axios';
import { getAppSettings } from './config.service';
import { setCoursesList } from './courses.service';

async function login(): Promise<string> {
    const { url, username, password, webdavId } = getAppSettings();
    let coursesArray: { name: string, refId: string, download: boolean }[] = [];
    let setCookieHeader;
    let phpSessId;

    if (!url || !username || !password || !webdavId) {
        return 'Please enter all required fields in the settings.';
    }

    const loginData = {
        username: username,
        password: password,
        'cmd[doStandardAuthentication]': 'Anmelden'
    };

    // Login
    try {
        await axios.post(url + `/ilias.php?lang=de&client_id=${webdavId}&cmd=post&cmdClass=ilstartupgui&cmdNode=10l&baseClass=ilStartUpGUI&rtoken=`, loginData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            withCredentials: true,
            maxRedirects: 0
        });
    } catch (error: any) {

        // Catch 302 error and get the new cookie
        if (error.response && error.response.status === 302) {
            setCookieHeader = error.response.headers['set-cookie'];
            if (!setCookieHeader) return 'Invalid login data';

            phpSessId = setCookieHeader
                .find((cookie) => cookie.startsWith('PHPSESSID'))
                ?.split('=')[1]
                .split(';')[0];
            if (!phpSessId) return 'Invalid login data';
            // The server is redirecting to a different page
            const redirectUrl = error.response.headers.location;

            // Make a new request to the redirect URL
            await axios.get(redirectUrl, {
                headers: {
                    Cookie: 'PHPSESSID=' + phpSessId + `; ilClientId=${webdavId}`
                },
                withCredentials: true
            });
        } else {
            // Some other error occurred
            console.error(error);
        }
    }

    // Get courses
    let courses = await axios.get(url + '/ilias.php?cmdClass=ilmembershipoverviewgui&cmdNode=jb&baseClass=ilmembershipoverviewgui', {
        headers: {
            Cookie: 'PHPSESSID=' + phpSessId + `; ilClientId=${webdavId}`
        },
        withCredentials: true
    });

    // Parse course names and ref_ids
    let lines = courses.data.split('\n');
    let refIdLines = lines.filter((line) => line.includes('ref_id=') && line.includes('<a'));

    refIdLines.forEach((line) => {
        let nameMatch = line.match(/<a[^>]*>([^<]+)<\/a>/);
        let refIdMatch = line.match(/ref_id=([0-9]+)/);

        if (nameMatch && refIdMatch) {
            coursesArray.push({ name: nameMatch[1], refId: refIdMatch[1], download: true});
        }
    });

    // coursesArray; --> to storage
    console.log(coursesArray); // debug
    setCoursesList({ Array: coursesArray });

    return 'Success';
}

export { login };
