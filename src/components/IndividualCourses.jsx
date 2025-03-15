import React, { useState, useEffect, useCallback } from 'react';
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
    SelectionSortAnimation: React.lazy(() => import('./animations/SortingAlgorithms/SelectionSortAnimation.jsx')),
    BinarySearchAnimation: React.lazy(() => import('./animations/SearchingAlgorithms/BinarySearchAnimation.jsx')),
    BinarySearchTreeAnimation: React.lazy(() => import('./animations/SearchingAlgorithms/BinarySearchTreeAnimation.jsx')),
    LinearSearchAnimation: React.lazy(() => import('./animations/SearchingAlgorithms/LinearSearchAnimation.jsx')),
    FibonacciSearchAnimation: React.lazy(() => import('./animations/SearchingAlgorithms/FibonacciSearchAnimation.jsx')),
    IntervalSearchAnimation: React.lazy(() => import('./animations/SearchingAlgorithms/IntervalSearchAnimation.jsx'))
};

const IndividualCourses = () => {
    const { id } = useParams();
    const [courseName, setCourseName] = useState('');
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedSections, setExpandedSections] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPdfUrl, setCurrentPdfUrl] = useState('');
    const [pdfLoading, setPdfLoading] = useState(false);

    useEffect(() => {
        Modal.setAppElement('#root');
    }, []);

    const fetchCourseData = useCallback(async () => {
        try {
            const courseRef = doc(db, 'courses', id);
            const courseSnapshot = await getDoc(courseRef);

            if (courseSnapshot.exists()) {
                setCourseName(courseSnapshot.data().coursename || 'Unnamed Course');
            } else {
                console.error(`No course found with ID: ${id}`);
                setLoading(false);
                return;
            }

            const chaptersRef = collection(courseRef, 'chapters');
            const chaptersSnapshot = await getDocs(chaptersRef);

            if (!chaptersSnapshot.empty) {
                const fetchedChapters = chaptersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    chapterName: doc.data().chapterName || 'Untitled Chapter',
                    lessons: doc.data().lessons || [],
                    animations: doc.data().animations || [],
                    tests: doc.data().tests || [],
                    description: doc.data().description || '',
                }));

                setChapters(fetchedChapters);

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
    }, [id]);

    useEffect(() => {
        fetchCourseData();
    }, [fetchCourseData]);

    useEffect(() => {
        import('prismjs').then((Prism) => Prism.highlightAll());
    }, [chapters]);

    // A PDF fájlok gyors letöltése (ha nem volt letöltve)
    const downloadPdfIfNeeded = async (url) => {
        // Ellenőrizzük, hogy a PDF már létezik-e a localStorage-ben
        if (!localStorage.getItem(url)) {
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                const reader = new FileReader();
                reader.onloadend = () => {
                    // Tároljuk a fájlt a localStorage-ben
                    localStorage.setItem(url, reader.result);
                };
                reader.readAsDataURL(blob);
            } catch (error) {
                console.error('Error downloading PDF:', error);
            }
        }
    };

    const openPdfModal = (url) => {
        setPdfLoading(true);
        // Letöltjük a PDF fájlt előre, ha szükséges
        downloadPdfIfNeeded(url);
        setCurrentPdfUrl(url);
        setIsModalOpen(true);
    };

    const closePdfModal = () => {
        setIsModalOpen(false);
        setCurrentPdfUrl('');
        setPdfLoading(false);
    };

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
                        chapters.map((chapter) => (
                            <div key={chapter.id}>
                                <h2>{chapter.chapterName}</h2>
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

                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={closePdfModal}
                        contentLabel="PDF Modal"
                        className="presentation-modal"
                        overlayClassName="presentation-overlay"
                    >
                        <button onClick={closePdfModal} className="close-button">X</button>
                        {pdfLoading && <div>Loading PDF...</div>}
                        <iframe
                            src={`https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(currentPdfUrl)}`}
                            width="100%"
                            height="500px"
                            style={{ border: "none" }}
                            title="PDF Viewer"
                            onLoad={() => setPdfLoading(false)}
                        ></iframe>
                    </Modal>
                </main>
            </div>
        </div>
    );
};

export default IndividualCourses;
