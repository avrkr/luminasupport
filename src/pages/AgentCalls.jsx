import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Phone, Video, Clock, User } from 'lucide-react';

const AgentCalls = () => {
    const { user } = useAuth();
    const [calls, setCalls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCalls = async () => {
            try {
                const { data } = await axios.get('/api/agents/calls', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setCalls(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchCalls();
    }, [user.token, user._id]);

    if (loading) return <div className="p-8 text-center text-slate-400">Loading call history...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold font-display">Call History</h2>
                <p className="text-slate-400">Review your past voice and video interactions</p>
            </div>

            <div className="glass-card rounded-3xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Session ID</th>
                            <th className="px-6 py-4">Duration</th>
                            <th className="px-6 py-4">Date & Time</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {calls.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-slate-500 italic">
                                    No call records found for your account
                                </td>
                            </tr>
                        ) : (
                            calls.map((call) => (
                                <tr key={call._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-400">
                                                {call.type === 'video' ? <Video size={16} /> : <Phone size={16} />}
                                            </div>
                                            <span className="capitalize font-medium">{call.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono opacity-60">
                                        {call._id.slice(-8)}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {call.duration || '0'}s
                                    </td>
                                    <td className="px-6 py-4 text-sm opacity-60">
                                        {new Date(call.startTime).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${call.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                            }`}>
                                            {call.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AgentCalls;
