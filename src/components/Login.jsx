import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase-config';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import '../styles/Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/home');
        } catch (error) {
            console.error("Error logging in user", error);
            alert('Invalid email or password');
        }
    };

    const handleSignUpClick = () => {
        navigate('/register');
    };

    const handleForgotPasswordClick = async () => {
        if (!email) {
            alert('Please enter your email address first.');
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            alert('Password reset email sent. Check your inbox.');
        } catch (error) {
            console.error("Error sending password reset email", error);
            alert('Error sending password reset email. Please try again.');
        }
    };

    return (
        <div className="login-container d-flex align-items-center justify-content-center">
            <div className="login-card card">
                <div className="card-body">
                    <h2 className="card-title text-center">Login</h2>
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" value={email}
                                   onChange={(e) => setEmail(e.target.value)} required/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input type="password" className="form-control" value={password}
                                   onChange={(e) => setPassword(e.target.value)} required/>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Submit</button>
                    </form>
                    <p className="text-center mt-3">Don't have an account?</p>
                    <button className="btn btn-secondary w-100" onClick={handleSignUpClick}>Sign up</button>
                    <p className="text-center mt-3">
                        <span
                            className="forgot-password-link"
                            onClick={handleForgotPasswordClick}
                        >
                            Forgot password?
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
