import { Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { IoMdSettings } from 'react-icons/io';
import { MdHelp, MdSpaceDashboard } from 'react-icons/md';

function Header() {
    return (
        <>
            <ToastContainer />
            <Navbar bg="dark" variant="dark" className="mb-5">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <MdSpaceDashboard /> Home
                    </Navbar.Brand>
                    <Navbar.Brand as={Link} to="/settings">
                        <IoMdSettings /> Settings
                    </Navbar.Brand>
                    <Navbar.Brand as={Link} to="/about">
                        <MdHelp /> About
                    </Navbar.Brand>
                </Container>
            </Navbar>
        </>
    );
}

export default Header;
