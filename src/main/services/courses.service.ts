import Store from 'electron-store';
import { CourseList } from '../../shared/types/courseList';

const store = new Store();

function getCoursesList(): CourseList[] {
    return store.get('courseList', {}) as CourseList[];
}

function setCoursesList(courseList: CourseList[]): void {
    store.set('courseList', courseList);
}

function setDownloadOption(refId: string, downloadBool: boolean): boolean {
    const courseList = getCoursesList();
    const courseIndex = courseList.findIndex((course) => course.refId === refId);
    if(courseIndex === -1) return false;
    courseList[courseIndex].download = downloadBool;
    store.set('courseList', courseList);
    return true;
}

export { getCoursesList, setCoursesList, setDownloadOption };
