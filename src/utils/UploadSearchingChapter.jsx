import { db } from '../firebase-config'; // A te Firebase config fájlod
import { collection, doc, setDoc } from 'firebase/firestore';
import searchingChapters from '../data/searchingChapters.json';

const uploadSearchAlgorithms = async () => {
    try {
        // Létrehozod a "courses" collection-t
        const coursesCollectionRef = collection(db, 'courses');
        const searchingAlgorithmsDocRef = doc(coursesCollectionRef, 'searchingAlgorithms');

        // Létrehozod a "chapters" subcollection-t
        const chaptersCollectionRef = collection(searchingAlgorithmsDocRef, 'chapters');

        // Feltöltöd az algoritmusokat
        for (const chapter of searchingChapters) {
            const chapterDocRef = doc(chaptersCollectionRef, chapter.id);
            await setDoc(chapterDocRef, {
                chapterName: chapter.chapterName,
                lessons: chapter.lessons,
                animations: chapter.animations,
                tests: chapter.tests
            });
        }

        console.log('Search algorithms chapters successfully uploaded!');
    } catch (error) {
        console.error('Error uploading search algorithms chapters:', error);
    }
};

export default uploadSearchAlgorithms;
