import { db } from '../firebase-config';
import { collection, doc, setDoc } from 'firebase/firestore';
import searchingChapters from '../data/searchingChapters.json';

const uploadSearchAlgorithms = async () => {
    try {

        const coursesCollectionRef = collection(db, 'courses');
        const searchingAlgorithmsDocRef = doc(coursesCollectionRef, 'searchingAlgorithms');


        const chaptersCollectionRef = collection(searchingAlgorithmsDocRef, 'chapters');


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
