import React, { useState, useEffect, useCallback } from 'react';
import { auth, db } from '../firebase-config';
import { doc, collection, getDoc, getDocs } from 'firebase/firestore';
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Modal from 'react-modal';
import 'prismjs/themes/prism-tomorrow.css';
import '../styles/custom-prism.css';
import '../styles/IndividualCourses.css';
import PdfPreview from "./PdfPreview.jsx";
import UploadLessons from "./UploadLessons.jsx";

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
    InterpolationSearchAnimation: React.lazy(() => import('./animations/SearchingAlgorithms/InterpolationSearchAnimation.jsx')),
    BinarySearchPractice: React.lazy(() => import('./animations/practice/BinarySearchPractice.jsx')),
    BinarySearchTreePractice: React.lazy(() => import('./animations/practice/BinarySearchTreePractice.jsx')),
    FibonacciSearchPractice: React.lazy(() => import('./animations/practice/FibonacciSearchPractice.jsx')),
    InterpolationSearchPractice: React.lazy(() => import('./animations/practice/InterpolationSearchPractice.jsx')),
    LinearSearchPractice: React.lazy(() => import('./animations/practice/LinearSearchPractice.jsx')),
    BubbleSortPractice: React.lazy(() => import('./animations/practice/BubbleSortPractice.jsx')),
    SelectionSortPractice: React.lazy(() => import('./animations/practice/SelectionSortPractice.jsx'))
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
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [user] = useAuthState(auth);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchUserRole = async () => {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setUserRole(userSnap.data().role);
                }
            }
        };

        fetchUserRole();
    }, [user]);

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
                    practices: doc.data().practices || [],
                    description: doc.data().description || '',
                }));

                setChapters(fetchedChapters);

                const initialExpandedSections = fetchedChapters.reduce((acc, chapter) => {
                    acc[chapter.id] = { lessons: false, animations: false, practices : false , tests: false };
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
        import('prismjs').then((Prism) => {
            import('prismjs/components/prism-core');
            import('prismjs/components/prism-clike');
            import('prismjs/components/prism-cpp').then(() => {
                Prism.highlightAll();
            });
        });
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

    const openUploadLessonModal = () => {
        setIsUploadModalOpen(true);
    };

    const closeUploadLessonModal = () => {
        setIsUploadModalOpen(false);
    };



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
                                                    <div className="lesson-header">
                                                        <h4 className="lesson-title">{lesson.title}</h4>
                                                        {(userRole === 1 || userRole === 0) && lesson.title !== "Implementation" && (
                                                            <svg
                                                                className="upload-icon"
                                                                onClick={openUploadLessonModal}
                                                                width="24"
                                                                height="24"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    d="M5 20h14a2 2 0 002-2v-4h-2v4H5v-4H3v4a2 2 0 002 2zm7-14.586l3.293 3.293 1.414-1.414L12 2.586 7.293 7.293l1.414 1.414L11 5.414V16h2V5.414z"
                                                                    fill="currentColor"
                                                                />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    {lesson.content.includes('https://') && (
                                                        <PdfPreview
                                                            pdfUrl={lesson.content}
                                                            fileName={lesson.preztitle}
                                                            openPdfModal={openPdfModal}
                                                        />
                                                    )}
                                                    {lesson.title === "Implementation" && lesson.content && (
                                                        <div className="code-container">
                                                            <pre className="line-numbers">
                                                                <code className="language-cpp">
                                                                    {lesson.content.replace(/\\n/g, '\n').replace(/\\"/g, '"')}
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
                                    <div className="section-header" onClick={() => toggleSection(chapter.id, 'practices')}>
                                        <h3>Practice</h3>
                                    </div>
                                    {expandedSections[chapter.id]?.practices && (
                                        <div className="section-content">
                                            {chapter.practices?.map((practice, index) => {
                                                const PracticeComponent = animationComponents[practice.implement];
                                                return (
                                                    <div key={index}>
                                                        <h4>{practice.title}</h4>
                                                        {PracticeComponent && (
                                                            <React.Suspense fallback={<div>Loading practice...</div>}>
                                                                <PracticeComponent />
                                                            </React.Suspense>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                <div className="section-container">
                                    <div className="section-header" onClick={() => toggleSection(chapter.id, 'tests')}>
                                        <h3>Tests</h3>
                                    </div>
                                    {expandedSections[chapter.id]?.tests && (
                                        <div className="section-content">
                                            {chapter.tests.map((test, index) => (
                                                <div key={index}>
                                                    <h4>{test.title}</h4>
                                                    <p>Test questions available.</p>
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
                        <button onClick={closePdfModal} className="close-button">✖</button>
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
                    <Modal
                        isOpen={isUploadModalOpen}
                        onRequestClose={closeUploadLessonModal}
                        contentLabel="Upload Lesson"
                        className="upload-modal"
                        overlayClassName="upload-overlay"
                    >
                        <button onClick={closeUploadLessonModal} className="close-button">✖</button>
                        <UploadLessons />
                    </Modal>

                </main>
            </div>
        </div>
    );
};

export default IndividualCourses;
