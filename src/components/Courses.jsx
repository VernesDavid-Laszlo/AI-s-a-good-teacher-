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

                const coursesCollection = collection(db, 'courses');
                const courseSnapshot = await getDocs(coursesCollection);


                const courseList = courseSnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data()?.coursename || 'Unnamed Course',
                }));

                setCourses(courseList);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        fetchCourses();
    }, []);

    const handleClick = (id) => {
        navigate(`/course/${id}`);
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
                            <p>Loading courses...</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Courses;
