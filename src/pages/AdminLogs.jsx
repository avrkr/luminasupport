import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Phone, Clock, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLogs = () => {
    const { user } = useAuth();
    const [logs, setLogs] = useState({ chats: [], calls: [] });
    const [loading, setLoading] = useState(true);
    const [selectedChat, setSelectedChat] = useState(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const { data } = await axios.get('/api/admin/logs', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setLogs(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchLogs();
    }, [user.token]);

    if (loading) return <div className="p-8 text-center text-slate-400">Loading audit logs...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold font-display">System Audit Logs</h2>
                <p className="text-slate-400">History of all chat interactions and voice/video calls</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chat Logs */}
                <div className="glass-card rounded-3xl overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <MessageSquare className="text-primary-400" />
                            <h3 className="font-bold">Chat History</h3>
                        </div>
                        <span className="text-xs bg-primary-500/10 text-primary-400 px-2 py-1 rounded-md">{logs.chats.length} Sessions</span>
                    </div>
                    <div className="overflow-y-auto max-h-[600px] divide-y divide-white/5">
                        {logs.chats.map(chat => (
                            <div
                                key={chat._id}
                                className="p-4 hover:bg-white/5 transition-all cursor-pointer group"
                                onClick={() => setSelectedChat(chat)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold group-hover:bg-primary-500/20 group-hover:text-primary-400 transition-colors">
                                            {chat.agentId?.name?.[0] || 'AI'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Customer #{chat.sessionId.slice(0, 8)}</p>
                                            <p className="text-[10px] text-slate-500">Agent: {chat.agentId?.name || 'Automated AI'}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${chat.status === 'closed' ? 'bg-slate-500/10 text-slate-400' : 'bg-green-500/10 text-green-400'
                                        }`}>
                                        {chat.status}
                                    </span>
                                </div>
                                <div className="flex items-center text-[10px] text-slate-500 space-x-4">
                                    <span className="flex items-center"><Clock size={10} className="mr-1" /> {new Date(chat.createdAt).toLocaleString()}</span>
                                    <span>{chat.messages.length} messages</span>
                                    {chat.rating && (
                                        <span className="text-amber-400 font-bold">★ {chat.rating}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call Logs */}
                <div className="glass-card rounded-3xl overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Phone className="text-purple-400" />
                            <h3 className="font-bold">Call History</h3>
                        </div>
                        <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-1 rounded-md">{logs.calls.length} Calls</span>
                    </div>
                    <div className="overflow-y-auto max-h-[600px] divide-y divide-white/5">
                        {logs.calls.length === 0 ? (
                            <div className="p-10 text-center text-slate-500 italic text-sm">No call records found</div>
                        ) : (
                            logs.calls.map(call => (
                                <div key={call._id} className="p-4 hover:bg-white/5 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-xs text-purple-400">
                                                {call.type === 'video' ? <Clock size={14} /> : <Phone size={14} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium capitalize">{call.type} Call Session</p>
                                                <p className="text-[10px] text-slate-500">Duration: {call.duration || '0'}s</p>
                                            </div>
                                        </div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${call.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                            }`}>
                                            {call.status}
                                        </span>
                                    </div>
                                    <div className="text-[10px] text-slate-500">
                                        <Clock size={10} className="inline mr-1" /> {new Date(call.startTime).toLocaleString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Transcript Modal */}
            <AnimatePresence>
                {selectedChat && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedChat(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-2xl max-h-[80vh] bg-[#0f172a] border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <div>
                                    <h3 className="text-xl font-bold">Chat Transcript</h3>
                                    <p className="text-xs text-slate-400">Session: {selectedChat.sessionId}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedChat(null)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {selectedChat.messages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${msg.sender === 'customer'
                                                ? 'bg-white/10 text-white rounded-tl-none'
                                                : msg.sender === 'ai'
                                                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/20 rounded-tr-none italic'
                                                    : 'bg-primary-600 text-white rounded-tr-none'
                                            }`}>
                                            <div className="text-[10px] opacity-50 mb-1 uppercase font-bold">{msg.sender}</div>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 border-t border-white/10 bg-white/2 text-[10px] text-slate-500 flex justify-between">
                                <span>Started: {new Date(selectedChat.createdAt).toLocaleString()}</span>
                                {selectedChat.closedAt && (
                                    <span>Closed: {new Date(selectedChat.closedAt).toLocaleString()}</span>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminLogs;
