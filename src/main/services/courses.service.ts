import Store from 'electron-store';
import { CourseList } from '../../shared/types/courseList';

const store = new Store();

function getCoursesList(): CourseList[] {
    return store.get('courseList', {}) as CourseList[];
}

function setCoursesList(courseList: CourseList[]): void {
    store.set('courseList', courseList);
}

export { getCoursesList, setCoursesList };
