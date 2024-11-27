import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase-config';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Courses from "./components/Courses";
import Dashboard from "./components/Dashboard";
import Notifications from "./components/Notifications";
import Profile from "./components/Profile";
import IndividualCourses from "./components/IndividualCourses.jsx";

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={user ? <Navigate replace to="/home" /> : <Navigate replace to="/login" />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={user ? <Navigate replace to="/home" /> : <Login />} />
                <Route path="/home" element={user ? <Home /> : <Navigate replace to="/login" />} />
                <Route path="/courses" element={user ? <Courses /> : <Navigate replace to="/login" />} />
                <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate replace to="/login" />} />
                <Route path="/notifications" element={user ? <Notifications /> : <Navigate replace to="/login" />} />
                <Route path="/profile" element={user ? <Profile /> : <Navigate replace to="/login" />} />
                <Route path="/course/:id" element={user ? <IndividualCourses /> : <Navigate replace to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
