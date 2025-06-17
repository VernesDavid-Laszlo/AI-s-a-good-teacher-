import { useEffect, useState } from 'react';
import { auth, db } from '../firebase-config';
import { getReceivedMessages } from '../utils/MessageService';
import '../styles/Notifications.css';
import Header from './Header';
import { doc, getDoc } from 'firebase/firestore';
import ChatPopup from './ChatPopup';

function Notifications() {
    const [messages, setMessages] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [latestMessages, setLatestMessages] = useState([]);

    useEffect(() => {
        const loadMessages = async () => {
            const user = auth.currentUser;
            if (!user) return;
            const msgs = await getReceivedMessages(user.uid);

            // Csoportosítás feladók szerint, és legfrissebb kiválasztása
            const uniqueBySender = {};
            for (const msg of msgs) {
                if (!uniqueBySender[msg.sender] || msg.timestamp?.toMillis() > uniqueBySender[msg.sender].timestamp?.toMillis()) {
                    uniqueBySender[msg.sender] = msg;
                }
            }

            // Felhasználónevek lekérése
            const enrichedMessages = await Promise.all(
                Object.values(uniqueBySender).map(async (msg) => {
                    const senderRef = doc(db, "users", msg.sender);
                    const senderSnap = await getDoc(senderRef);
                    return {
                        ...msg,
                        senderName: senderSnap.exists() ? senderSnap.data().username || "Unknown" : "Unknown"
                    };
                })
            );

            setLatestMessages(enrichedMessages);
        };

        loadMessages();
    }, []);

    const handleToggleChat = (senderId) => {
        setSelectedUserId((prev) => (prev === senderId ? null : senderId));
    };

    return (
        <div className="notifications-page">
            <div className="notifications-background">
                <Header />
                <h1>Notifications</h1>
                <ul className="list-group w-75">
                    {latestMessages.map(msg => (
                        <li
                            key={msg.id}
                            className="list-group-item"
                            onClick={() => handleToggleChat(msg.sender)}
                            style={{ cursor: 'pointer' }}
                        >
                            <strong>From:</strong> {msg.senderName}<br />
                            <strong>Message:</strong> {msg.text}<br />
                            <small>{msg.timestamp?.toDate().toLocaleString()}</small>
                        </li>
                    ))}
                </ul>

                {/* Popup a kiválasztott diákkal való beszélgetéshez */}
                {selectedUserId !== null && (
                    <ChatPopup
                        overrideRecipientId={selectedUserId}
                        mode="multifunctional"
                        key={`chat-${selectedUserId}-${Date.now()}`}
                    />
                )}
            </div>
        </div>
    );
}

export default Notifications;
