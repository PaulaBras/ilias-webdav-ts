import { CourseList } from 'src/shared/types/courseList';

function handleCheckboxChange(refId: string, checked: boolean, setCourses: React.Dispatch<React.SetStateAction<CourseList[]>>) {
    window.api.mainPage.downloadOption(refId, checked).then(() => {
        // Update the courses state
        setCourses((courses) =>
            courses.map((course) => {
                if (course.refId === refId) {
                    // This is the course we're interested in - return a new object with the updated download property
                    return { ...course, download: checked };
                } else {
                    // This is not the course we're interested in - return it unchanged
                    return course;
                }
            })
        );
    });
}

function getCoursesList(setCourses: React.Dispatch<React.SetStateAction<CourseList[]>>, setDownloadText: React.Dispatch<React.SetStateAction<string>>, checkSettings: boolean): void {
    if (!checkSettings) {
        return;
    }
    
    window.api.mainPage.login().then((data) => {
        if (data === 'Success' || data === 'Success but no courses found') {
            window.api.mainPage.getCourses().then((data) => {
                setCourses(data || []);
                
                if (data?.length > 0) {
                    window.api.mainPage.downloadSize(data);
                }
            }).catch(_ => {
                // Silent error handling
            });
            
            window.api.settings.getAppSettings().then((appSettings) => {
                window.api.mainPage.checkFolderContents(appSettings.rootFolder).then((data) => {
                    if (data === 'files in Folder') {
                        setDownloadText('Sync');
                    } else {
                        setDownloadText('Download');
                    }
                }).catch(_ => {
                    // Silent error handling
                });
            }).catch(_ => {
                // Silent error handling
            });
        }
    }).catch(_ => {
        // Silent error handling
    });
}

function downloadCourses(courses: CourseList[]) {
    window.api.mainPage.startDownload(courses);
}

export { handleCheckboxChange, getCoursesList, downloadCourses };
