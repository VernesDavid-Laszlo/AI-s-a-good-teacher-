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
    const [loading, setLoading] = useState(false);

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

    const handleSend = async () => {
        if (inputValue.trim() === '') return;

        // Felhasználó üzenete hozzáadása
        const newMessages = [...messages, { sender: 'user', text: inputValue }];
        setMessages(newMessages);
        setInputValue('');
        setLoading(true);

        try {
            // API hívás az OpenAI GPT-3.5 turbo-hoz
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer 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"
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: "You are a helpful AI assistant who only answers questions about sorting and searching algorithms. Please do not assist with tests or grading." },
                        ...newMessages.map((msg) => ({
                            role: msg.sender === 'user' ? 'user' : 'assistant',
                            content: msg.text
                        }))
                    ]
                })
            });

            const data = await response.json();
            const reply = data.choices?.[0]?.message?.content;

            if (reply) {
                // AI válasz hozzáadása
                setMessages([...newMessages, { sender: 'ai', text: reply }]);
            }
        } catch (error) {
            console.error("API error:", error);
        } finally {
            setLoading(false);
        }
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
                        {loading && (
                            <div className="chat-message receiver">
                                answering...
                            </div>
                        )}
                    </div>

                    <div className="chat-ai-input p-2 d-flex">
                        <input
                            type="text"
                            className="form-control me-2"
                            placeholder="Type your message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                        />
                        <button className="btn btn-primary" onClick={handleSend} disabled={loading}>
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatAI;
