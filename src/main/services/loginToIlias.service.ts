import axios from 'axios';
import { getAppSettings } from './config.service';
import { getCoursesList, setCoursesList } from './courses.service';
import { CourseList } from '../../shared/types/courseList';
import Store from 'electron-store';

const store = new Store();

async function login(): Promise<string> {
    let { url, username, password, webdavId } = getAppSettings();
    
    let coursesArray: CourseList[] = [];
    let setCookieHeader;
    let phpSessId;

    if (!url || !username || !password) {
        return 'Please enter all required fields in the settings.';
    }
    
    // If webdavId is missing, try to get it from the plain URL
    if (!webdavId) {
        try {
            // Ensure we're using just the base URL without any path or parameters
            const baseUrl = url.replace(/\/+$/, ''); // Remove trailing slashes
            
            const response = await axios.get(baseUrl, {
                maxRedirects: 0, // Don't follow redirects automatically
                validateStatus: function (status) {
                    return status >= 200 && status < 400; // Accept redirects
                }
            });
            
            // Check for Set-Cookie header with ilClientId
            if (response.headers && response.headers['set-cookie']) {
                const cookies = response.headers['set-cookie'];
                for (const cookie of cookies) {
                    const ilClientIdMatch = cookie.match(/ilClientId=([^;]+)/);
                    if (ilClientIdMatch && ilClientIdMatch[1]) {
                        webdavId = ilClientIdMatch[1];
                        
                        // Update the settings with the new webdavId
                        const appSettings = getAppSettings();
                        appSettings.webdavId = webdavId;
                        store.set('appSettings', appSettings);
                        
                        break;
                    }
                }
            }
        } catch (error: any) {
            // Check if this is a redirect error (status code 302)
            if (error.response && error.response.status === 302) {
                // Check for Set-Cookie header with ilClientId
                if (error.response.headers && error.response.headers['set-cookie']) {
                    const cookies = error.response.headers['set-cookie'];
                    for (const cookie of cookies) {
                        const ilClientIdMatch = cookie.match(/ilClientId=([^;]+)/);
                        if (ilClientIdMatch && ilClientIdMatch[1]) {
                            webdavId = ilClientIdMatch[1];
                            
                            // Update the settings with the new webdavId
                            const appSettings = getAppSettings();
                            appSettings.webdavId = webdavId;
                            store.set('appSettings', appSettings);
                            
                            break;
                        }
                    }
                }
            }
        }
    }

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
        let loginUrl = url;
        if (webdavId) {
            loginUrl += `/ilias.php?lang=de&client_id=${webdavId}&cmd=post&cmdClass=ilstartupgui&baseClass=ilStartUpGUI&fallbackCmd=doStandardAuthentication&rtoken=`;
        } else {
            loginUrl += `/ilias.php?lang=de&cmd=post&cmdClass=ilstartupgui&baseClass=ilStartUpGUI&fallbackCmd=doStandardAuthentication&rtoken=`;
        }
        
        await axios.post(
            loginUrl, 
            formData,
            {
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${boundary}`,
                    'Content-Length': Buffer.from(formData).length.toString()
                },
                withCredentials: true,
                maxRedirects: 0
            }
        );
    } catch (error: any) {
        // Catch 302 error and get the new cookie
        if (error.response && error.response.status === 302) {
            setCookieHeader = error.response.headers['set-cookie'];
            if (!setCookieHeader) {
                return 'Invalid login data';
            }
            
            // If webdavId is not set, try to extract it from the Set-Cookie header
            if (!webdavId) {
                for (const cookie of setCookieHeader) {
                    const ilClientIdMatch = cookie.match(/ilClientId=([^;]+)/);
                    if (ilClientIdMatch && ilClientIdMatch[1]) {
                        webdavId = ilClientIdMatch[1];
                        
                        // Update the settings with the new webdavId
                        const appSettings = getAppSettings();
                        appSettings.webdavId = webdavId;
                        store.set('appSettings', appSettings);
                        
                        break;
                    }
                }
                
                if (!webdavId) {
                    return 'Could not determine WebDAV ID';
                }
            }
            
            phpSessId = setCookieHeader
                .find((cookie) => cookie.startsWith('PHPSESSID'))
                ?.split('=')[1]
                .split(';')[0];
                
            if (!phpSessId) {
                return 'Invalid login data';
            }

            // Make a new request to the redirect URL
            try {
                await axios.get(error.response.headers.location, {
                    headers: {
                        Cookie: `PHPSESSID=${phpSessId}; ilClientId=${webdavId}`
                    },
                    withCredentials: true
                });
            } catch (redirectError) {
                return 'Error following redirect';
            }
        } else {
            return 'Login failed with unexpected error';
        }
    }

    // Get courses
    let courses;
    try {
        courses = await axios.get(url + `/ilias.php?baseClass=ilmembershipoverviewgui`, {
            headers: {
                Cookie: `PHPSESSID=${phpSessId}; ilClientId=${webdavId}`
            },
            withCredentials: true
        });
        
        // Check if we're actually logged in by looking for common elements
        if (courses.data.includes('login_form') || courses.data.includes('loginform')) {
            return 'Login failed';
        }
    } catch (error) {
        return 'Error fetching courses';
    }
    
    // Parse course names and ref_ids
    let lines = courses.data.split('\n');
    
    // Create a map to store unique ref_ids with their course titles
    const refIdMap = new Map();
    
    // First find all h4 titles
    let currentTitle = '';
    let titleMatchCount = 0;
    let refIdMatchCount = 0;
    let successfulMatches = 0;
    
    lines.forEach((line, index) => {
        const titleMatch = line.match(/<h4 class="il-item-title"><a[^>]*>([^<]+)<\/a><\/h4>/);
        if (titleMatch) {
            currentTitle = titleMatch[1];
            titleMatchCount++;
        }
        
        const refIdMatch = line.match(/ref_id=([0-9]+)/);
        if (refIdMatch) {
            refIdMatchCount++;
            if (currentTitle) {
                const refId = refIdMatch[1];
                if (!refIdMap.has(refId)) {
                    refIdMap.set(refId, currentTitle);
                    successfulMatches++;
                }
            }
        }
    });
    
    // Try alternative pattern if no courses found
    if (refIdMap.size === 0) {
        // Alternative pattern 1: Look for course cards
        lines.forEach((line, index) => {
            // Different title pattern
            const altTitleMatch = line.match(/<div class="il-card-title">([^<]+)<\/div>/);
            if (altTitleMatch) {
                currentTitle = altTitleMatch[1].trim();
                
                // Look for refId in nearby lines (next 5 lines)
                for (let i = 1; i <= 5 && index + i < lines.length; i++) {
                    const nearbyRefIdMatch = lines[index + i].match(/ref_id=([0-9]+)/);
                    if (nearbyRefIdMatch) {
                        const refId = nearbyRefIdMatch[1];
                        if (!refIdMap.has(refId)) {
                            refIdMap.set(refId, currentTitle);
                        }
                        break;
                    }
                }
            }
        });
    }
    
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

    // Make sure the webdavId is saved in the settings
    if (webdavId) {
        const appSettings = getAppSettings();
        if (appSettings.webdavId !== webdavId) {
            appSettings.webdavId = webdavId;
            store.set('appSettings', appSettings);
        }
    }

    if (coursesArray.length === 0) {
        return 'Success but no courses found';
    }

    return 'Success';
}

export { login };
