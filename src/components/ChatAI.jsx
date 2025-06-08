import { useState, useEffect } from 'react';
import '../styles/ChatAI.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaTimes } from 'react-icons/fa';
import { FaChevronLeft } from 'react-icons/fa';

function ChatAI({ onToggle }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [headerHeight, setHeaderHeight] = useState(80); // alapértelmezett 80px

    useEffect(() => {
        const headerElement = document.querySelector('.header');
        if (headerElement) {
            setHeaderHeight(headerElement.offsetHeight);
        }
    }, []);

    const toggleChat = (open) => {
        setIsOpen(open);
        if (onToggle) {
            onToggle(open); // értesítjük a TestPage-et hogy nyitva van-e a chat
        }
    };

    const handleSend = () => {
        if (inputValue.trim() === '') return;
        setMessages([...messages, { sender: 'user', text: inputValue }]);
        setInputValue('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="chat-ai-wrapper">
            {!isOpen && (
                <div
                    className="chat-toggle-button"
                    onClick={() => toggleChat(true)}
                >
                    <FaChevronLeft className="toggle-icon" />
                    <span className="toggle-text">ASK the AI</span>
                </div>
            )}

            {isOpen && (
                <div
                    className="chat-ai-container"
                    style={{
                        top: `${headerHeight}px`,
                        height: `calc(100vh - ${headerHeight}px)`
                    }}
                >
                    <div className="chat-ai-header d-flex justify-content-between align-items-center p-2">
                        <strong>Chat with AI</strong>
                        <FaTimes className="close-icon" onClick={() => toggleChat(false)} />
                    </div>

                    <div className="chat-ai-messages p-3">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`chat-message ${msg.sender === 'user' ? 'sender' : 'receiver'}`}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    <div className="chat-ai-input p-2 d-flex">
                        <input
                            type="text"
                            className="form-control me-2"
                            placeholder="Type your message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button className="btn btn-primary" onClick={handleSend}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatAI;
