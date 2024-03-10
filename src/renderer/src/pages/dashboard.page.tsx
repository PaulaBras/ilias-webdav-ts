import { useState, useEffect } from 'react';
import { Button, ButtonGroup, Table } from 'react-bootstrap';
import { CourseList } from 'src/shared/types/courseList';
import { downloadCourses, getCoursesList, handleCheckboxChange } from '../services/dashboard.service';
import { alert } from '../middleware/alert.middleware';
import { getAppSettings } from '../services/settings.service';
import { BiDownload } from 'react-icons/bi';
import { TbReload } from 'react-icons/tb';
import { MdOpenInNew } from "react-icons/md";
import { AppSettings } from 'src/shared/types/appSettings';

function Dashboard() {
    const [courses, setCourses] = useState<CourseList[]>([]);
    const [appSettings, setAppSettings] = useState<AppSettings>({} as AppSettings);
    const [downloadText, setDownloadText] = useState('Download');

    function pauseDownload() {
        console.log('Pause');
    }

    useEffect(() => {
        getAppSettings(setAppSettings);
        if(appSettings.rootFolder === '') {
            alert.error('Please set the root folder in the settings page.');
            return;
        }
        getCoursesList(setCourses, setDownloadText);
    }, []);

    return (
        <div className="p-3">
            <h3>Dashboard</h3>
            <p>Here you can see all your courses and download them. Click on the refresh button to get the latest courses from ILIAS. If you don't see any courses you might need to check the settings page.</p>
            <ButtonGroup aria-label="Course actions">
                <Button variant="primary" onClick={() => getCoursesList(setCourses, setDownloadText)}>
                    <TbReload /> Refresh Courses
                </Button>
                <Button variant="success" onClick={() => downloadCourses(courses)}>
                    <BiDownload /> {downloadText}
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
                            <td>{course.name} <MdOpenInNew /></td>
                            <td>
                                <input type="checkbox" checked={course.download} onChange={(e) => handleCheckboxChange(course.refId, e.target.checked, setCourses)} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default Dashboard;
