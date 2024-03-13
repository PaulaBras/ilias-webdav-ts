import { useState, useEffect } from 'react';
import { Button, ButtonGroup, Table } from 'react-bootstrap';
import { CourseList } from 'src/shared/types/courseList';
import { downloadCourses, getCoursesList } from '../services/dashboard.service';
import { getAppSettings } from '../services/settings.service';
import { BiDownload } from 'react-icons/bi';
import { TbReload } from 'react-icons/tb';
import { AppSettings } from 'src/shared/types/appSettings';
import { checkSettings } from '@renderer/services/errorHandleling.service';
import { ProgressStatus } from 'src/shared/types/progress';
import { DownloadSize } from 'src/shared/types/downloadSize';
import { CourseTableRow } from '@renderer/services/dashboardTable.service';
import { getStatus, handleAutomaticService } from '@renderer/services/automatic.service';

type ProgressStatusMap = { [key: string]: ProgressStatus };
type DonwloadSizeMap = { [key: string]: DownloadSize };

function Dashboard() {
    const [courses, setCourses] = useState<CourseList[]>([]);
    const [appSettings, setAppSettings] = useState<AppSettings>({} as AppSettings);
    const [downloadText, setDownloadText] = useState('Download');
    const [isPaused, setIsPaused] = useState(false);

    const [downloadSize, setDownloadSize] = useState<DonwloadSizeMap>({});
    const [downloadStates, setDownloadStates] = useState<ProgressStatusMap>({});

    useEffect(() => {
        getAppSettings(setAppSettings);
        checkSettings(appSettings);
        getCoursesList(setCourses, setDownloadText);
        getStatus(setIsPaused);

        function progressHandler(_e, progress: ProgressStatus, refId: string) {

            setDownloadStates((oldValue) => {
                return {
                    ...oldValue,
                    [refId]: progress
                };
            });
        }

        function downloadSizeHandler(_e, downloadSize: DownloadSize, refId: string) {

            setDownloadSize((oldValue) => {
                return {
                    ...oldValue,
                    [refId]: downloadSize
                };
            });
        }

        window.api.callbacks.onDownloadSize(downloadSizeHandler);
        window.api.callbacks.onProgress(progressHandler);

        return () => {
            window.api.callbacks.offProgress(progressHandler);
            window.api.callbacks.offDownloadSize(downloadSizeHandler);
        };
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
                <Button {...isPaused ? {variant: "danger"} : {variant: "warning"}} onClick={() => handleAutomaticService(isPaused, setIsPaused)}>
                {isPaused ? 'Stop automatic Sync ' : 'Start automatic Sync'}
                </Button>
            </ButtonGroup>
            <hr />
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Courses</th>
                        <th>Download</th>
                        <th>Progress</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <CourseTableRow key={course.refId} course={course} status={downloadStates[course.refId]} downloadSize={downloadSize[course.refId]} appSettings={appSettings} setCourses={setCourses} />
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default Dashboard;
