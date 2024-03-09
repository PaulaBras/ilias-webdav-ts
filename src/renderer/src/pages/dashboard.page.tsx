import { useState, useEffect } from 'react';
import { Button, ButtonGroup, Table } from 'react-bootstrap';
import { CourseList } from 'src/shared/types/courseList';

function Dashboard() {
    const [courses, setCourses] = useState<CourseList[]>([]);
    const [downloadText, setDownloadText] = useState('Download');

    function getCouses() {
        window.api.mainPage.login().then((data) => {
            if (data === 'Success') {
                window.api.mainPage.getCourses().then((data) => {
                    setCourses(data);
                });
                window.api.settings.getAppSettings().then((appSettings) => {
                    window.api.mainPage.checkFolderContents(appSettings.rootFolder).then((data) => {
                        if (data === 'files in Folder') {
                            setDownloadText('Sync');
                        } else {
                            setDownloadText('Download');
                        }
                    });
                });
            }
        });
    }

    function downloadCourses() {
        console.log('Download');
    }

    function pauseDownload() {
        console.log('Pause');
    }

    useEffect(() => {
        getCouses();
    }, []);

    return (
        <div className="p-3">
            <h3>Dashboard</h3>
            <p>Here you can see all your courses and download them. Click on the refresh button to get the latest courses from ILIAS. If you don't see any courses you might need to check the settings page.</p>
            <ButtonGroup aria-label="Course actions">
                <Button variant="primary" onClick={getCouses}>
                    Refresh Courses
                </Button>
                <Button variant="success" onClick={downloadCourses} disabled>
                    {downloadText}
                </Button>
                <Button variant="warning" onClick={pauseDownload} disabled>
                    Pause
                </Button>
            </ButtonGroup>
            <hr />
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>RefID</th>
                        <th>Courses</th>
                        <th>Download</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={course.name}>
                            <td>{course.refId}</td>
                            <td>{course.name}</td>
                            <td>
                                <input type="checkbox" checked={course.download} readOnly />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default Dashboard;
