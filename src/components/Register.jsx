import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase-config';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import '../styles/Login.css';

function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('2'); // Default role is '2' for student
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await sendEmailVerification(user);
            alert('Verification email sent. Please check your inbox.');
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                username: username,
                role: parseInt(role),
                approved: role === "1" ? false : true,
            });

            await signOut(auth);
            alert('Registration complete. If you registered as a teacher, wait for admin approval.');
            navigate('/login');
        } catch (error) {
            console.error("Error registering user", error);
            alert(error.message);
        }
    };

    const handleSignInClick = () => {
        navigate('/login');
    };

    return (
        <div className="login-container d-flex align-items-center justify-content-center">
            <div className="login-card card">
                <div className="card-body">
                    <h2 className="card-title text-center">Register</h2>
                    <form onSubmit={handleRegister}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" value={email}
                                   onChange={(e) => setEmail(e.target.value)} required/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input type="text" className="form-control" value={username}
                                   onChange={(e) => setUsername(e.target.value)} required/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input type="password" className="form-control" value={password}
                                   onChange={(e) => setPassword(e.target.value)} required/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Role</label>
                            <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)} required>
                                <option value="2">Student</option>
                                <option value="1">Teacher</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Submit</button>
                    </form>
                    <button className="btn btn-secondary w-100 mt-2" onClick={handleSignInClick}>Sign in</button>
                </div>
            </div>
        </div>
    );
}

export default Register;