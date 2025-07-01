import { collection, addDoc, getDocs, query, where, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '../firebase-config';


export const sendMessage = async (senderId, recipientId, text) => {
    return await addDoc(collection(db, "messages"), {
        sender: senderId,
        recipient: recipientId,
        text,
        timestamp: serverTimestamp()
    });
};


export const getReceivedMessages = async (userId) => {
    const q = query(
        collection(db, "messages"),
        where("recipient", "==", userId),
        orderBy("timestamp", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};