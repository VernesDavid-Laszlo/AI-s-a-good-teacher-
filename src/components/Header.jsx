import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase-config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faBell, faHome, faBook, faTachometerAlt, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/Header.css';

function Header({ user }) {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    return (
        <header className="app-header" style={{ backgroundColor: '#6200ea' }}>
            <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#6200ea' }}>
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/home" style={{ marginLeft: '70px', color: 'white' }}>LOGO</Link>
                    <div className="collapse navbar-collapse justify-content-center">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/home" style={{ color: 'white' }}>
                                    <FontAwesomeIcon icon={faHome} className="me-2" />
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/courses" style={{ color: 'white' }}>
                                    <FontAwesomeIcon icon={faBook} className="me-2" />
                                    Courses
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/dashboard" style={{ color: 'white' }}>
                                    <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
                                    Dashboard
                                </Link>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="notificationsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: 'white' }}>
                                    <FontAwesomeIcon icon={faBell} className="me-2" />
                                    Notifications
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="d-flex align-items-center ms-5 profile-username-container" style={{ marginRight: '70px'}}>
                        <div className="dropdown">
                            <a
                                className="d-flex align-items-center text-white text-decoration-none"
                                href="#"
                                id="profileDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded={dropdownOpen}
                                onClick={toggleDropdown}
                            >
                                <FontAwesomeIcon icon={faUserCircle} size="2x" className="me-2" style={{ color: 'white' }} />
                                <span className="navbar-text me-3" style={{ color: 'white' }}>
                                    {user.username}
                                </span>
                            </a>
                            <ul className={`dropdown-menu${dropdownOpen ? ' show' : ''}`}
                                aria-labelledby="profileDropdown">
                                <li><Link className="dropdown-item" to="/profile"><FontAwesomeIcon icon={faUser}
                                                                                                   className="me-2"/> Profile</Link>
                                </li>
                                <li><a className="dropdown-item" href="#" onClick={handleLogout}><FontAwesomeIcon
                                    icon={faSignOutAlt} className="me-2"/> Logout</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;
