import Store from 'electron-store';
import { AppSettings } from '../../shared/types/appSettings';
import axios from 'axios';

const store = new Store();

function getAppSettings(): AppSettings {
    return store.get('appSettings', {}) as AppSettings;
}

function setAppSettings(settings: AppSettings): void {
    getWebDavID(settings).then(webdavId => {
        settings.webdavId = webdavId;
        store.set('appSettings', settings);
    }).catch(_ => {
        // Save settings even if webdavId retrieval fails
        store.set('appSettings', settings);
    });
}

async function getWebDavID(settings: AppSettings): Promise<string> {
    // Ensure we're using just the base URL without any path or parameters
    const baseUrl = settings.url.replace(/\/+$/, ''); // Remove trailing slashes
    
    try {
        // Make a request to the plain URL
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
                    return ilClientIdMatch[1];
                }
            }
        }
        
        // If we didn't find it in the Set-Cookie header, try other methods
        
        // Try different ways to get the final URL with client_id
        let finalUrl = '';
        
        // Method 1: Check response.request.res.responseUrl
        if (response.request?.res?.responseUrl) {
            finalUrl = response.request.res.responseUrl;
        } 
        // Method 2: Check response.request.responseURL
        else if (response.request?.responseURL) {
            finalUrl = response.request.responseURL;
        }
        // Method 3: Check response.headers.location
        else if (response.headers?.location) {
            finalUrl = response.headers.location;
        }
        
        // Extract client_id from the URL
        const clientIdMatch = finalUrl.match(/client_id=([^&]*)/);
        if (clientIdMatch && clientIdMatch[1]) {
            return clientIdMatch[1];
        }
        
        // As a fallback, try to find it in the HTML content
        const htmlClientIdMatch = response.data.match(/client_id=([^&"']+)/);
        if (htmlClientIdMatch && htmlClientIdMatch[1]) {
            return htmlClientIdMatch[1];
        }
        
        // Last resort: check if there's a form with a hidden input for client_id
        const formInputMatch = response.data.match(/<input[^>]*name=["']client_id["'][^>]*value=["']([^"']+)["']/);
        if (formInputMatch && formInputMatch[1]) {
            return formInputMatch[1];
        }
        
        return '';
    } catch (error: any) {
        // Check if this is a redirect error (status code 302)
        if (error.response && error.response.status === 302) {
            // Check for Set-Cookie header with ilClientId
            if (error.response.headers && error.response.headers['set-cookie']) {
                const cookies = error.response.headers['set-cookie'];
                for (const cookie of cookies) {
                    const ilClientIdMatch = cookie.match(/ilClientId=([^;]+)/);
                    if (ilClientIdMatch && ilClientIdMatch[1]) {
                        return ilClientIdMatch[1];
                    }
                }
            }
        }
        
        return '';
    }
}

export { getAppSettings, setAppSettings };
