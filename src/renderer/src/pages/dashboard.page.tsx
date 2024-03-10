import { useState, useEffect } from 'react';
import { Button, ButtonGroup, Form, Table, ProgressBar } from 'react-bootstrap';
import { CourseList } from 'src/shared/types/courseList';
import { downloadCourses, getCoursesList, handleCheckboxChange } from '../services/dashboard.service';
import { getAppSettings } from '../services/settings.service';
import { BiDownload } from 'react-icons/bi';
import { TbReload } from 'react-icons/tb';
import { MdOpenInNew } from 'react-icons/md';
import { AppSettings } from 'src/shared/types/appSettings';
import { checkSettings } from '@renderer/services/errorHandleling.service';
import { ProgressStatus } from 'src/shared/types/progress';
import { DownloadSize } from 'src/shared/types/downloadSize';

type ProgressStatusMap = { [key: string]: ProgressStatus };
interface ICourseTableRowProps {
    course: CourseList;
    status: ProgressStatus | undefined;
    downloadSize: DownloadSize[];
    setCourses: React.Dispatch<React.SetStateAction<CourseList[]>>;
}

function CourseTableRow({ course, status, downloadSize, setCourses }: ICourseTableRowProps) {
        const downloadSizeItem = downloadSize.find(item => item.refId === course.refId);
        const sizeInBytes = downloadSizeItem ? downloadSizeItem.size : 0;
    
    return (
        <tr>
            <td>
                {course.name} <MdOpenInNew />
            </td>
            <td>
                <Form.Check type="switch" checked={course.download} onChange={(e) => handleCheckboxChange(course.refId, e.target.checked, setCourses)} />
                {sizeInBytes > 0 ? `(${(sizeInBytes / 1024 / 1024).toFixed(2)} MB)` : ''}
            </td>
            <td style={{ minWidth: '150px' }}>
                <ProgressBar
                    {...(status?.done
                        ? {
                              now: 100,
                              label: ''
                          }
                        : {
                              animated: true,
                              striped: true
                          })}
                    variant="success"
                    id={course.refId}
                    now={status?.percentage ?? 0}
                    label={typeof status?.fileCount == 'undefined' || status.fileCount == -1 ? '' : `${status?.fileIndex} / ${status?.fileCount}`}
                />
            </td>
        </tr>
    );
}

function Dashboard() {
    const [courses, setCourses] = useState<CourseList[]>([]);
    const [appSettings, setAppSettings] = useState<AppSettings>({} as AppSettings);
    const [downloadText, setDownloadText] = useState('Download');
    const [downloadSize, setDownloadSize] = useState<DownloadSize[]>([]);

    const [downloadStates, setDownloadStates] = useState<ProgressStatusMap>({});

    function pauseDownload() {
        console.log('Pause');
    }

    useEffect(() => {
        getAppSettings(setAppSettings);
        checkSettings(appSettings);
        getCoursesList(setCourses, setDownloadText, setDownloadSize);

        function progressHandler(_e, progress: ProgressStatus, refId: string) {
            console.log({ progress, refId });

            setDownloadStates((oldValue) => {
                return {
                    ...oldValue,
                    [refId]: progress
                };
            });
        }

        window.api.callbacks.onProgress(progressHandler);

        return () => {
            window.api.callbacks.offProgress(progressHandler);
        };
    }, []);

    console.log(downloadStates);

    return (
        <div className="p-3">
            <h3>Dashboard</h3>
            <p>Here you can see all your courses and download them. Click on the refresh button to get the latest courses from ILIAS. If you don't see any courses you might need to check the settings page.</p>
            <ButtonGroup aria-label="Course actions">
                <Button variant="primary" onClick={() => getCoursesList(setCourses, setDownloadText, setDownloadSize)}>
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
                        <th>Courses</th>
                        <th>Download</th>
                        <th>Progress</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <CourseTableRow key={course.refId} course={course} status={downloadStates[course.refId]} downloadSize={downloadSize} setCourses={setCourses} />
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default Dashboard;
