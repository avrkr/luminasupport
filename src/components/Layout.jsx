import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Users, Settings, MessageSquare, Phone } from 'lucide-react';

const Layout = ({ children, role }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-[#0f172a] text-white">
            {/* Sidebar */}
            <aside className="w-64 glass-card border-r border-white/10 m-4 rounded-2xl flex flex-col">
                <div className="p-6 flex items-center space-x-3">
                    <img src="/logo.png" alt="LuminaSupport Logo" className="w-8 h-8 rounded-lg" />
                    <h1 className="text-xl font-bold gradient-text">LuminaSupport</h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {role === 'admin' ? (
                        <>
                            <NavItem icon={<LayoutDashboard />} label="Dashboard" onClick={() => navigate('/admin')} />
                            <NavItem icon={<Users />} label="Agents" onClick={() => navigate('/admin/agents')} />
                            <NavItem icon={<MessageSquare />} label="Logs" onClick={() => navigate('/admin/logs')} />
                            <NavItem icon={<Settings />} label="Settings" onClick={() => navigate('/admin/settings')} />
                        </>
                    ) : (
                        <>
                            <NavItem icon={<MessageSquare />} label="Chats" onClick={() => navigate('/agent')} />
                            <NavItem icon={<Phone />} label="Calls" onClick={() => navigate('/agent/calls')} />
                            <NavItem icon={<Settings />} label="Status" onClick={() => navigate('/agent/status')} />
                        </>
                    )}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center font-bold">
                            {user?.name?.[0] || '?'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{user?.name}</p>
                            <p className="text-xs text-slate-400 truncate">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full p-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-8">
                {children}
            </main>
        </div>
    );
};

const NavItem = ({ icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-white/5 transition-colors text-slate-300 hover:text-white"
    >
        {icon}
        <span className="font-medium">{label}</span>
    </button>
);

export default Layout;
