import { useState, useEffect } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BiSave } from 'react-icons/bi';

function SettingsPage() {
    const [settings, setSettings] = useState({
        url: '',
        username: '',
        password: '',
        rootFolder: ''
    });

    useEffect(() => {
        window.api.settings.getAppSettings().then((appSettings) => {
            console.log(appSettings);
            setSettings(appSettings);
        });
    }, []);

    const handleChange = (e) => {
        setSettings({
            ...settings,
            [e.target.name]: e.target.value
        });
    };

    function handleSubmit(e) {
        console.log('submit');
        if (e.target.name === 'url') {
            const urlPattern = /^(http|https):\/\/[^ "]+$/;
            if (!urlPattern.test(e.target.value)) {
                alert('Please enter a valid URL.');
                // return;
            }
        }
        console.log(settings);
        window.api.settings.setAppSettings(settings);
        e.preventDefault();
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
                    <Form.Control as="input" type="file" webkitdirectory="" directory="true" name="rootFolder" value={settings.rootFolder} onChange={handleChange} />
                </Form.Group>
            </Form>
        </div>
    );
}

export default SettingsPage;
