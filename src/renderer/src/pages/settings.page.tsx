import { useState, useEffect } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BiSave } from 'react-icons/bi';
// import { dialog } from '@electron/remote';

function SettingsPage() {
    const [settings, setSettings] = useState({
        url: '',
        username: '',
        password: '',
        rootFolder: ''
    });

    useEffect(() => {
        window.api.settings.getAppSettings().then((appSettings) => {
            setSettings(appSettings || {});
        });
    }, []);

    const handleChange = (e) => {
        setSettings({
            ...settings,
            [e.target.name]: e.target.value
        });
    };

    // const handleDirectorySelect = async () => {
    //     const result = await dialog.showOpenDialog({
    //         properties: ['openDirectory']
    //     });

    //     if (!result.canceled && result.filePaths.length > 0) {
    //         const directoryPath = result.filePaths[0];
    //         // Now you can use directoryPath
    //     }
    // };

    const handleSubmit = (e) => {
        if (e.target.name === 'url') {
            const urlPattern = /^(http|https):\/\/[^ "]+$/;
            if (!urlPattern.test(e.target.value)) {
                alert('Please enter a valid URL.');
                return;
            }
        }
        e.preventDefault();
        window.api.settings.setAppSettings(settings);
    };

    return (
        <div className="p-3">
            <Form>
                <Row>
                    <Col>
                        <h2>Settings</h2>
                    </Col>
                    <Col className="d-flex justify-content-end">
                        <Button variant="primary" type="submit">
                            <BiSave /> Save
                        </Button>
                    </Col>
                </Row>
            </Form>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="url">
                    <Form.Label>URL</Form.Label>
                    <Form.Control type="url" name="url" value={settings.url} onChange={handleChange} required />
                </Form.Group>

                <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" name="username" value={settings.username} onChange={handleChange} required />
                </Form.Group>

                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" value={settings.password} onChange={handleChange} required />
                </Form.Group>

                <Form.Group controlId="rootFolder">
                    <Form.Label>Root Folder</Form.Label>

                    {/* <Button type="button" onClick={handleDirectorySelect}>
                        Select Directory
                    </Button> */}
                    <Form.Control as="input" type="file" webkitdirectory="" directory="true" name="rootFolder" onChange={handleChange} />

                    {/* <Button type="button" onClick={handleButtonClick}>
                        Select Directory
                    </Button>
                    <Form.Control type="text" value={folderPath} readOnly /> */}
                </Form.Group>
            </Form>
        </div>
    );
}

export default SettingsPage;
