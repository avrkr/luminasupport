import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Save, Globe, Mail, Shield, Palette, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminSettings = () => {
    const { user } = useAuth();
    const [settings, setSettings] = useState({
        platformName: '',
        geminiApiKey: '',
        smtpConfig: { host: '', port: 587, user: '', pass: '' },
        aiConfig: { confidenceThreshold: 0.7, autoEscalateKeywords: 'human, agent, real person' },
        branding: { primaryColor: '#3b82f6', secondaryColor: '#1e40af' }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await axios.get('/api/settings/public');
                setSettings(prev => ({
                    ...prev,
                    ...data,
                    smtpConfig: { ...prev.smtpConfig, ...data.smtpConfig },
                    aiConfig: {
                        ...prev.aiConfig,
                        ...data.aiConfig,
                        autoEscalateKeywords: data.aiConfig?.autoEscalateKeywords?.join(', ') || prev.aiConfig.autoEscalateKeywords
                    },
                    branding: { ...prev.branding, ...data.branding }
                }));
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('platformName', settings.platformName);
            formData.append('geminiApiKey', settings.geminiApiKey);
            formData.append('smtpConfig', JSON.stringify(settings.smtpConfig));

            // Convert back to array
            const aiConf = {
                ...settings.aiConfig,
                autoEscalateKeywords: settings.aiConfig.autoEscalateKeywords.split(',').map(k => k.trim())
            };
            formData.append('aiConfig', JSON.stringify(aiConf));
            formData.append('branding', JSON.stringify(settings.branding));

            await axios.put('/api/admin/settings', formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSaving(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error(err);
            setSaving(false);
            alert('Error saving settings');
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-400">Loading system settings...</div>;

    return (
        <div className="max-w-4xl space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold font-display">System Settings</h2>
                    <p className="text-slate-400">Configure platform branding, AI behavior, and SMTP relay</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50"
                >
                    <Save size={20} />
                    <span className="font-bold">{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
            </div>

            {success && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-2xl"
                >
                    Settings updated successfully!
                </motion.div>
            )}

            <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* General Branding */}
                <div className="glass-card p-8 rounded-3xl space-y-6">
                    <div className="flex items-center space-x-3 mb-2">
                        <Globe className="text-primary-400" />
                        <h3 className="text-xl font-bold">General & Branding</h3>
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Platform Name</label>
                        <input
                            type="text"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            value={settings.platformName}
                            onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Primary Color</label>
                            <input
                                type="color"
                                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-1 py-1"
                                value={settings.branding?.primaryColor || '#3b82f6'}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    branding: { ...settings.branding, primaryColor: e.target.value }
                                })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Secondary Color</label>
                            <input
                                type="color"
                                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-1 py-1"
                                value={settings.branding?.secondaryColor || '#1e40af'}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    branding: { ...settings.branding, secondaryColor: e.target.value }
                                })}
                            />
                        </div>
                    </div>
                </div>

                {/* AI Configuration */}
                <div className="glass-card p-8 rounded-3xl space-y-6">
                    <div className="flex items-center space-x-3 mb-2">
                        <Bot className="text-purple-400" />
                        <h3 className="text-xl font-bold">AI Configuration</h3>
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Gemini API Key</label>
                        <input
                            type="password"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            value={settings.geminiApiKey}
                            onChange={(e) => setSettings({ ...settings, geminiApiKey: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Auto-Escalate Keywords (comma separated)</label>
                        <input
                            type="text"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            value={settings.aiConfig?.autoEscalateKeywords || ''}
                            onChange={(e) => setSettings({
                                ...settings,
                                aiConfig: { ...settings.aiConfig, autoEscalateKeywords: e.target.value }
                            })}
                        />
                    </div>
                </div>

                {/* Mail Server */}
                <div className="glass-card p-8 rounded-3xl space-y-6 md:col-span-2">
                    <div className="flex items-center space-x-3 mb-2">
                        <Mail className="text-primary-400" />
                        <h3 className="text-xl font-bold">SMTP Mail Configuration</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm text-slate-400 mb-2">SMTP Host</label>
                            <input
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                value={settings.smtpConfig?.host || ''}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    smtpConfig: { ...settings.smtpConfig, host: e.target.value }
                                })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Port</label>
                            <input
                                type="number"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                value={settings.smtpConfig?.port || ''}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    smtpConfig: { ...settings.smtpConfig, port: e.target.value }
                                })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">User</label>
                            <input
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                value={settings.smtpConfig?.user || ''}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    smtpConfig: { ...settings.smtpConfig, user: e.target.value }
                                })}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;
