import { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';

function Dashboard() {
    const [courses, setCourses] = useState([]);
    // const settings = window.api.settings.getAppSettings();
    
    function getCouses() {
        // window.api.mainPage.login(url, username, password).then((data) => {
        //     setCourses(data);
        // });
    }

    useEffect(() => {
        getCouses();
    }, []);

    return (
        <div className='p-3'>
            <Button variant="primary" onClick={getCouses}>Get Courses</Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Ref ID</th>
                        <th>Course Name</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course, index) => (
                        <tr key={index}>
                            <td>{course[0]}</td>
                            <td>{course[1]}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default Dashboard;