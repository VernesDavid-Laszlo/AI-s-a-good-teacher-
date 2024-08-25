import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db } from '../firebase-config';
import Header from '../components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/Profile.css';

const storage = getStorage();

function Profile() {
    const [profilePicture, setProfilePicture] = useState('/profile-user.png');
    const [userData, setUserData] = useState(null);
    const user = auth.currentUser;

    const fetchUserData = async () => {
        if (user) {
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const data = userDoc.data();
                setUserData(data);
                if (data.profilePicture) {
                    setProfilePicture(data.profilePicture);
                }
            } else {
                console.log('No user data found!');
            }
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [user]);

    const getRoleLabel = (role) => {
        switch (role) {
            case 0:
                return 'Admin';
            case 1:
                return 'Teacher';
            case 2:
                return 'Student';
            default:
                return 'Unknown';
        }
    };

    const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0];
        if (file && user) {
            console.log('File selected:', file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result);
            };
            reader.readAsDataURL(file);

            try {

                const storageRef = ref(storage, `profilePictures/${user.uid}`);
                const uploadResult = await uploadBytes(storageRef, file);
                console.log('File uploaded to storage:', uploadResult);

                const photoURL = await getDownloadURL(storageRef);
                console.log('Download URL:', photoURL);

                const userRef = doc(db, 'users', user.uid);
                await setDoc(userRef, { profilePicture: photoURL }, { merge: true });
                console.log('Profile picture updated in Firestore');

                setProfilePicture(photoURL);
            } catch (error) {
                console.error('Error uploading profile picture:', error);
            }
        }
    };

    return (
        <div className="profile-page">
            <Header />
            <main className="container my-5">
                <div className="row">
                    <div className="col-md-4">
                        <div className="profile-container">
                            <div className="profile-picture">
                                <img src={profilePicture} alt="Profile" className="profile-img" />
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="profilePictureInput"
                                onChange={handleProfilePictureChange}
                            />
                            <label
                                htmlFor="profilePictureInput"
                                className="btn btn-primary w-100 mb-3">
                                Edit profile picture
                            </label>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="content-container">
                            {userData && (
                                <>
                                    <p className="title-container">Welcome to your profile!</p>
                                    <p>Username: {userData.username}</p>
                                    <p>Role: {getRoleLabel(userData.role)}</p>
                                    <p>Email: {user?.email}</p>
                                </>
                            )}
                        </div>
                        <div className="d-flex justify-content-end mt-3">
                            <button className="btn btn-primary">Edit profile</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Profile;
