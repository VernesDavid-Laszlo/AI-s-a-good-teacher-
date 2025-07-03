import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBoeJbYlowFcKRj31hjxkcPXARFRTvSYV8",
    authDomain: "webproj-48dfd.firebaseapp.com",
    projectId: "webproj-48dfd",
    storageBucket: "webproj-48dfd.appspot.com",
    messagingSenderId: "313706168556",
    appId: "1:313706168556:web:e198783e57f807bf1c25c9",
    measurementId: "G-XR8TPNLQWW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


export { auth, db, storage };