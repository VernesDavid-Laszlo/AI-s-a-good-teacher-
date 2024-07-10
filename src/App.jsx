import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login.jsx';
import './styles/style.css'

function App() {
    return (
        <Router>
            <div className="container mt-5">
                <nav className="mb-4">
                    <Link to="/register" className="btn btn-primary mx-1">Register</Link>
                    <Link to="/login" className="btn btn-secondary mx-1">Login</Link>
                </nav>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
