import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { doc, collection, getDoc, getDocs } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/IndividualCourses.css'

const animationComponents = {
    BubbleSortAnimation: React.lazy(() => import('./animations/SortingAlgorithms/BubbleSortAnimation.jsx')),
    MergeSortAnimation: React.lazy(() => import('./animations/SortingAlgorithms/MergeSortAnimation.jsx')),
    QuickSortAnimation: React.lazy(() => import('./animations/SortingAlgorithms/QuickSortAnimation.jsx')),
    InsertionSortAnimation: React.lazy(() => import('./animations/SortingAlgorithms/InsertionSortAnimation.jsx')),
    SelectionSortAnimation: React.lazy(() => import('./animations/SortingAlgorithms/SelectionSortAnimation.jsx'))
};

const IndividualCourses = () => {
    const { id } = useParams(); // Ez az aktuális kurzus ID-ja az URL-ből
    const [courseName, setCourseName] = useState('');
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedSections, setExpandedSections] = useState({
        lessons: false,
        animations: false,
        tests: false,
    });

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
                    }));

                    setChapters(fetchedChapters);
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

    const toggleSection = (section) => {
        setExpandedSections((prevState) => ({
            ...prevState,
            [section]: !prevState[section],
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
                                    <div className="section-header" onClick={() => toggleSection('lessons')}>
                                        <h3>Lessons</h3>
                                    </div>
                                    {expandedSections.lessons && (
                                        <div className="section-content">
                                            {chapter.lessons.map((lesson, index) => (
                                                <div key={index}>
                                                    <h4>{lesson.title}</h4>
                                                    <p>{lesson.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Animations Section */}
                                <div className="section-container">
                                    <div className="section-header" onClick={() => toggleSection('animations')}>
                                        <h3>Animations</h3>
                                    </div>
                                    {expandedSections.animations && (
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

                                {/* Tests Section */}
                                <div className="section-container">
                                    <div className="section-header" onClick={() => toggleSection('tests')}>
                                        <h3>Tests</h3>
                                    </div>
                                    {expandedSections.tests && (
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
                </main>
            </div>
        </div>
    );
};

export default IndividualCourses;
