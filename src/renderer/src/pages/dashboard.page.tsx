import { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';

function Dashboard() {
    const [courses, setCourses] = useState([]);

    const getCourses = async () => {
        const url = 'your-url-here';

        const result = await window.api.mainPageController.getData();
        setCourses(result);
    };

    useEffect(() => {
        getCourses();
    }, []);

    return (
        <div className='p-3'>
            <Button onClick={getCourses}>Get Courses</Button>
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