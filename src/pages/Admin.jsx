import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Save, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Admin = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

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
