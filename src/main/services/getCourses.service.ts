import Store from 'electron-store';

const store = new Store();

function getCourses(): string {
    return store.get('appCourses', {}) as string;
}

export { getCourses };