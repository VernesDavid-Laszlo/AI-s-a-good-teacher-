import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { doc, collection, getDoc, getDocs } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Modal from 'react-modal';
import 'prismjs/themes/prism-tomorrow.css';
import '../styles/IndividualCourses.css';

const animationComponents = {
    BubbleSortAnimation: React.lazy(() => import('./animations/SortingAlgorithms/BubbleSortAnimation.jsx')),
    MergeSortAnimation: React.lazy(() => import('./animations/SortingAlgorithms/MergeSortAnimation.jsx')),
    QuickSortAnimation: React.lazy(() => import('./animations/SortingAlgorithms/QuickSortAnimation.jsx')),
    InsertionSortAnimation: React.lazy(() => import('./animations/SortingAlgorithms/InsertionSortAnimation.jsx')),
    SelectionSortAnimation: React.lazy(() => import('./animations/SortingAlgorithms/SelectionSortAnimation.jsx'))
};

const IndividualCourses = () => {
    const { id } = useParams(); // Az aktuális kurzus ID-ja az URL-ből
    const [courseName, setCourseName] = useState('');
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedSections, setExpandedSections] = useState({}); // Egyedi állapot minden fejezethez

    // Modal állapotok
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPdfUrl, setCurrentPdfUrl] = useState(''); // A PDF URL

    useEffect(() => {
        Modal.setAppElement('#root'); // Accessibility fix for React Modal
    }, []);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                // Kurzus adatainak lekérdezése
                const courseRef = doc(db, 'courses', id);
                const courseSnapshot = await getDoc(courseRef);

                if (courseSnapshot.exists()) {
                    setCourseName(courseSnapshot.data().coursename || 'Unnamed Course');
                } else {
                    console.error(`No course found with ID: ${id}`);
                    setLoading(false);
                    return;
                }

                // Chapters gyűjtemény lekérdezése
                const chaptersRef = collection(courseRef, 'chapters');
                const chaptersSnapshot = await getDocs(chaptersRef);

                if (!chaptersSnapshot.empty) {
                    const fetchedChapters = chaptersSnapshot.docs.map(doc => ({
                        id: doc.id,
                        chapterName: doc.data().chapterName || 'Untitled Chapter',
                        lessons: doc.data().lessons || [],
                        animations: doc.data().animations || [],
                        tests: doc.data().tests || [],
                        description: doc.data().description || '', // Leírás hozzáadása
                    }));

                    setChapters(fetchedChapters);

                    // Kezdeti állapotok az expandedSections objektumhoz
                    const initialExpandedSections = fetchedChapters.reduce((acc, chapter) => {
                        acc[chapter.id] = { lessons: false, animations: false, tests: false };
                        return acc;
                    }, {});
                    setExpandedSections(initialExpandedSections);
                } else {
                    console.error('No chapters found in this course.');
                }
            } catch (error) {
                console.error('Error fetching course data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [id]);

    useEffect(() => {
        // Prism.js újrainicializálása, hogy a kód kiemelés működjön
        import('prismjs').then((Prism) => Prism.highlightAll());
    }, [chapters]);

    // Modal megnyitása
    const openPdfModal = (url) => {
        setCurrentPdfUrl(url); // PDF URL beállítása
        setIsModalOpen(true);
    };

    // Modal bezárása
    const closePdfModal = () => {
        setIsModalOpen(false);
        setCurrentPdfUrl('');
    };

    // Section toggle
    const toggleSection = (chapterId, section) => {
        setExpandedSections((prevState) => ({
            ...prevState,
            [chapterId]: {
                ...prevState[chapterId],
                [section]: !prevState[chapterId][section],
            },
        }));
    };

    if (loading) {
        return <div>Loading course data...</div>;
    }

    return (
        <div className="indCourses-page">
            <div className="indCourses-background">
                <Header />
                <main className="courses-container">
                    <h1>{courseName}</h1>
                    {chapters.length > 0 ? (
                        chapters.map(chapter => (
                            <div key={chapter.id}>
                                <h2>{chapter.chapterName}</h2>

                                {/* Lessons Section */}
                                <div className="section-container">
                                    <div
                                        className="section-header"
                                        onClick={() => toggleSection(chapter.id, 'lessons')}
                                    >
                                        <h3>Lessons</h3>
                                    </div>
                                    {expandedSections[chapter.id]?.lessons && (
                                        <div className="section-content">
                                            {chapter.lessons.map((lesson, index) => (
                                                <div key={index} className="lesson-container">
                                                    <h4>{lesson.title}</h4>
                                                    {lesson.content.includes('https://') && (
                                                        <button
                                                            onClick={() => openPdfModal(lesson.content)}
                                                            className="open-presentation-button"
                                                        >
                                                            Open PDF
                                                        </button>
                                                    )}

                                                    {/* Az "Implementation" szöveg alatt a kód megjelenítése */}
                                                    {lesson.title === "Implementation" && lesson.content && (
                                                        <div className="code-container">
                                                            <pre className="line-numbers">
                                                                <code className="language-cpp">
                                                                    {lesson.content}
                                                                </code>
                                                            </pre>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Animations Section */}
                                <div className="section-container">
                                    <div
                                        className="section-header"
                                        onClick={() => toggleSection(chapter.id, 'animations')}
                                    >
                                        <h3>Animations</h3>
                                    </div>
                                    {expandedSections[chapter.id]?.animations && (
                                        <div className="section-content">
                                            {chapter.animations.map((animation, index) => {
                                                const AnimationComponent = animationComponents[animation.component];
                                                return (
                                                    <div key={index}>
                                                        <h4>{animation.title}</h4>
                                                        {chapter.description && (
                                                            <p className="animation-description">
                                                                {chapter.description}
                                                            </p>
                                                        )}
                                                        <React.Suspense fallback={<div>Loading animation...</div>}>
                                                            {AnimationComponent ? <AnimationComponent /> : <p>Animation not found</p>}
                                                        </React.Suspense>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Tests Section */}
                                <div className="section-container">
                                    <div
                                        className="section-header"
                                        onClick={() => toggleSection(chapter.id, 'tests')}
                                    >
                                        <h3>Tests</h3>
                                    </div>
                                    {expandedSections[chapter.id]?.tests && (
                                        <div className="section-content">
                                            {chapter.tests.map((test, index) => (
                                                <div key={index}>
                                                    <h4>{test.title}</h4>
                                                    <p>{test.questions.length} questions</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No chapters available for this course.</p>
                    )}

                    {/* Modal for PDF presentations */}
                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={closePdfModal}
                        contentLabel="PDF Modal"
                        className="presentation-modal"
                        overlayClassName="presentation-overlay"
                    >
                        <button onClick={closePdfModal} className="close-button">X</button>
                        <iframe
                            src={`https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(currentPdfUrl)}`}
                            width="100%"
                            height="500px"
                            style={{ border: "none" }}
                            title="PDF Viewer"
                        ></iframe>
                    </Modal>
                </main>
            </div>
        </div>
    );
};

export default IndividualCourses;
