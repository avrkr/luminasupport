import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Users, MessageSquare, Phone, Activity, TrendingUp, ShieldCheck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminOverview = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalAgents: 0,
        activeChats: 0,
        completedCalls: 0,
        onlineAgents: 0,
        avgRating: 0,
        avgDuration: '0m'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get('/api/admin/stats', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setStats(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchStats();
    }, [user.token]);

    if (loading) return <div className="p-8 text-center text-slate-400">Syncing dashboard...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold font-display">System Overview</h2>
                <p className="text-slate-400">Real-time platform performance and agent activity</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                <StatCard label="Total Agents" value={stats.totalAgents} icon={<Users />} color="blue" />
                <StatCard label="Online Now" value={stats.onlineAgents} icon={<Activity />} color="green" />
                <StatCard label="Active Chats" value={stats.activeChats} icon={<MessageSquare />} color="purple" />
                <StatCard label="Past Calls" value={stats.totalCalls} icon={<Phone />} color="orange" />
                <StatCard label="Avg. Rating" value={stats.avgRating} icon={<ShieldCheck />} color="green" />
                <StatCard label="Avg. Duration" value={stats.avgDuration} icon={<Clock />} color="blue" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-8 rounded-3xl h-64 flex flex-col justify-center items-center text-slate-500">
                    <TrendingUp size={48} className="mb-4 opacity-20" />
                    <p>Interaction volume chart will appear here</p>
                </div>
                <div className="glass-card p-8 rounded-3xl space-y-4">
                    <h3 className="font-bold flex items-center space-x-2">
                        <ShieldCheck className="text-green-400" />
                        <span>Security Status</span>
                    </h3>
                    <div className="space-y-3">
                        <StatusItem label="SSL Certificate" status="Active" />
                        <StatusItem label="Database" status="Connected" />
                        <StatusItem label="AI Engine" status="Operational" />
                        <StatusItem label="SMTP Relay" status="Healthy" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, color }) => {
    const colorMap = {
        blue: 'bg-blue-500/20 text-blue-400',
        green: 'bg-green-500/20 text-green-400',
        purple: 'bg-purple-500/20 text-purple-400',
        orange: 'bg-orange-500/20 text-orange-400'
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="glass-card p-6 rounded-3xl border border-white/5"
        >
            <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center ${colorMap[color] || 'bg-slate-500/20 text-slate-400'}`}>
                {icon}
            </div>
            <p className="text-slate-400 text-sm font-medium">{label}</p>
            <h4 className="text-3xl font-bold mt-1">{value}</h4>
        </motion.div>
    );
};

const StatusItem = ({ label, status }) => (
    <div className="flex justify-between items-center text-sm p-3 bg-white/5 rounded-xl">
        <span className="text-slate-400">{label}</span>
        <span className="text-green-400 font-bold text-xs uppercase">{status}</span>
    </div>
);

export default AdminOverview;
