// src/components/ChatPopup.js
import { useState } from 'react';
import '../styles/ChatPopup.css';

const ChatPopup = ({ isOpen, onClose }) => {
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState([]);

    const handleQuestionChange = (e) => {
        setQuestion(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const apiKey = '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'; // Itt add meg az API kulcsodat

        const newMessage = { type: 'user', text: question };
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inputs: question }),
        });

        const data = await response.json();
        if (response.ok) {
            const botMessage = { type: 'bot', text: data[0]?.generated_text || 'No response' };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } else {
            const errorMessage = { type: 'bot', text: 'Error fetching response' };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        }

        setQuestion('');
    };

    if (!isOpen) return null;

    return (
        <div className="chat-style">
            <div className="headerC">
                <h3>Ask the AI</h3>
                <button className="close-button" onClick={onClose}>&times;</button>
            </div>
            <div className="bodyC">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={message.type === 'user' ? 'sent-message' : 'received-message'}
                    >
                        {message.text}
                    </div>
                ))}
            </div>
            <div className="footerC">
                <input
                    type="text"
                    value={question}
                    onChange={handleQuestionChange}
                    placeholder="Type your question..."
                    className="input-field"
                    required
                />
                <button type="submit" onClick={handleSubmit} className="send-button">Send</button>
            </div>
        </div>
    );
};

export default ChatPopup;
