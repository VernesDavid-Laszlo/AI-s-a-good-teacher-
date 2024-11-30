import { db } from '../firebase-config'; // A te Firebase config fájlod
import { collection, doc, setDoc } from 'firebase/firestore';
import sortingChapters from '../data/sortingChapters.json'; // Az általad létrehozott JSON fájl

const uploadSortingChapters = async () => {
    try {
        // Létrehozod a "courses" collection-t
        const coursesCollectionRef = collection(db, 'courses');
        const sortingAlgorithmsDocRef = doc(coursesCollectionRef, 'sortingAlgorithms');

        // Létrehozod a "chapters" subcollection-t
        const chaptersCollectionRef = collection(sortingAlgorithmsDocRef, 'chapters');

        // Feltöltöd az algoritmusokat
        for (const chapter of sortingChapters) {
            const chapterDocRef = doc(chaptersCollectionRef, chapter.id);
            await setDoc(chapterDocRef, {
                chapterName: chapter.chapterName,
                lessons: chapter.lessons,
                animations: chapter.animations,
                tests: chapter.tests
            });
        }

        console.log('Chapters successfully uploaded!');
    } catch (error) {
        console.error('Error uploading chapters:', error);
    }
};

export default uploadSortingChapters;
