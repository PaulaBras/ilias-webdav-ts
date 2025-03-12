import { Badge, Form, ProgressBar, Spinner } from 'react-bootstrap';
import { CourseList } from 'src/shared/types/courseList';
import { handleCheckboxChange } from '../services/dashboard.service';
import { MdOpenInNew } from 'react-icons/md';
import { ProgressStatus } from 'src/shared/types/progress';
import { DownloadSize } from 'src/shared/types/downloadSize';

interface ICourseTableRowProps {
    course: CourseList;
    status: ProgressStatus | undefined;
    downloadSize: DownloadSize | undefined;
    setCourses: React.Dispatch<React.SetStateAction<CourseList[]>>;
}

function CourseTableRow({ course, status, downloadSize, setCourses }: ICourseTableRowProps) {

    // Function to render the download size or error
    const renderDownloadSizeOrError = () => {
        if (!downloadSize) {
            return <Spinner animation="border" size="sm" role="status" style={{ marginLeft: '5px' }} />;
        }
        
        if (!downloadSize.done) {
            return <Spinner animation="border" size="sm" role="status" style={{ marginLeft: '5px' }} />;
        }
        
        if (downloadSize.error) {
            return <span style={{ color: 'red', marginLeft: '5px' }}>{downloadSize.error}</span>;
        }
        
        return `(${(downloadSize.size / 1024 / 1024).toFixed(2)} MB)`;
    };

    // Function to render the progress bar or error badge
    const renderProgressOrError = () => {
        // If there's an error in the download size, show a red badge instead of the progress bar
        if (downloadSize?.error) {
            return <Badge bg="danger">Error</Badge>;
        }
        
        // Otherwise, show the progress bar
        return (
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
        );
    };

    return (
        <tr>
            <td>
                {/* <a href="#"
                    onClick={(event) => {
                        event.preventDefault();
                        shell.openExternal(`${appSettings.url}/ilias.php?refid_${course.refId}&cmdClass=ilrepositorygui&cmdNode=xc&baseClass=ilrepositorygui`);
                    }} >
                </a> */}
                {/* // TODO: It failes due to the shell */}
                {course.name} <MdOpenInNew />
            </td>
            <td style={{ display: 'flex', alignItems: 'center' }}>
                <Form.Check type="switch" checked={course.download} id={course.refId} onChange={(e) => handleCheckboxChange(course.refId, e.target.checked, setCourses)} />
                {renderDownloadSizeOrError()}
            </td>
            <td style={{ minWidth: '150px' }}>
                {renderProgressOrError()}
            </td>
        </tr>
    );
}

export { CourseTableRow };
