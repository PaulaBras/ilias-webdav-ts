import { useState, useEffect } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BiSave } from 'react-icons/bi';
import { FaRegFolderOpen } from 'react-icons/fa';
import { alert } from '../middleware/alert.middleware';

function SettingsPage() {
    const [settings, setSettings] = useState({
        url: '',
        username: '',
        password: '',
        rootFolder: ''
    });

    useEffect(() => {
        window.api.settings.getAppSettings().then((appSettings) => {
            setSettings(appSettings);
        });
    }, []);

    const openDialog = (e) => {
        window.api.settings.openDialog().then((filePaths) => {
            console.log(filePaths[0]);
            setSettings((prevSettings) => ({
                ...prevSettings,
                rootFolder: filePaths[0]
            }));
        });
    };

    const handleChange = (e) => {
        setSettings({
            ...settings,
            [e.target.name]: e.target.value
        });
    };

    function handleSubmit(e: React.FormEvent) {
        const urlPattern = /^(http|https):\/\/[^ "]+$/;
        if (!urlPattern.test(settings.url)) {
            alert.error('Please enter a valid URL.');
            return;
        }

        window.api.settings.setAppSettings(settings).then(() => {
            alert.success('Settings saved.');
        });
        e.preventDefault();
    }

    return (
        <div className="p-3">
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <h3>Settings</h3>
                    </Col>
                    <Col className="d-flex justify-content-end">
                        <Button variant="primary" type="submit">
                            <BiSave /> Save
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId="url">
                            <Form.Label>Ilias URL</Form.Label>
                            <Form.Control type="url" name="url" value={settings.url} onChange={handleChange} required />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" name="username" value={settings.username} onChange={handleChange} required />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" value={settings.password} onChange={handleChange} required />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId="rootFolder">
                            <Form.Label>Root Folder</Form.Label>

                            <Row>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Button type="button" variant="secondary" onClick={openDialog} style={{ whiteSpace: 'nowrap', marginRight: '10px' }}>
                                        <FaRegFolderOpen /> Select Directory
                                    </Button>
                                    <Form.Control type="text" name="rootFolder" readOnly value={settings.rootFolder} onChange={handleChange} required />
                                </div>
                            </Row>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default SettingsPage;
