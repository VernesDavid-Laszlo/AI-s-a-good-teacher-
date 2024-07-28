import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase-config';
import Register from './components/Register';
import Login from './components/Login.jsx';
import Home from './components/Home';
import './styles/style.css';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={user ? <Navigate replace to="/home" /> : <Navigate replace to="/login" />} />
                <Route path="/register" element={user ? <Navigate replace to="/home" /> : <Register />} />
                <Route path="/login" element={user ? <Navigate replace to="/home" /> : <Login />} />
                <Route path="/home" element={user ? <Home user={user} /> : <Navigate replace to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
