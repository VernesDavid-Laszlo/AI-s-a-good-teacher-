import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { auth, db } from '../firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import '../styles/Home.css'; // Import custom CSS
import ChatPopup from '../components/ChatPopup';

function Home() {
    const [userData, setUserData] = useState({ username: '', email: '' });
    const [isPopupOpen, setPopupOpen] = useState(false); // Popup állapot
    const navigate = useNavigate();

    const fetchUserData = async (user) => {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data();
        } else {
            console.log('No such document!');
            return null;
        }
    };

    useEffect(() => {
        const fetchAndSetUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                const data = await fetchUserData(user);
                if (data) {
                    setUserData({ username: data.username, email: user.email });
                }
            } else {
                navigate('/login');
            }
        };

        fetchAndSetUserData();
    }, []);

    const renderCardWithImage1 = () => (
        <div className="home-section row align-items-center">
            <div className="col-md-6 d-flex justify-content-center mb-4 mb-md-0">
                <div className="home-container">
                    <h1 className="welcome-text">Welcome to our educational platform</h1>
                    <p></p>
                    <p className="slogan-text">Where advanced AI meets expert instruction for interactive and innovative learning.</p>
                </div>
            </div>
            <div className="col-md-6 d-flex justify-content-center">
                <img src="/laptop.png" alt="AI" className="home-image" />
            </div>
        </div>
    );

    const renderCardWithImage2 = () => (
        <div className="home-section row align-items-center">
            <div className="col-md-6 d-flex justify-content-center">
                <img src="/teacher.png" alt="AI" className="home-image" />
            </div>
            <div className="col-md-6 d-flex justify-content-center mb-4 mb-md-0">
                <div className="home-container2">
                    <h1 className="welcome-text">Interactive learning</h1>
                    <p></p>
                    <p className="slogan-text">Learning with animations and practice opportunities, as well as feedback from teachers and AI.</p>
                </div>
            </div>
        </div>
    );

    const renderCardWithImage3 = () => (
        <div className="home-section row align-items-center">
            <div className="col-md-6 d-flex justify-content-center mb-4 mb-md-0">
                <div className="home-container">
                    <h1 className="welcome-text">Transparency</h1>
                    <p></p>
                    <p className="slogan-text">Easy to use and transparent to everyone</p>
                </div>
            </div>
            <div className="col-md-6 d-flex justify-content-center">
                <img src="/ai.png" alt="AI" className="home-image" />
            </div>
        </div>
    );

    const handleHelpIconClick = () => {
        setPopupOpen(true); // Popup megnyitása
    };

    const handleClosePopup = () => {
        setPopupOpen(false); // Popup bezárása
    };

    return (
        <div className="home-page">
            <div className="help-icon" onClick={handleHelpIconClick}>
                <i className="bi bi-question-circle-fill"></i>
            </div>
            <ChatPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
            <div className="home-background">
                <Header user={userData} />
                <div className="container-fluid">
                    {renderCardWithImage1()}
                    {renderCardWithImage2()}
                    {renderCardWithImage3()}
                </div>
            </div>
        </div>
    );
}

export default Home;
