import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase-config';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Home.css';

function Home({ user }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    return (
        <div>
            <header className="app-header">
                <nav className="navbar navbar-expand-lg">
                    <div className="container-fluid">
                        <div className="collapse navbar-collapse justify-content-center">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/home">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile">Profile</Link>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn" onClick={handleLogout}>Logout</button>
                                </li>
                            </ul>
                        </div>
                        <div className="navbar-text text-white ms-auto">
                            {user.email}
                        </div>
                    </div>
                </nav>
            </header>
            <div className="content">
                {/* Your main content goes here */}
            </div>
        </div>
    );
}

export default Home;
