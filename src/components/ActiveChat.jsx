import { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, UserMinus, UserCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import WebRTCModule from './WebRTCModule';

const ActiveChat = ({ chat, agentSocket }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState(chat.messages || []);
    const [input, setInput] = useState('');
    const [isCalling, setIsCalling] = useState(false);
    const [callType, setCallType] = useState(null);
    const messagesEndRef = useRef();

    useEffect(() => {
        setMessages(chat.messages);
        agentSocket.emit('join_chat', { sessionId: chat.sessionId });

        agentSocket.on('new_customer_message', (data) => {
            if (data.sessionId === chat.sessionId) {
                setMessages(prev => [...prev, { sender: 'customer', content: data.message }]);
            }
        });

        return () => {
            agentSocket.off('new_customer_message');
        };
    }, [chat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessage = { sender: 'agent', content: input };
        setMessages(prev => [...prev, newMessage]);
        agentSocket.emit('agent_message', { sessionId: chat.sessionId, message: input });
        setInput('');
    };

    const startCall = (type) => {
        setCallType(type);
        setIsCalling(true);
    };

    const closeChat = () => {
        if (window.confirm('Are you sure you want to close this chat? Sessions stats will be updated.')) {
            agentSocket.emit('close_chat', { sessionId: chat.sessionId });
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                        <User className="text-primary-400" />
                    </div>
                    <div>
                        <h3 className="font-bold">Customer #{chat.sessionId.slice(0, 8)}</h3>
                        <p className="text-xs text-slate-400">Viewing transcript since arrival</p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => startCall('voice')}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 transition-colors"
                    >
                        <Phone size={20} />
                    </button>
                    <button
                        onClick={() => startCall('video')}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 transition-colors"
                    >
                        <Video size={20} />
                    </button>
                    <button
                        onClick={closeChat}
                        className="p-3 bg-white/5 hover:bg-red-400/20 rounded-xl text-red-400 transition-colors"
                    >
                        <UserMinus size={20} />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-4 rounded-2xl text-sm ${msg.sender === 'agent'
                            ? 'bg-primary-600 text-white rounded-tr-none'
                            : msg.sender === 'ai'
                                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/20 rounded-tl-none italic'
                                : 'bg-white/10 text-white rounded-tl-none'
                            }`}>
                            <div className="text-[10px] opacity-50 mb-1 uppercase font-bold">
                                {msg.sender}
                            </div>
                            {msg.content}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Call Overlay */}
            {isCalling && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center">
                    <WebRTCModule
                        chatId={chat._id}
                        type={callType}
                        socket={agentSocket}
                        onClose={() => setIsCalling(false)}
                    />
                </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-6 bg-white/5 border-t border-white/10">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-5 py-4 pr-16 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                        placeholder="Type your reply..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button type="submit" className="absolute right-3 p-3 bg-primary-600 rounded-xl text-white hover:bg-primary-700 transition-all">
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ActiveChat;
