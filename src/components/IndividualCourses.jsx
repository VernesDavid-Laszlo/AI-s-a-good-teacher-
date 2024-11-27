import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useParams } from 'react-router-dom';
import { db } from '../firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import '../styles/IndividualCourses.css';
import BubbleSortAnimation from "./animations/BubbleSortAnimation.jsx";

function IndividualCourses() {
    const { id } = useParams();
    const [courseName, setCourseName] = useState('');
    const randomArray = [64, 34, 25, 12, 22, 11, 90, 9, 76];

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const courseDoc = doc(db, 'courses', id);
                const courseSnapshot = await getDoc(courseDoc);

                if (courseSnapshot.exists()) {
                    setCourseName(courseSnapshot.data().coursename);
                } else {
                    console.log("No such course!");
                }
            } catch (error) {
                console.error("Error fetching course:", error);
            }
        };

        fetchCourse();
    }, [id]);

    return (
        <div className="indCourses-page">
            <div className="indCourses-background">
                <Header />
                <main className="courses-container">
                    <h1 className="text-center">Welcome to {courseName} course</h1>
                    <div className="custom-container">
                        <p>Bubble Sort</p>
                        <BubbleSortAnimation array={randomArray} />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default IndividualCourses;
