import { useState, useEffect } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BiSave } from 'react-icons/bi';

function SettingsPage() {
    const [settings, setSettings] = useState({
        url: '',
        username: '',
        password: '',
        rootFolder: '',
        webdavId: '',
    });

    useEffect(() => {
        window.api.settings.getAppSettings().then((appSettings) => {
            setSettings(appSettings);
        });
    }, []);

    const openDialog = (e) => {
        window.api.settings.openDialog().then((filePaths) => {
            console.log(filePaths);
            settings.rootFolder = filePaths[0];
            handleChange(e);
        });
    };

    const handleChange = (e) => {
        setSettings({
            ...settings,
            [e.target.name]: e.target.value
        });
    };

    function handleSubmit(e) {
        if (e.target.name === 'url') {
            const urlPattern = /^(http|https):\/\/[^ "]+$/;
            if (!urlPattern.test(e.target.value)) {
                alert('Please enter a valid URL.');
                // return;
            }
        }
        window.api.settings.setAppSettings(settings);
        e.preventDefault();
    }

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
                <Row>
                    <Col>
                        <Form.Group controlId="url">
                            <Form.Label>Ilias URL</Form.Label>
                            <Form.Control type="url" name="url" value={settings.url} onChange={handleChange} required />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" name="username" value={settings.username} onChange={handleChange} required />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId="rootFolder">
                            <Form.Label>Root Folder</Form.Label>

                            <Row>
                                <Col>
                                    <Button type="button" onClick={openDialog}>
                                        Select Directory
                                    </Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Control type="text" name="rootFolder" readOnly value={settings.rootFolder} onChange={handleChange} required />
                                </Col>
                            </Row>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" value={settings.password} onChange={handleChange} required />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default SettingsPage;
