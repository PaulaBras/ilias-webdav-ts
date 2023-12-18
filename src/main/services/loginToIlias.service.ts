import axios from 'axios';
import * as querystring from 'querystring';

async function login(todo, url, username, password, rootFolder) {
    // Get Ilias client id
    const response = await axios.get(url);
    const finalUrl = response.request.res.responseUrl;
    const webdavId = finalUrl.match(/client_id=([^&]*)/)?.[1];

    // Login to Ilias
    await axios.post(url + `/ilias.php?lang=de&client_id=${webdavId}&cmd=post&cmdClass=ilstartupgui&baseClass=ilStartUpGUI&rtoken=`, 
    querystring.stringify({ 
        username: username, 
        password: password, 
        "cmd[doStandardAuthentication]": 'Anmelden' 
    }), 
    {
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded' 
        }
    }
    );

    // if (todo == 'sync') {
    //     syncFiles(webdavId, rootFolder, url, username, password).then(() => {
    //         startDisplay(rootFolder);
    //     });
    // } else if (todo == 'download') {
    //     getAllFiles(rootFolder, url, username, password, webdavId);
    // }
}

export { login };
