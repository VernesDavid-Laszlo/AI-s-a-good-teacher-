import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase-config";
import Header from '../components/Header';
import '../styles/TestPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChatAI from "../components/ChatAI";
import { FaHeart } from 'react-icons/fa';
import { getAuth } from "firebase/auth";

function TestPage() {
    const { courseId, chapterId, testIndex } = useParams();
    const [test, setTest] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [questionAIHelpUsed, setQuestionAIHelpUsed] = useState({});
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [aiHelpCount, setAiHelpCount] = useState(0);

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

    const handleSubmit = async () => {
        if (!test) return;

        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
            alert("You must be logged in to submit the test.");
            return;
        }

        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            await setDoc(userDocRef, {
                createdAt: serverTimestamp(),
                role: 1
            });
        }

        const questionsData = test.questions.map((question, index) => {
            const selectedAnswerIndex = selectedAnswers[index] ?? -1;
            const isCorrect = selectedAnswerIndex === question.correctAnswerIndex;
            const aiUsed = questionAIHelpUsed[index] === true;

            return {
                questionText: question.questionText,
                selectedAnswerIndex,
                correctAnswerIndex: question.correctAnswerIndex,
                aiHelpUsed: aiUsed,
                attemptCount: 1,
                scoreGiven: isCorrect ? (aiUsed ? 0.5 : 1) : 0
            };
        });

        const totalScore = questionsData.reduce((sum, q) => sum + q.scoreGiven, 0);

        const gradePrompt = `Here is the test result:\n` +
            questionsData.map((q, idx) =>
                `Q${idx + 1}: "${q.questionText}"\nSelected: ${q.selectedAnswerIndex}, Correct: ${q.correctAnswerIndex}, AI used: ${q.aiHelpUsed}, Score: ${q.scoreGiven}\n`
            ).join('\n') +
            `\nTotal score: ${totalScore} out of ${questionsData.length}.\n` +
            `Please provide a grade for this test as one of the following categories: "Excellent", "Good", "Needs improvement", "Fail". Only return the grade.`;

        let grade = "Ungraded";

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer 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"
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: "You are an assistant grading tests. Respond with only one of these words: Excellent, Good, Needs improvement, Fail." },
                        { role: "user", content: gradePrompt }
                    ]
                })
            });

            const data = await response.json();
            const reply = data.choices?.[0]?.message?.content?.trim();
            if (reply) {
                grade = reply;
            }
        } catch (error) {
            console.error("AI grading error:", error);
        }

        try {
            await addDoc(collection(db, "users", user.uid, "tests"), {
                title: test.title,
                courseId,
                chapterId,
                testIndex: parseInt(testIndex),
                timestamp: serverTimestamp(),
                completed: true,
                aiHelpCount,
                totalScore,
                grade,
                questions: questionsData
            });

            alert(`Test submitted successfully! Grade: ${grade}`);
        } catch (error) {
            console.error("Firestore save error:", error);
            alert("Error saving test result.");
        }
    };


    const currentQuestion = test?.questions?.[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === (test?.questions?.length - 1);

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

    return (
        <div className="test-page">
            <div className="test-background">
                <Header />
                <h1 className={`test-title text-center mt-4 ${isChatOpen ? 'shifted' : ''}`}>{test.title}</h1>

                <div className={`card test-card mt-4 ${isChatOpen ? 'shifted' : ''}`}>
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="card-title mb-0">Question {currentQuestionIndex + 1}:</h5>
                            <div className="d-flex">
                                {[...Array(3 - aiHelpCount)].map((_, i) => (
                                    <FaHeart key={i} color="red" className="ms-1" />
                                ))}
                            </div>
                        </div>

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
                                <button className="btn btn-success" onClick={handleSubmit}>
                                    Submit
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <ChatAI
                    mode="test"
                    currentQuestionText={currentQuestion.questionText}
                    onToggle={(open) => setIsChatOpen(open)}
                    aiHelpCount={aiHelpCount}
                    onAIResponse={() => {
                        setAiHelpCount(prev => prev + 1);
                        setQuestionAIHelpUsed(prev => ({
                            ...prev,
                            [currentQuestionIndex]: true
                        }));
                    }}
                />
            </div>
        </div>
    );
}

export default TestPage;
