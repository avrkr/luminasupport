import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, User, Bot, Phone, Video, PhoneIncoming } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import WebRTCModule from './WebRTCModule';

const CustomerWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [sessionId] = useState(uuidv4());
    const [messages, setMessages] = useState([
        { sender: 'ai', content: 'Hello! I am Lumina AI. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isEscalated, setIsEscalated] = useState(false);
    const [incomingCall, setIncomingCall] = useState(null);
    const [isCalling, setIsCalling] = useState(false);
    const [callType, setCallType] = useState(null);
    const socketRef = useRef();
    const chatEndRef = useRef();

    useEffect(() => {
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        socketRef.current = io(`${backendUrl}/customers`);

        socketRef.current.on('ai_response', (data) => {
            setMessages(prev => [...prev, { sender: 'ai', content: data.content }]);
        });

        socketRef.current.on('agent_message', (data) => {
            setMessages(prev => [...prev, { sender: 'agent', content: data.content }]);
        });

        socketRef.current.on('escalation_status', (data) => {
            if (data.status === 'connected') {
                setIsEscalated(true);
                setAgentName(data.agent.name);
                setMessages(prev => [...prev, { sender: 'system', content: `${data.agent.name} has joined the chat.` }]);
            } else if (data.status === 'no_agents_available') {
                setMessages(prev => [...prev, { sender: 'system', content: 'Sorry, no live agents are currently available. AI will continue to assist you.' }]);
            }
        });

        socketRef.current.on('incoming_call', (data) => {
            setIncomingCall(data);
        });

        socketRef.current.on('webrtc_offer', (data) => {
            // This will be handled by WebRTCModule
        });

        return () => socketRef.current.disconnect();
    }, []);

    const acceptCall = () => {
        setIsCalling(true);
        setCallType(incomingCall.type);
        socketRef.current.emit('call_accepted', { to: incomingCall.from, sessionId });
        setIncomingCall(null);
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessage = { sender: 'customer', content: input };
        setMessages(prev => [...prev, newMessage]);
        socketRef.current.emit('new_chat', { sessionId, message: input });
        setInput('');
    };

    const handleEscalate = () => {
        socketRef.current.emit('escalate_to_human', { sessionId });
        setMessages(prev => [...prev, { sender: 'system', content: 'Requesting a live agent...' }]);
    };

    return (
        <>
            {/* Toggle Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-tr from-primary-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white z-50 animate-float"
                >
                    <MessageSquare size={30} />
                </motion.button>
            )}

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="fixed bottom-24 right-6 w-[400px] h-[600px] glass-card rounded-3xl overflow-hidden flex flex-col z-50 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 bg-gradient-to-r from-primary-600/20 to-purple-600/20 flex items-center justify-between border-b border-white/10">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full glass flex items-center justify-center p-1">
                                    <img src="/logo.png" alt="Logo" className="w-full h-full rounded-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{isEscalated ? agentName : 'Lumina AI'}</h3>
                                    <p className="text-xs text-primary-400 flex items-center">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                        Online
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'customer'
                                        ? 'bg-primary-600 text-white rounded-tr-none'
                                        : msg.sender === 'system'
                                            ? 'bg-white/5 text-slate-400 text-xs text-center w-full rounded-none border-y border-white/5 italic'
                                            : 'bg-white/10 text-white rounded-tl-none'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Actions / Escalation */}
                        {!isEscalated && (
                            <div className="px-6 py-2">
                                <button
                                    onClick={handleEscalate}
                                    className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-primary-400 border border-primary-500/20 transition-all font-medium"
                                >
                                    Talk to a Human?
                                </button>
                            </div>
                        )}

                        {/* Input */}
                        <form onSubmit={handleSendMessage} className="p-6 bg-white/5 border-t border-white/10">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                    placeholder="Type your message..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                <button type="submit" className="absolute right-2 p-2 text-primary-400 hover:text-primary-300 transition-colors">
                                    <Send size={20} />
                                </button>
                            </div>
                        </form>

                        {/* Incoming Call Notification */}
                        {incomingCall && (
                            <div className="absolute top-20 left-6 right-6 p-4 glass-card bg-primary-600 rounded-2xl border border-white/20 shadow-2xl z-[60] flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-bounce">
                                        <PhoneIncoming size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white uppercase">Incoming {incomingCall.type} Call</p>
                                        <p className="text-[10px] text-white/70">Agent is calling you...</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={acceptCall} className="px-4 py-2 bg-green-500 text-white rounded-xl text-xs font-bold hover:bg-green-600 transition-all">
                                        Accept
                                    </button>
                                    <button onClick={() => setIncomingCall(null)} className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-all">
                                        Decline
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Call Overlay */}
                        {isCalling && (
                            <div className="absolute inset-0 z-[70] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
                                <WebRTCModule
                                    chatId={sessionId}
                                    type={callType}
                                    socket={socketRef.current}
                                    onClose={() => setIsCalling(false)}
                                />
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CustomerWidget;
