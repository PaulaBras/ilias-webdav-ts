import Header from './components/header.component';
import { Route, Routes } from 'react-router-dom';
import SettingsPage from './pages/settings.page';
import Dashboard from './pages/dashboard.page';
import { BrowserRouter as Router } from 'react-router-dom';
import AboutPage from './pages/about.page';

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/about" element={<AboutPage />} />
            </Routes>
        </Router>
    );
}

export default App;