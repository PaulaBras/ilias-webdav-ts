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

    // Create the multipart form-data with specific boundary
    const boundary = '-----------------------------' + Math.floor(Math.random() * 1000000000000000);
    const formData = [
        `--${boundary}`,
        'Content-Disposition: form-data; name="login_form/input_3/input_4"',
        '',
        username,
        `--${boundary}`,
        'Content-Disposition: form-data; name="login_form/input_3/input_5"',
        '',
        password,
        `--${boundary}--`
    ].join('\r\n');

    // Login
    try {
        const response = await axios.post(
            url + `/ilias.php?lang=de&client_id=${webdavId}&cmd=post&cmdClass=ilstartupgui&baseClass=ilStartUpGUI&fallbackCmd=doStandardAuthentication&rtoken=`, 
            formData,
            {
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${boundary}`,
                    'Content-Length': Buffer.from(formData).length.toString()
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
        }
    }

    // Get Courses CmdNode to get courses
    const response = await axios.get(url + `/ilias.php?baseClass=ilRepositoryGUI&amp;client_id=${webdavId}`, {
        headers: {
            Cookie: `PHPSESSID=${phpSessId}; ilClientId=${webdavId}`
        },
        withCredentials: true
    });

    const regex = /<a class="il-link link-bulky"[^>]*href="[^"]*cmdNode=([a-zA-Z0-9:]+)"/;
    const match = response.data.match(regex);
    let cmdNodeCourses = "";

    if (match && match[1]) {
        cmdNodeCourses = match[1]; 
    }

    // Get courses
    let courses = await axios.get(url + `/ilias.php?baseClass=ilmembershipoverviewgui`, {
        headers: {
            Cookie: `PHPSESSID=${phpSessId}; ilClientId=${webdavId}`
        },
        withCredentials: true
    });
    
    // Parse course names and ref_ids
    let lines = courses.data.split('\n');
    
    // Create a map to store unique ref_ids with their course titles
    const refIdMap = new Map();
    
    // First find all h4 titles
    let currentTitle = '';
    lines.forEach(line => {
        const titleMatch = line.match(/<h4 class="il-item-title"><a[^>]*>([^<]+)<\/a><\/h4>/);
        if (titleMatch) {
            currentTitle = titleMatch[1];
        }
        
        const refIdMatch = line.match(/ref_id=([0-9]+)/);
        if (refIdMatch && currentTitle) {
            const refId = refIdMatch[1];
            if (!refIdMap.has(refId)) {
                refIdMap.set(refId, currentTitle);
            }
        }
    });
    
    // Convert refIdMap to coursesArray with sanitized names
    refIdMap.forEach((title, refId) => {
        coursesArray.push({ 
            name: title, 
            refId: refId, 
            download: true 
        });
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
