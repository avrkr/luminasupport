import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Shield, Clock, CheckCircle, XCircle, Power } from 'lucide-react';

const AgentStatus = () => {
    const { user } = useAuth();
    const [status, setStatus] = useState(user.status || 'available');
    const [stats, setStats] = useState({ totalChats: 0, avgDuration: '0m', avgRating: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get('/api/agents/stats', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setStats(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, [user.token]);

    const updateStatus = async (newStatus) => {
        try {
            await axios.put('/api/agents/status', { status: newStatus }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setStatus(newStatus);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h2 className="text-3xl font-bold font-display">My Status</h2>
                <p className="text-slate-400">Manage your availability for new support requests</p>
            </div>

            <div className="glass-card p-8 rounded-3xl space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${status === 'available' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                            <Power size={32} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Current Status</p>
                            <h3 className="text-2xl font-bold capitalize">{status}</h3>
                        </div>
                    </div>

                    <div className="flex bg-white/5 p-1 rounded-xl">
                        <button
                            onClick={() => updateStatus('available')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${status === 'available' ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' : 'text-slate-400 hover:text-white'}`}
                        >
                            Available
                        </button>
                        <button
                            onClick={() => updateStatus('busy')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${status === 'busy' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-400 hover:text-white'}`}
                        >
                            Busy
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <StatCard label="Total Chats" value={stats.totalChats} icon={<CheckCircle size={16} />} />
                    <StatCard label="Avg. Duration" value={stats.avgDuration} icon={<Clock size={16} />} />
                    <StatCard label="Rating" value={stats.avgRating} icon={<Shield size={16} />} />
                </div>

                <div className="pt-6 border-t border-white/10">
                    <h4 className="font-bold mb-4">Account Permissions</h4>
                    <div className="flex flex-wrap gap-2">
                        {user.permissions?.map(p => (
                            <span key={p} className="px-3 py-1 bg-primary-500/10 text-primary-400 rounded-full text-xs font-bold capitalize">
                                {p} Enabled
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon }) => (
    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
        <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase">{label}</span>
            {icon}
        </div>
        <p className="text-xl font-bold">{value}</p>
    </div>
);

export default AgentStatus;
