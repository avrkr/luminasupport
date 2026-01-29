import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import ActiveChat from '../components/ActiveChat';
import { MessageSquare, Phone, User, Clock } from 'lucide-react';

const AgentDashboard = () => {
    const { user } = useAuth();
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const socketRef = useRef();

    useEffect(() => {
        fetchChats();

        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        socketRef.current = io(`${backendUrl}/agents`, {
            auth: { userId: user._id }
        });

        socketRef.current.emit('agent_online', { agentId: user._id });

        socketRef.current.on('new_escalation', (data) => {
            fetchChats();
        });

        socketRef.current.on('chat_closed', (data) => {
            fetchChats();
            setSelectedChat(prev => prev?.sessionId === data.sessionId ? null : prev);
        });

        return () => {
            socketRef.current.emit('agent_offline', { agentId: user._id });
            socketRef.current.disconnect();
        };
    }, []);

    const fetchChats = async () => {
        try {
            const { data } = await axios.get('/api/agents/chats', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setChats(data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex h-full space-x-6">
            {/* Sidebar: Chat List */}
            <div className="w-80 flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Active Chats</h2>
                    <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded-md text-xs font-bold">LIVE</span>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                    {chats.length === 0 ? (
                        <div className="glass-card p-6 rounded-2xl text-center text-slate-500 text-sm italic">
                            No active chats
                        </div>
                    ) : (
                        chats.map(chat => (
                            <button
                                key={chat._id}
                                onClick={() => setSelectedChat(chat)}
                                className={`w-full text-left p-4 rounded-2xl transition-all ${selectedChat?._id === chat._id ? 'bg-primary-600 shadow-lg shadow-primary-500/20' : 'glass-card hover:bg-white/5'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold truncate">Customer #{chat.sessionId.slice(0, 8)}</span>
                                    <span className="text-[10px] opacity-60 flex items-center">
                                        <Clock size={10} className="mr-1" />
                                        {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-xs opacity-70 truncate">
                                    {chat.messages[chat.messages.length - 1]?.content}
                                </p>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 glass-card rounded-3xl overflow-hidden relative">
                {selectedChat ? (
                    <ActiveChat chat={selectedChat} agentSocket={socketRef.current} />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <MessageSquare size={40} />
                        </div>
                        <p>Select a chat to start responding</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgentDashboard;
