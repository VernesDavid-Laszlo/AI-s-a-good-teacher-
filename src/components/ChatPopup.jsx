import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { auth, db } from '../firebase-config';
import { collection, query, where, getDocs, orderBy, onSnapshot } from 'firebase/firestore';
import { sendMessage } from '../utils/MessageService';
import '../styles/ChatPopup.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const ChatPopup = ({ currentCourseId, overrideRecipientId = null, mode = "question" }) => {
    const [isOpen, setIsOpen] = useState(mode === "multifunctional");
    const [message, setMessage] = useState('');
    const [teacherId, setTeacherId] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [status, setStatus] = useState('');
    const chatEndRef = useRef(null);
    const { id: routeCourseId } = useParams();

    const courseId = currentCourseId || routeCourseId;
    const recipientId = overrideRecipientId || teacherId;

    useEffect(() => {
        const fetchTeacher = async () => {
            if (!courseId || overrideRecipientId) return;
            const q = query(collection(db, "users"), where("course", "==", courseId));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                setTeacherId(snapshot.docs[0].id);
            }
        };
        fetchTeacher();
    }, [courseId, overrideRecipientId]);

    useEffect(() => {
        if (!recipientId || !auth.currentUser) return;

        const q = query(
            collection(db, "messages"),
            where("sender", "in", [auth.currentUser.uid, recipientId]),
            where("recipient", "in", [auth.currentUser.uid, recipientId]),
            orderBy("timestamp", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setChatMessages(msgs);
        });

        return () => unsubscribe();
    }, [recipientId]);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages]);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSend = async () => {
        const user = auth.currentUser;
        if (message.trim() && recipientId && user) {
            try {
                await sendMessage(user.uid, recipientId, message);
                setMessage('');
                setStatus('');
            } catch (err) {
                console.error("Send failed", err);
                setStatus('Send failed.');
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {mode === "question" && !isOpen && (
                <div className="CP-toggle-button" onClick={toggleChat}>Chat➤</div>
            )}

            {isOpen && (
                <div className="CP-popup">
                    <div className="CP-header">
                        <span>Send message</span>
                        <button className="CP-close-btn" onClick={toggleChat}>✖</button>
                    </div>
                    <div className="CP-body">
                        <div className="CP-messages">
                            {chatMessages.map(msg => (
                                <div key={msg.id} className={`CP-message ${msg.sender === auth.currentUser?.uid ? 'CP-sent' : 'CP-received'}`}>
                                    {msg.text}
                                </div>
                            ))}
                            <div ref={chatEndRef}></div>
                        </div>
                        <textarea
                            rows="3"
                            className="CP-input"
                            placeholder="Write a message..."
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />
                        <button className="CP-send-button" onClick={handleSend}>Send</button>
                        {status && <div className="CP-status">{status}</div>}
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatPopup;