import { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/Courses.css';

function Courses() {
    const [courses, setCourses] = useState([]);
    const totalBoxes = 4;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const coursesCollection = collection(db, 'courses');
                const courseSnapshot = await getDocs(coursesCollection);
                const courseList = courseSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().coursename }));
                console.log("Fetched course names:", courseList);
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
                        {Array.from({ length: totalBoxes }).map((_, index) => (
                            <div className="col" key={index}>
                                <div
                                    className="course-box"
                                    onClick={() => courses[index] && handleClick(courses[index].id)}
                                >
                                    <h3>{courses[index]?.name || ""}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Courses;
