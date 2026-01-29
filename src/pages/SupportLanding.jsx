import { motion } from 'framer-motion';
import { Shield, Sparkles, Zap, MessageCircle, PhoneCall, Bot, ArrowRight, CheckCircle2 } from 'lucide-react';
import CustomerWidget from '../components/CustomerWidget';
import { useNavigate } from 'react-router-dom';

const SupportLanding = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-primary-500/30">
            {/* Header / Nav */}
            <nav className="fixed top-0 w-full z-50 glass-header border-b border-white/5 px-6 py-4 flex justify-between items-center backdrop-blur-xl">
                <div className="flex items-center space-x-3">
                    <img src="/logo.png" alt="LuminaSupport" className="w-8 h-8 rounded-lg" />
                    <span className="text-xl font-bold font-display tracking-tight text-white">Lumina<span className="text-primary-500">Support</span></span>
                </div>
                <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
                    <a href="#features" className="hover:text-white transition-colors">Features</a>
                    <a href="#ai" className="hover:text-white transition-colors">AI Engine</a>
                    <a href="#about" className="hover:text-white transition-colors">Platform</a>
                </div>
                <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-bold transition-all flex items-center group"
                >
                    Admin & Agent Login
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary-600/20 blur-[120px] rounded-full -z-10 pointer-events-none opacity-50"></div>

                <div className="max-w-6xl mx-auto text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold uppercase tracking-widest mb-4"
                    >
                        <Sparkles size={14} />
                        <span>Next-Gen Support Platform</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-black font-display leading-[1.1] tracking-tight"
                    >
                        Intelligence Meets <br />
                        <span className="gradient-text">Human Connection.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed font-medium"
                    >
                        Experience the future of customer service. LuminaSupport combines
                        agentic AI with seamless human escalation to deliver instant,
                        accurate, and empathetic support.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
                    >
                        <button className="px-8 py-4 bg-primary-600 hover:bg-primary-700 rounded-2xl text-lg font-bold shadow-lg shadow-primary-500/20 transition-all active:scale-[0.97] flex items-center group">
                            Explore Platform
                            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <p className="text-slate-500 text-sm font-medium">Use the widget below to test our AI →</p>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Bot className="text-primary-400" />}
                        title="Agentic AI Response"
                        description="Powered by Google Gemini, our AI handles 80% of routine queries with professional and human-like precision."
                    />
                    <FeatureCard
                        icon={<Zap className="text-amber-400" />}
                        title="Instant Escalation"
                        description="One click (or automated keyword detection) connects users to a live human agent with full context and history."
                    />
                    <FeatureCard
                        icon={<PhoneCall className="text-purple-400" />}
                        title="Voice & Video SDK"
                        description="Built-in WebRTC support for high-fidelity audio and video calls directly within the chat interface."
                    />
                </div>
            </section>

            {/* About Lumina */}
            <section id="about" className="py-24 px-6 bg-white/2">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold">Why LuminaSupport?</h2>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <CheckCircle2 className="text-primary-500 mt-1 shrink-0" />
                                <span className="text-slate-300">Unified dashboard for managing omnichannel interactions.</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <CheckCircle2 className="text-primary-500 mt-1 shrink-0" />
                                <span className="text-slate-300">Real-time sentiment analysis and automated tagging.</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <CheckCircle2 className="text-primary-500 mt-1 shrink-0" />
                                <span className="text-slate-300">Secure Audit Logs for compliance and quality assurance.</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <CheckCircle2 className="text-primary-500 mt-1 shrink-0" />
                                <span className="text-slate-300">No-code branding customization for seamless integration.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="glass-card p-8 rounded-[2.5rem] border-white/10 bg-white/5 aspect-video flex items-center justify-center relative group">
                        <div className="absolute inset-0 bg-primary-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Shield size={80} className="text-primary-500/50" />
                        <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10">
                            <p className="text-xs text-slate-400">Enterprise Ready Security</p>
                            <p className="text-sm font-bold">End-to-End Encryption Enabled</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center text-slate-500 text-sm">
                    <p>© 2026 LuminaSupport Platform. Built with Advanced Agentic AI.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </footer>

            {/* Float the widget on top */}
            <CustomerWidget />
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className="glass-card p-10 rounded-[2.5rem] border-white/10 bg-[#0f172a]/50 hover:bg-white/5 transition-all"
    >
        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 text-2xl shadow-inner shadow-white/5">
            {icon}
        </div>
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="text-slate-400 leading-relaxed font-medium">
            {description}
        </p>
    </motion.div>
);

export default SupportLanding;
