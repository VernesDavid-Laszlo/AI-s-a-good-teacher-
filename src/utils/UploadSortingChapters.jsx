import { db } from '../firebase-config';
import { collection, doc, setDoc } from 'firebase/firestore';
import sortingChapters from '../data/sortingChapters.json';

const uploadSortingChapters = async () => {
    try {

        const coursesCollectionRef = collection(db, 'courses');
        const sortingAlgorithmsDocRef = doc(coursesCollectionRef, 'sortingAlgorithms');


        const chaptersCollectionRef = collection(sortingAlgorithmsDocRef, 'chapters');


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
