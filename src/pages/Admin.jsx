import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Save, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Admin = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem('adminAuth') === 'true') {
            setIsAuthenticated(true);
        }
        fetchData();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoggingIn(true);
        setLoginError('');

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginForm)
            });
            const result = await res.json();
            
            if (result.success) {
                setIsAuthenticated(true);
                sessionStorage.setItem('adminAuth', 'true');
            } else {
                setLoginError(result.message || 'Invalid credentials');
            }
        } catch (err) {
            setLoginError('Server error, please try again.');
        } finally {
            setLoggingIn(false);
        }
    };

    const fetchData = async () => {
        try {
            const res = await fetch('/api/portfolio');
            const json = await res.json();
            setData(json);
        } catch (err) {
            console.error("Failed to fetch data:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-background text-accent flex items-center justify-center font-heading text-2xl uppercase tracking-widest">Loading...</div>;
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 p-8 rounded-2xl w-full max-w-md"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-heading text-accent uppercase tracking-widest mb-2">Admin Login</h1>
                        <p className="text-muted text-sm">Enter your credentials to access the dashboard</p>
                    </div>

                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-white text-sm mb-2">Username</label>
                            <input 
                                type="text" 
                                required
                                value={loginForm.username} 
                                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})} 
                                className="w-full bg-background border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none" 
                            />
                        </div>
                        <div>
                            <label className="block text-white text-sm mb-2">Password</label>
                            <input 
                                type="password" 
                                required
                                value={loginForm.password} 
                                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})} 
                                className="w-full bg-background border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none" 
                            />
                        </div>
                        
                        {loginError && <p className="text-red-500 text-sm">{loginError}</p>}

                        <button 
                            type="submit" 
                            disabled={loggingIn}
                            className="w-full bg-accent text-background font-bold uppercase tracking-widest p-4 rounded-lg mt-4 flex justify-center items-center gap-2 hover:bg-accent/90 transition-colors disabled:opacity-50"
                        >
                            {loggingIn ? <Loader2 className="animate-spin" size={18} /> : null}
                            {loggingIn ? 'Authenticating...' : 'Login'}
                        </button>
                        
                        <Link to="/" className="text-center text-muted text-sm mt-4 hover:text-white transition-colors">
                            Return to Website
                        </Link>
                    </form>
                </motion.div>
            </div>
        );
    }

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch('/api/portfolio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            alert('Settings saved successfully!');
        } catch (err) {
            console.error("Failed to save data:", err);
            alert('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = async (e, section, key, index = null) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('media', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const result = await res.json();
            
            if (result.success) {
                // Update local state with new URL
                setData(prev => {
                    const newData = { ...prev };
                    if (index !== null) {
                        newData[section][key][index] = result.url;
                    } else {
                        newData[section][key] = result.url;
                    }
                    return newData;
                });
            }
        } catch (err) {
            console.error("Upload failed:", err);
            alert("File upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const handleTextChange = (e, section, key) => {
        setData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: e.target.value
            }
        }));
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-primary"><Loader2 className="animate-spin" size={48} /></div>;
    if (!data) return <div className="text-white">Error loading data.</div>;

    return (
        <div className="min-h-screen bg-background text-primary p-8 font-body">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
                    <div>
                        <Link to="/" className="text-accent flex items-center gap-2 mb-4 hover:underline">
                            <ArrowLeft size={16} /> Back to Live Site
                        </Link>
                        <h1 className="text-4xl font-heading uppercase tracking-widest">Admin Dashboard</h1>
                    </div>
                    <button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="bg-accent text-background px-6 py-3 rounded-full font-bold uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Changes
                    </button>
                </header>

                {uploading && (
                    <div className="fixed top-4 right-4 bg-accent text-background px-4 py-2 rounded-lg flex items-center gap-2 z-50 animate-pulse">
                        <Loader2 className="animate-spin" size={16} /> Uploading media...
                    </div>
                )}

                {/* Section: Global Settings */}
                <section className="mb-12 bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-heading text-accent mb-2 uppercase tracking-wider">Availability Status</h2>
                            <p className="text-muted text-sm">Toggle whether you are currently taking on new projects.</p>
                        </div>
                        <button
                            onClick={() => handleTextChange({ target: { value: !data.global?.availableForWork } }, 'global', 'availableForWork')}
                            className="relative flex items-center rounded-full transition-colors"
                            style={{ 
                                width: 52, height: 28, 
                                background: data.global?.availableForWork ? '#f5a623' : '#333', 
                                padding: '4px' 
                            }}
                        >
                            <span
                                style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 9999,
                                    background: '#0a0a0a',
                                    transform: data.global?.availableForWork ? 'translateX(24px)' : 'translateX(0px)',
                                    transition: 'transform 0.25s ease',
                                }}
                            />
                        </button>
                    </div>
                </section>

                {/* Section: Hero */}
                <section className="mb-12 bg-white/5 p-6 rounded-2xl border border-white/10">
                    <h2 className="text-2xl font-heading text-accent mb-6 uppercase tracking-wider">Hero Section</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-muted text-sm mb-2">Headline</label>
                            <input value={data.hero.headline} onChange={(e) => handleTextChange(e, 'hero', 'headline')} className="w-full bg-background border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none" />
                        </div>
                        <div>
                            <label className="block text-muted text-sm mb-2">Accent Word</label>
                            <input value={data.hero.accentWord} onChange={(e) => handleTextChange(e, 'hero', 'accentWord')} className="w-full bg-background border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none" />
                        </div>
                        <div>
                            <label className="block text-muted text-sm mb-2">Hero Image</label>
                            <img src={data.hero.heroImage} alt="Hero" className="w-full h-48 object-cover rounded-xl mb-3" />
                            <label className="cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                <Upload size={16} /> Upload New Image
                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'hero', 'heroImage')} accept="image/*,video/*" />
                            </label>
                        </div>
                    </div>
                </section>

                {/* Section: Welcome */}
                <section className="mb-12 bg-white/5 p-6 rounded-2xl border border-white/10">
                    <h2 className="text-2xl font-heading text-accent mb-6 uppercase tracking-wider">Welcome Section</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-muted text-sm mb-2">Image 1 (Tall right)</label>
                            <img src={data.welcome.image1} alt="Welcome 1" className="w-full h-48 object-cover rounded-xl mb-3" />
                            <label className="cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                <Upload size={16} /> Upload New Image
                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'welcome', 'image1')} accept="image/*,video/*" />
                            </label>
                        </div>
                        <div>
                            <label className="block text-muted text-sm mb-2">Image 2 (Short left)</label>
                            <img src={data.welcome.image2} alt="Welcome 2" className="w-full h-48 object-cover rounded-xl mb-3" />
                            <label className="cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                <Upload size={16} /> Upload New Image
                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'welcome', 'image2')} accept="image/*,video/*" />
                            </label>
                        </div>
                    </div>
                </section>

                {/* Section: Project Gallery Images */}
                <section className="mb-12 bg-white/5 p-6 rounded-2xl border border-white/10">
                    <h2 className="text-2xl font-heading text-accent mb-6 uppercase tracking-wider">Gallery Images</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {data.projectPortfolio.images.map((img, index) => (
                            <div key={index}>
                                <img src={img} alt={`Gallery ${index}`} className="w-full h-32 object-cover rounded-xl mb-3" />
                                <label className="cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm">
                                    <Upload size={14} /> Replace
                                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'projectPortfolio', 'images', index)} accept="image/*,video/*" />
                                </label>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Notice */}
                <p className="text-muted text-center italic mt-12 mb-8">
                    Note: Only the most prominent images are hooked up to this quick demo. The logic is fully scalable to all text and image fields.
                </p>

            </div>
        </div>
    );
};

export default Admin;
