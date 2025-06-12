import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase-config';
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import Header from '../components/Header';
import '../styles/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Dashboard() {
    const [user] = useAuthState(auth);
    const [testsByCourse, setTestsByCourse] = useState({});
    const [courseTitles, setCourseTitles] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserTests = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            const testsRef = collection(db, "users", user.uid, "tests");
            const testsSnap = await getDocs(testsRef);

            const grouped = {};

            testsSnap.docs.forEach(docSnap => {
                const data = docSnap.data();
                const { courseId } = data;

                if (!grouped[courseId]) {
                    grouped[courseId] = [];
                }
                grouped[courseId].push(data);
            });

            setTestsByCourse(grouped);

            // Lekérjük a kurzus címeket is
            const courseTitlesTemp = {};
            for (const courseId of Object.keys(grouped)) {
                const courseRef = doc(db, "courses", courseId);
                const courseSnap = await getDoc(courseRef);
                if (courseSnap.exists()) {
                    courseTitlesTemp[courseId] = courseSnap.data().coursename || "Unnamed Course";
                } else {
                    courseTitlesTemp[courseId] = "Unknown Course";
                }
            }

            setCourseTitles(courseTitlesTemp);
            setLoading(false);
        };

        fetchUserTests();
    }, [user]);

    const renderContent = () => {
        if (loading) {
            return <p>Loading your progress...</p>;
        }

        const hasTests = Object.keys(testsByCourse).length > 0;

        if (!hasTests) {
            return <p className="text-center mt-5">You have no test results yet. Start learning to see your progress here!</p>;
        }

        return (
            <div className="d-flex flex-column align-items-center mt-4">
                {Object.keys(testsByCourse).map(courseId => {
                    const completedCount = testsByCourse[courseId].length;
                    const totalTests = 10; // 10 teszt per kurzus
                    const progressPercent = Math.min((completedCount / totalTests) * 100, 100).toFixed(0);

                    return (
                        <div
                            key={courseId}
                            className="card shadow mb-4 dashboard-card"
                        >
                            <div className="card-body">
                                <h4 className="card-title text-center mb-3">{courseTitles[courseId]}</h4>
                                <div className="progress mb-2" style={{ height: '25px' }}>
                                    <div
                                        className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                                        role="progressbar"
                                        style={{ width: `${progressPercent}%` }}
                                        aria-valuenow={progressPercent}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    >
                                        {progressPercent}%
                                    </div>
                                </div>
                                <p className="text-center mt-2">
                                    {completedCount} of {totalTests} tests completed
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const displayName = user?.displayName || user?.email || "User";

    return (
        <div className="dash-page">
            <div className="dash-background">
                <Header />
                <h1 className="text-center mt-4">{displayName}'s Dashboard</h1>
                <div className="container px-5">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
