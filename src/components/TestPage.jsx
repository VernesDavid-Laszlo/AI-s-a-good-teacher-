import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import Header from '../components/Header';
import '../styles/TestPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChatAI from "../components/ChatAI";

function TestPage() {
    const { courseId, chapterId, testIndex } = useParams();
    const [test, setTest] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isChatOpen, setIsChatOpen] = useState(false); // ÚJ → Chat állapot

    useEffect(() => {
        const fetchTest = async () => {
            const chapterRef = doc(db, "courses", courseId, "chapters", chapterId);
            const chapterSnap = await getDoc(chapterRef);
            if (chapterSnap.exists()) {
                const chapterData = chapterSnap.data();
                const testsArray = chapterData.tests || [];
                setTest(testsArray[testIndex]);
            }
        };

        fetchTest();
    }, [courseId, chapterId, testIndex]);

    const handleCheckboxChange = (answerIndex) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: answerIndex
        }));
    };

    const handleNext = () => {
        setCurrentQuestionIndex(prev => prev + 1);
    };

    if (!test) {
        return (
            <div className="test-page">
                <div className="test-background">
                    <Header />
                    <p>Loading test...</p>
                </div>
            </div>
        );
    }

    const currentQuestion = test.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === test.questions.length - 1;

    return (
        <div className="test-page">
            <div className="test-background">
                <Header />
                <h1 className={`test-title text-center mt-4 ${isChatOpen ? 'shifted' : ''}`}>{test.title}</h1>


                <div className={`card test-card mt-4 ${isChatOpen ? 'shifted' : ''}`}>
                <div className="card-body">
                        <h5 className="card-title">Question {currentQuestionIndex + 1}:</h5>
                        <p className="card-text">{currentQuestion.questionText}</p>

                        <div className="form-group">
                            {currentQuestion.answers.map((answer, index) => (
                                <div className="form-check" key={index}>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id={`answer-${index}`}
                                        checked={selectedAnswers[currentQuestionIndex] === index}
                                        onChange={() => handleCheckboxChange(index)}
                                    />
                                    <label className="form-check-label" htmlFor={`answer-${index}`}>
                                        {answer}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 text-center">
                            {!isLastQuestion ? (
                                <button className="btn btn-primary" onClick={handleNext}>
                                    Next
                                </button>
                            ) : (
                                <button className="btn btn-success">
                                    Submit
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* ChatAI → átadjuk az onToggle callbacket */}
                <ChatAI onToggle={(open) => setIsChatOpen(open)} />
            </div>
        </div>
    );
}

export default TestPage;
