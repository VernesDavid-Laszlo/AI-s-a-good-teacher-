import { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/Courses.css';

function Courses() {
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // A 'courses' collection lekérése a Firebase-ból
                const coursesCollection = collection(db, 'courses');
                const courseSnapshot = await getDocs(coursesCollection);

                // Az összes kurzus adatainak lekérése és a lista frissítése
                const courseList = courseSnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data()?.coursename || 'Unnamed Course', // Biztonságos ellenőrzés
                }));

                // A kurzusok frissítése az állapotban
                setCourses(courseList);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        fetchCourses();
    }, []); // A hook csak egyszer fut le, amikor az oldal betöltődik

    const handleClick = (id) => {
        navigate(`/course/${id}`); // Navigálás a kiválasztott kurzus oldalára
    };

    return (
        <div className="courses-page">
            <div className="courses-background">
                <Header />
                <main className="courses-container container">
                    <div className="course-box-container">
                        {courses.length > 0 ? (
                            courses.map((course) => (
                                <div className="col" key={course.id}>
                                    <div
                                        className="course-box"
                                        onClick={() => handleClick(course.id)}
                                    >
                                        <h3>{course.name}</h3>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Loading courses...</p> // Ha nincsenek kurzusok, akkor ez jelenik meg
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Courses;
