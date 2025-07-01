// TeacherDashboard.jsx (translated to English)
import { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase-config';
import { useAuthState } from 'react-firebase-hooks/auth';
import Header from './Header';
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
    const [expandedTests, setExpandedTests] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sortMethod, setSortMethod] = useState('');
    const [showClassStats, setShowClassStats] = useState(false);
    const [showChart, setShowChart] = useState(false);

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
                        .filter(t => (t.courseId || '').toLowerCase() === assignedCourse.toLowerCase());
                    if (tests.length > 0) {
                        students.push({
                            id: userDoc.id,
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

    const sortedStudents = [...studentData].sort((a, b) => {
        const getAvg = s => s.tests.reduce((sum, t) => sum + (t.totalScore || 0), 0) / s.tests.length;
        switch (sortMethod) {
            case 'nameAsc': return a.username.localeCompare(b.username);
            case 'nameDesc': return b.username.localeCompare(a.username);
            case 'avgAsc': return getAvg(a) - getAvg(b);
            case 'avgDesc': return getAvg(b) - getAvg(a);
            case 'onlyPass': return b.tests.some(t => t.grade !== 'Fail') ? -1 : 1;
            default: return 0;
        }
    });

    const classStats = () => {
        const allTests = studentData.flatMap(s => s.tests);
        const avgPerStudent = studentData.map(s => {
            const total = s.tests.reduce((sum, t) => sum + (t.totalScore || 0), 0);
            return { name: s.username, avg: (total / s.tests.length).toFixed(2) };
        });

        const aiHelpUsagePerTest = {};
        allTests.forEach(t => {
            aiHelpUsagePerTest[t.title] = aiHelpUsagePerTest[t.title] || 0;
            t.questions?.forEach(q => {
                if (q.aiHelpUsed) aiHelpUsagePerTest[t.title]++;
            });
        });

        const aiHelpQuestions = {};
        allTests.forEach(t => {
            t.questions?.forEach(q => {
                if (q.aiHelpUsed) aiHelpQuestions[q.questionText] = (aiHelpQuestions[q.questionText] || 0) + 1;
            });
        });

        return (
            <div className="mt-5">
                <h4>Class Statistics</h4>
                <table className="table table-bordered">
                    <thead><tr><th>Student</th><th>Average</th></tr></thead>
                    <tbody>
                    {avgPerStudent.map((s, i) => (
                        <tr key={i}><td>{s.name}</td><td>{s.avg}</td></tr>
                    ))}
                    </tbody>
                </table>
                <button className="btn btn-secondary mt-3" onClick={() => setShowChart(!showChart)}>
                    {showChart ? 'Hide Charts' : 'Show Charts'}
                </button>
                {showChart && (
                    <div className="mt-4">
                        <Bar data={{
                            labels: Object.keys(aiHelpUsagePerTest),
                            datasets: [{
                                label: 'Number of AI helps per test',
                                data: Object.values(aiHelpUsagePerTest),
                            }]
                        }}/>
                        <Bar className="mt-5" data={{
                            labels: Object.keys(aiHelpQuestions),
                            datasets: [{
                                label: 'AI helps per question',
                                data: Object.values(aiHelpQuestions),
                            }]
                        }}/>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="teacher-page">
            <div className="teacher-background">
                <Header />
                <div className="container mt-5">
                    <h1 className="mb-4">Teacher Dashboard ({assignedCourse})</h1>
                    {loading ? <p>Loading...</p> : (
                        <>
                            <div className="mb-3">
                                <select onChange={e => setSortMethod(e.target.value)} className="form-select w-auto">
                                    <option value="">Choose sorting method</option>
                                    <option value="nameAsc">Name A-Z</option>
                                    <option value="nameDesc">Name Z-A</option>
                                    <option value="avgAsc">Average ascending</option>
                                    <option value="avgDesc">Average descending</option>
                                    <option value="onlyPass">Only passed</option>
                                </select>
                            </div>

                            {sortedStudents.map((s, i) => {
                                const avg = (s.tests.reduce((a, b) => a + (b.totalScore || 0), 0) / s.tests.length).toFixed(2);
                                return (
                                    <div key={i} className="mb-2">
                                        <button
                                            className="btn btn-outline-primary w-100 text-start"
                                            onClick={() => setExpandedUser(expandedUser === i ? null : i)}
                                        >
                                            {s.username} – AVG: {avg}
                                        </button>

                                        {expandedUser === i && (
                                            <div className="mt-2">
                                                <table className="table table-sm">
                                                    <thead><tr><th>Test</th><th>Score</th></tr></thead>
                                                    <tbody>
                                                    {s.tests.map((t, j) => (
                                                        <tr key={j}><td>{t.title}</td><td>{t.totalScore}</td></tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() => setExpandedTests(expandedTests === i ? null : i)}
                                                >
                                                    {expandedTests === i ? 'Hide test details' : 'Show test details'}
                                                </button>

                                                {expandedTests === i && (
                                                    <div className="mt-3">
                                                        {s.tests.map((t, k) => (
                                                            <div key={k} className="card mt-2">
                                                                <div className="card-body">
                                                                    <h5>{t.title} – {t.grade} ({t.totalScore} points)</h5>
                                                                    <table className="table table-sm">
                                                                        <thead><tr><th>#</th><th>Question</th><th>Selected</th><th>Correct</th><th>Score</th><th>AI</th></tr></thead>
                                                                        <tbody>
                                                                        {t.questions?.map((q, qIndex) => (
                                                                            <tr key={qIndex}>
                                                                                <td>{qIndex + 1}</td>
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
                                        )}
                                    </div>
                                );
                            })}

                            <hr className="my-5"/>
                            <button className="btn btn-info" onClick={() => setShowClassStats(!showClassStats)}>
                                {showClassStats ? 'Hide statistics' : 'View statistics'}
                            </button>
                            {showClassStats && classStats()}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TeacherDashboard;
