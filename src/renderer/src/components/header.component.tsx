import { Navbar, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function Header() {

    return (
        <>
            <ToastContainer />
            <Navbar bg="dark" variant="dark" className="mb-5">
                <Container>
                    <Navbar.Brand as={Link} to="/">Home</Navbar.Brand>
                    <Navbar.Brand as={Link} to="/settings">Settings</Navbar.Brand>
                    <Navbar.Brand as={Link} to="/about">About</Navbar.Brand>
                </Container>
            </Navbar>
        </>
    );
}

export default Header;