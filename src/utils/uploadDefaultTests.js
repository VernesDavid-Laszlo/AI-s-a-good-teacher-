// src/utils/uploadDefaultTests.js
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";

// FONTOS: helyes path → courses / courseId / chapters / chapterId
export const uploadTestsToChapter = async (courseId, chapterId, testsArray) => {
    try {
        const chapterRef = doc(db, "courses", courseId, "chapters", chapterId);
        await updateDoc(chapterRef, {
            tests: testsArray
        });
        console.log(`✅ Tests uploaded to chapter ${chapterId}`);
    } catch (error) {
        console.error("❌ Error uploading tests: ", error);
    }
};
