// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase-config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import Header from '../components/Header';
import '../styles/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Dashboard() {
    const [user] = useAuthState(auth);
    const [displayName, setDisplayName] = useState('User');
    const [testsByCourse, setTestsByCourse] = useState({});
    const [courseTitles, setCourseTitles] = useState({});
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [expandedTest, setExpandedTest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchUserProfile = async () => {
                const userRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setDisplayName(data.username || user.displayName || user.email || 'User');
                } else {
                    setDisplayName(user.displayName || user.email || 'User');
                }
            };
            fetchUserProfile();
        }
        const fetchTests = async () => {
            if (!user) return setLoading(false);

            const testsRef = collection(db, 'users', user.uid, 'tests');
            const testsSnap = await getDocs(testsRef);
            const grouped = {};
            const courseNameMap = {};

            for (let docSnap of testsSnap.docs) {
                const data = docSnap.data();
                const { chapterId, courseId } = data;

                if (!grouped[courseId]) grouped[courseId] = {};
                if (!grouped[courseId][chapterId]) grouped[courseId][chapterId] = [];
                grouped[courseId][chapterId].push({ id: docSnap.id, ...data });

                if (!courseNameMap[courseId]) {
                    const courseRef = doc(db, 'courses', courseId);
                    const courseSnap = await getDoc(courseRef);
                    courseNameMap[courseId] = courseSnap.exists() ? courseSnap.data().coursename : 'Unknown Course';
                }
            }

            setTestsByCourse(grouped);
            setCourseTitles(courseNameMap);
            setLoading(false);
        };
        fetchTests();
    }, [user]);

    const renderFilters = () => (
        <div className="mb-4 d-flex justify-content-center gap-3">
            <select className="form-select w-auto" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
                <option value="all">All Courses</option>
                {Object.entries(courseTitles).map(([id, name]) => (
                    <option key={id} value={id}>{name}</option>
                ))}
            </select>
        </div>
    );

    const renderCourseSection = (courseId, chapters) => {
        const totalTests = Object.values(chapters).reduce((acc, tests) => acc + tests.length, 0);
        const progressPercent = Math.min((totalTests / 10) * 100, 100).toFixed(0);

        return (
            <div key={courseId} className="card mb-5 big-course-card">
                <div className="card-body">
                    <h3 className="card-title mb-4">{courseTitles[courseId]}</h3>
                    <div className="progress mb-4" style={{ height: '30px' }}>
                        <div className="progress-bar progress-bar-striped progress-bar-animated bg-success" style={{ width: `${progressPercent}%` }}>
                            {progressPercent}%
                        </div>
                    </div>

                    {Object.entries(chapters).map(([chapterId, tests]) => {
                        const avgScore = (tests.reduce((sum, t) => sum + t.totalScore, 0) / tests.length).toFixed(1);
                        const chapterProgress = Math.min((tests.length / 2) * 100, 100).toFixed(0);

                        return (
                            <div key={chapterId} className="card shadow mb-4 dashboard-card px-3">
                                <div className="card-body">
                                    <h4 className="card-title mb-3">{chapterId} (Avg Score: {avgScore})</h4>

                                    <div className="progress mb-3" style={{ height: '25px' }}>
                                        <div className="progress-bar progress-bar-striped progress-bar-animated bg-primary" style={{ width: `${chapterProgress}%` }}>
                                            {chapterProgress}%
                                        </div>
                                    </div>

                                    <table className="table table-bordered table-hover">
                                        <thead>
                                        <tr className="table-secondary">
                                            <th>Quiz Title</th>
                                            <th>Grade</th>
                                            <th>Total Score</th>
                                            <th>Details</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {tests.map(test => (
                                            <React.Fragment key={test.id}>
                                                <tr>
                                                    <td>{test.title}</td>
                                                    <td>{test.grade}</td>
                                                    <td>{test.totalScore}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => setExpandedTest(expandedTest === test.id ? null : test.id)}
                                                        >
                                                            {expandedTest === test.id ? 'Hide' : 'Show'}
                                                        </button>
                                                    </td>
                                                </tr>
                                                {expandedTest === test.id && (
                                                    <tr>
                                                        <td colSpan="4">
                                                            <div className="bg-light p-3 rounded">
                                                                <h6 className="text-muted mb-3">Question Details</h6>
                                                                {test.questions.map((q, idx) => (
                                                                    <div key={idx} className="mb-3">
                                                                        <strong>Q{idx + 1}: </strong> {q.questionText}
                                                                        <div className="ps-3">
                                                                            <div className="text-primary">Your Answer: {q.answers?.[q.selectedAnswerIndex] ?? `Option ${q.selectedAnswerIndex}`}</div>
                                                                            <div className="text-success">Correct Answer: {q.answers?.[q.correctAnswerIndex] ?? `Option ${q.correctAnswerIndex}`}</div>
                                                                            <div>Score: {q.scoreGiven}</div>
                                                                            <div className="text-muted">AI Help Used: {q.aiHelpUsed ? 'Yes' : 'No'}</div>
                                                                        </div>
                                                                        <hr />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderTests = () => {
        if (loading) return <p>Loading your progress...</p>;
        if (Object.keys(testsByCourse).length === 0) return <p className="text-center mt-5">No test results yet.</p>;

        return Object.entries(testsByCourse).map(([courseId, chapters]) => {
            if (selectedCourse !== 'all' && selectedCourse !== courseId) return null;
            return renderCourseSection(courseId, chapters);
        });
    };

    return (
        <div className="dash-page">
            <div className="dash-background">
                <Header />
                <h1 className="text-center mt-4">{displayName}'s Dashboard</h1>
                <div className="container mt-4">
                    {renderFilters()}
                    {renderTests()}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
