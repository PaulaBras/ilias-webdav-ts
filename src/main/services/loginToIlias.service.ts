import axios from 'axios';
import { getAppSettings } from './config.service';
import { getCoursesList, setCoursesList } from './courses.service';
import { CourseList } from '../../shared/types/courseList';

async function login(): Promise<string> {
    const { url, username, password, webdavId } = getAppSettings();
    let coursesArray: CourseList[] = [];
    let setCookieHeader;
    let phpSessId;
    let cmdNode;

    if (!url || !username || !password || !webdavId) {
        return 'Please enter all required fields in the settings.';
    }

    await axios.get(url + '/login.php').then((response) => {
        const regex = /action="ilias\.php\?lang=de&cmd=post&cmdClass=ilstartupgui&cmdNode=(\w+)&baseClass=ilStartUpGUI&rtoken="/;

        response.data.split('\n').forEach((line: string) => {
            const match = line.match(regex);
            if (match) {
                cmdNode = match[1];
            }
        });
    });

    const loginData = {
        username: username,
        password: password,
        'cmd[doStandardAuthentication]': 'Anmelden'
    };

    // Login
    try {
        await axios.post(url + `/ilias.php?lang=de&client_id=${webdavId}&cmd=post&cmdClass=ilstartupgui&cmdNode=${cmdNode}&baseClass=ilStartUpGUI&rtoken=`, loginData, {
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

            // Make a new request to the redirect URL
            await axios.get(error.response.headers.location, {
                headers: {
                    Cookie: `PHPSESSID=${phpSessId}; ilClientId=${webdavId}`
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
            Cookie: `PHPSESSID=${phpSessId}; ilClientId=${webdavId}`
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
            coursesArray.push({ name: nameMatch[1], refId: refIdMatch[1], download: true });
        }
    });

    // Get existing courses list
    const existingCoursesList = getCoursesList();

    // if (existingCoursesList !== null && Array.isArray(existingCoursesList)) {
    // Create a map for quick lookup
    const existingCoursesMap = new Map(existingCoursesList?.map?.((course) => [course.refId, course]) ?? []);
    // Update courses array
    coursesArray = coursesArray.map((course) => {
        const existingCourse = existingCoursesMap.get(course.refId);
        if (existingCourse !== undefined) {
            return existingCourse;
        } else {
            return course;
        }
    });

    setCoursesList(coursesArray);

    return 'Success';
}

export { login };
