// TeacherDashboard.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase-config';
import { useAuthState } from 'react-firebase-hooks/auth';
import Header from '../components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Teacher.css';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function TeacherDashboard() {
    const [user] = useAuthState(auth);
    const [assignedCourse, setAssignedCourse] = useState('');
    const [studentData, setStudentData] = useState([]);
    const [expandedUser, setExpandedUser] = useState(null);
    const [showStats, setShowStats] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeacherInfo = async () => {
            if (!user) return;
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setAssignedCourse(data.course);
            }
        };
        fetchTeacherInfo();
    }, [user]);

    useEffect(() => {
        const fetchStudentTests = async () => {
            if (!assignedCourse) return;

            const usersSnap = await getDocs(collection(db, 'users'));
            const students = [];

            for (const userDoc of usersSnap.docs) {
                const uData = userDoc.data();
                if (uData.role === 2) {
                    const testsSnap = await getDocs(collection(db, 'users', userDoc.id, 'tests'));
                    const tests = testsSnap.docs
                        .map(t => ({ ...t.data(), id: t.id }))
                        .filter(t => t.courseId === assignedCourse);

                    if (tests.length > 0) {
                        students.push({
                            username: uData.username || uData.email,
                            tests,
                        });
                    }
                }
            }
            setStudentData(students);
            setLoading(false);
        };
        fetchStudentTests();
    }, [assignedCourse]);

    const generateStatistics = () => {
        const allTests = studentData.flatMap(s => s.tests);
        const totalScores = allTests.map(t => t.totalScore);
        const avgScore = (totalScores.reduce((a, b) => a + b, 0) / totalScores.length).toFixed(1);

        const aiUsedCount = allTests.flatMap(t => t.questions).filter(q => q.aiHelpUsed).length;
        const totalQuestions = allTests.reduce((acc, t) => acc + t.questions.length, 0);

        const errorCounts = {};
        allTests.forEach(t => {
            t.questions.forEach(q => {
                if (q.correctAnswerIndex !== q.selectedAnswerIndex) {
                    errorCounts[q.questionText] = (errorCounts[q.questionText] || 0) + 1;
                }
            });
        });

        const sortedErrors = Object.entries(errorCounts).sort((a, b) => b[1] - a[1]);

        return (
            <div className="mt-5">
                <h4>Statisztikák</h4>
                <p>Átlagos pontszám: {avgScore}</p>
                <p>AI segítség használata: {aiUsedCount} / {totalQuestions} ({((aiUsedCount / totalQuestions) * 100).toFixed(1)}%)</p>

                <div className="my-4">
                    <Bar
                        data={{
                            labels: sortedErrors.map(e => e[0]),
                            datasets: [
                                {
                                    label: 'Hibás válaszok száma kérdésenként',
                                    data: sortedErrors.map(e => e[1]),
                                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                },
                            ],
                        }}
                        options={{
                            plugins: {
                                title: { display: true, text: 'Leggyakrabban elrontott kérdések' },
                            },
                            responsive: true,
                            indexAxis: 'y',
                        }}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="teacher-page">
            <div className="teacher-background">
                <Header />
                <div className="container mt-5">
                    <h1 className="mb-4">Tanári Dashboard ({assignedCourse})</h1>
                    {loading ? <p>Betöltés...</p> : (
                        <>
                            <div className="list-group">
                                {studentData.map((student, idx) => (
                                    <div key={idx} className="mb-3">
                                        <button
                                            className="btn btn-outline-dark w-100 text-start"
                                            onClick={() => setExpandedUser(expandedUser === idx ? null : idx)}
                                        >
                                            {student.username}
                                        </button>
                                        {expandedUser === idx && (
                                            <div className="mt-2">
                                                {student.tests.map((test, i) => (
                                                    <div key={i} className="card mt-3">
                                                        <div className="card-body">
                                                            <h5>{test.title} – {test.grade} ({test.totalScore} pont)</h5>
                                                            <table className="table table-sm mt-2">
                                                                <thead>
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>Kérdés</th>
                                                                    <th>Válasz</th>
                                                                    <th>Helyes</th>
                                                                    <th>Pont</th>
                                                                    <th>AI</th>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                {test.questions.map((q, qi) => (
                                                                    <tr key={qi}>
                                                                        <td>{qi + 1}</td>
                                                                        <td>{q.questionText}</td>
                                                                        <td>{q.answers?.[q.selectedAnswerIndex]}</td>
                                                                        <td>{q.answers?.[q.correctAnswerIndex]}</td>
                                                                        <td>{q.scoreGiven}</td>
                                                                        <td>{q.aiHelpUsed ? '✔️' : '—'}</td>
                                                                    </tr>
                                                                ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button className="btn btn-primary mt-4" onClick={() => setShowStats(!showStats)}>
                                {showStats ? 'Statisztikák elrejtése' : 'Statisztikák megjelenítése'}
                            </button>
                            {showStats && generateStatistics()}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TeacherDashboard;
