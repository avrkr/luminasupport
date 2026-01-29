import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Trash2, Edit2, Shield, Phone, MessageSquare, Video } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [agents, setAgents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAgent, setNewAgent] = useState({ name: '', email: '', role: 'AGENT', permissions: ['chat'] });

    useEffect(() => {
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        try {
            const { data } = await axios.get('/api/admin/agents', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setAgents(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateAgent = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/admin/agents', newAgent, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setIsModalOpen(false);
            fetchAgents();
        } catch (err) {
            alert('Error creating agent');
        }
    };

    const deleteAgent = async (id) => {
        if (!confirm('Are you sure?')) return;
        await axios.delete(`/api/admin/agents/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        });
        fetchAgents();
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold font-display">User Management</h2>
                    <p className="text-slate-400">Manage agents, managers and their permissions</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary-500/20"
                >
                    <UserPlus size={20} />
                    <span className="font-bold">Add User</span>
                </button>
            </div>

            <div className="glass-card rounded-3xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Permissions</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {agents.map((agent) => (
                            <tr key={agent._id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-primary-400">
                                            {agent.name?.[0] || '?'}
                                        </div>
                                        <div>
                                            <div className="font-medium">{agent.name}</div>
                                            <div className="text-xs text-slate-400">{agent.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${agent.role === 'MANAGER' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
                                        }`}>
                                        {agent.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-2">
                                        {agent.permissions?.includes('chat') && <MessageSquare size={16} className="text-slate-400" title="Chat" />}
                                        {agent.permissions?.includes('voice') && <Phone size={16} className="text-slate-400" title="Voice" />}
                                        {agent.permissions?.includes('video') && <Video size={16} className="text-slate-400" title="Video" />}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className={`w-2 h-2 rounded-full mr-2 ${agent.isOnline ? 'bg-green-500' : 'bg-slate-500'}`}></div>
                                        <span className="text-sm text-slate-300">{agent.isOnline ? 'Online' : 'Offline'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-3 text-slate-400">
                                        <button className="hover:text-white"><Edit2 size={18} /></button>
                                        <button onClick={() => deleteAgent(agent._id)} className="hover:text-red-400"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Agent Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card p-10 rounded-3xl w-full max-w-xl shadow-2xl"
                    >
                        <h3 className="text-2xl font-bold mb-6">Create New Agent</h3>
                        <form onSubmit={handleCreateAgent} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm text-slate-400 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                        value={newAgent.name}
                                        onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm text-slate-400 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                        value={newAgent.email}
                                        onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Role</label>
                                    <select
                                        className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                        value={newAgent.role}
                                        onChange={(e) => setNewAgent({ ...newAgent, role: e.target.value })}
                                    >
                                        <option value="AGENT">Agent</option>
                                        <option value="MANAGER">Manager</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Permissions</label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {['chat', 'voice', 'video', 'transfer'].map(p => (
                                            <label key={p} className="flex items-center space-x-2 text-xs">
                                                <input
                                                    type="checkbox"
                                                    checked={newAgent.permissions.includes(p)}
                                                    onChange={(e) => {
                                                        const perms = e.target.checked
                                                            ? [...newAgent.permissions, p]
                                                            : newAgent.permissions.filter(x => x !== p);
                                                        setNewAgent({ ...newAgent, permissions: perms });
                                                    }}
                                                />
                                                <span className="capitalize">{p}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4 mt-8">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl hover:bg-white/5">Cancel</button>
                                <button type="submit" className="px-6 py-3 bg-primary-600 rounded-xl font-bold">Create Agent</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
