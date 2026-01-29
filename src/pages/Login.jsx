import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(email, password);
            if (user.role === 'SUPER_ADMIN') navigate('/admin');
            else navigate('/agent');
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md glass-card p-10 rounded-3xl"
            >
                <div className="text-center mb-10">
                    <img src="/logo.png" alt="LuminaSupport" className="w-16 h-16 mx-auto mb-4 rounded-2xl shadow-xl shadow-primary-500/10" />
                    <h1 className="text-4xl font-bold gradient-text mb-2">Welcome Back</h1>
                    <p className="text-slate-400">Sign in to LuminaSupport</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-400/10 border border-red-400/20 text-red-400 p-4 rounded-xl text-sm">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                            placeholder="admin@lumina.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all active:scale-[0.98]"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-500 italic">
                    <p>Demo Admin: admin@lumina.com / admin123</p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
