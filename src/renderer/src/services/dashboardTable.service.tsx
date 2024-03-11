import { Form, ProgressBar, Spinner } from 'react-bootstrap';
import { CourseList } from 'src/shared/types/courseList';
import { handleCheckboxChange } from '../services/dashboard.service';
import { MdOpenInNew } from 'react-icons/md';
import { ProgressStatus } from 'src/shared/types/progress';
import { DownloadSize } from 'src/shared/types/downloadSize';
import { AppSettings } from 'src/shared/types/appSettings';
import { shell } from 'electron';

interface ICourseTableRowProps {
    course: CourseList;
    status: ProgressStatus | undefined;
    downloadSize: DownloadSize[];
    appSettings: AppSettings;
    setCourses: React.Dispatch<React.SetStateAction<CourseList[]>>;
}

function CourseTableRow({ course, status, downloadSize, appSettings, setCourses }: ICourseTableRowProps) {
    const downloadSizeItem = downloadSize.find((item) => item.refId === course.refId);
    const sizeInBytes = downloadSizeItem ? downloadSizeItem.size : -1;

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
                <Form.Check type="switch" checked={course.download} onChange={(e) => handleCheckboxChange(course.refId, e.target.checked, setCourses)} />
                {sizeInBytes !== -1 ? (
                    `(${(sizeInBytes / 1024 / 1024).toFixed(2)} MB)`
                ) : (
                    <Spinner animation="border" size="sm" role="status" style={{ marginLeft: '5px' }} />
                )}
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

export { CourseTableRow };
