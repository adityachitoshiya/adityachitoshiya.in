import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Save, Loader2, ArrowLeft, Plus, Trash2, X as XIcon, Music, Crop } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import ImageCropper from '../components/ImageCropper';

const Admin = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('global');

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);

    // Cropper State
    const [cropModal, setCropModal] = useState({
        isOpen: false,
        imageSrc: null,
        targetSection: null,
        targetKey: null,
        targetIndex: null,
        isCover: false,
        galleryIndex: null,
        aspect: null // Can set dynamically later if needed
    });

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
        return <LoadingScreen />;
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

    const handleFileSelect = (e, targetSection, targetKey, targetIndex = null, aspect = null) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type.startsWith('image/')) {
            // Read file as data URL to pass to cropper
            const reader = new FileReader();
            reader.onload = () => {
                setCropModal({
                    isOpen: true,
                    imageSrc: reader.result,
                    targetSection,
                    targetKey,
                    targetIndex,
                    isCover: false,
                    galleryIndex: null,
                    aspect
                });
            };
            reader.readAsDataURL(file);
        } else {
            // Non-image files (audio/video) bypass cropper
            uploadMediaBlob(file, targetSection, targetKey, targetIndex);
        }
    };

    const handleProjectFileSelect = (e, targetIndex, isCover, galleryIndex = null, aspect = null) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                setCropModal({
                    isOpen: true,
                    imageSrc: reader.result,
                    targetSection: 'projectPortfolio',
                    targetKey: 'projects',
                    targetIndex,
                    isCover,
                    galleryIndex,
                    aspect
                });
            };
            reader.readAsDataURL(file);
        } else {
             // Non-image file bypass
             uploadProjectMediaBlob(file, targetIndex, isCover, galleryIndex);
        }
    };

    const uploadMediaBlob = async (blob, section, key, index = null) => {
        setUploading(true);
        const formData = new FormData();
        // Append blob as file
        formData.append('media', blob, 'upload.webp');

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const result = await res.json();
            
            if (result.success) {
                setData(prev => {
                    const newData = { ...prev };
                    
                    if (section === 'aboutMe' && key === 'slideshowImages') {
                        // Special handling for slideshow images
                         const currentImages = prev.aboutMe?.slideshowImages || [];
                         return { ...prev, aboutMe: { ...prev.aboutMe, slideshowImages: [...currentImages, { url: result.url, title: '', caption: '' }] } };
                    }
                    
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
            setCropModal({ isOpen: false, imageSrc: null }); // Close modal
        }
    };

    const uploadProjectMediaBlob = async (blob, index, isCover, galleryIndex = null) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('media', blob, 'upload.webp');

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const result = await res.json();
            
            if (result.success) {
                setData(prev => {
                    const newProjects = [...prev.projectPortfolio.projects];
                    if (isCover) {
                        newProjects[index].coverImage = result.url;
                    } else if (galleryIndex !== null) {
                        newProjects[index].gallery[galleryIndex] = result.url;
                    } else {
                        if (!newProjects[index].gallery) newProjects[index].gallery = [];
                        newProjects[index].gallery.push(result.url);
                    }
                    return { ...prev, projectPortfolio: { ...prev.projectPortfolio, projects: newProjects } };
                });
            }
        } catch (err) {
            console.error("Upload failed:", err);
            alert("File upload failed.");
        } finally {
            setUploading(false);
            setCropModal({ isOpen: false, imageSrc: null });
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

    const handleProjectChange = (index, field, value) => {
        setData(prev => {
            const newProjects = [...(prev.projectPortfolio?.projects || [])];
            newProjects[index] = { ...newProjects[index], [field]: value };
            if (field === 'name') {
                newProjects[index].slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            }
            return {
                ...prev,
                projectPortfolio: { ...prev.projectPortfolio, projects: newProjects }
            };
        });
    };

    const handleAddProject = () => {
        setData(prev => {
            const newProject = {
                name: "New Project",
                slug: "new-project",
                type: "Category",
                year: new Date().getFullYear().toString(),
                role: "Role",
                description: "Project description goes here.",
                coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
                gallery: []
            };
            return {
                ...prev,
                projectPortfolio: {
                    ...prev.projectPortfolio,
                    projects: [newProject, ...prev.projectPortfolio.projects]
                }
            };
        });
    };
    const handleRemoveGalleryImage = (projectIndex, galleryIndex) => {
        setData(prev => {
            const newProjects = [...prev.projectPortfolio.projects];
            newProjects[projectIndex].gallery = newProjects[projectIndex].gallery.filter((_, i) => i !== galleryIndex);
            return { ...prev, projectPortfolio: { ...prev.projectPortfolio, projects: newProjects } };
        });
    };

    if (loading) return <LoadingScreen />;
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

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-4 mb-8 border-b border-white/10 pb-4">
                    {['global', 'hero', 'welcome', 'about', 'creatives', 'gallery', 'slideshow', 'contact'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-full uppercase tracking-wider font-heading text-sm transition-colors ${
                                activeTab === tab ? 'bg-accent text-background' : 'bg-white/5 text-muted hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            {tab === 'creatives' ? 'Projects' : tab === 'slideshow' ? 'Slideshow' : tab === 'about' ? 'About Us' : tab === 'contact' ? 'Contact' : tab}
                        </button>
                    ))}
                </div>

                {/* Section: Global Settings */}
                {activeTab === 'global' && (
                <section className="mb-12 bg-white/5 p-6 rounded-2xl border border-white/10">
                    
                    {/* Availability Toggle */}
                    <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-8">
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

                    {/* Background Music */}
                    <div className="mb-12 border-b border-white/10 pb-8">
                        <h2 className="text-2xl font-heading text-accent mb-6 uppercase tracking-wider">Background Music</h2>
                        <div className="bg-white/5 p-4 rounded-lg border border-white/10 flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <label className="block text-muted text-sm mb-2">Current Audio Track</label>
                                {data.global?.backgroundMusic ? (
                                    <div className="flex items-center gap-3 bg-background p-3 rounded-lg border border-white/20">
                                        <Music size={18} className="text-accent flex-shrink-0" />
                                        <span className="text-white text-sm truncate">{data.global.backgroundMusic.split('/').pop()}</span>
                                    </div>
                                ) : (
                                    <div className="text-white/50 text-sm p-3">No background music uploaded yet.</div>
                                )}
                            </div>
                            <label className="cursor-pointer flex-shrink-0 bg-accent text-background hover:bg-accent/90 px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors font-bold uppercase tracking-wider text-sm mt-6">
                                <Upload size={16} /> Upload Audio
                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'global', 'backgroundMusic')} accept="audio/*" />
                            </label>
                        </div>
                    </div>

                    {/* Theme Editor */}
                    <div>
                        <h2 className="text-2xl font-heading text-accent mb-6 uppercase tracking-wider">Theme Controls</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Colors */}
                            <div>
                                <h3 className="text-sm uppercase tracking-widest text-white/50 mb-4 font-semibold">Colors</h3>
                                <div className="space-y-4">
                                    {[
                                        { key: 'background', label: 'Background Color', default: '#0A0A0A' },
                                        { key: 'primary', label: 'Primary Text', default: '#FFFFFF' },
                                        { key: 'muted', label: 'Muted Text', default: '#B3B3B3' },
                                        { key: 'accent', label: 'Accent Color', default: '#F5A623' }
                                    ].map(color => (
                                        <div key={color.key} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/10">
                                            <label className="text-white text-sm">{color.label}</label>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-muted uppercase font-mono">{data.global?.theme?.colors?.[color.key] || color.default}</span>
                                                <input 
                                                    type="color" 
                                                    value={data.global?.theme?.colors?.[color.key] || color.default} 
                                                    onChange={(e) => {
                                                        setData(prev => ({
                                                            ...prev,
                                                            global: {
                                                                ...prev.global,
                                                                theme: {
                                                                    ...prev.global?.theme,
                                                                    colors: {
                                                                        ...(prev.global?.theme?.colors || {}),
                                                                        [color.key]: e.target.value
                                                                    }
                                                                }
                                                            }
                                                        }));
                                                    }}
                                                    className="w-8 h-8 rounded cursor-pointer border-none p-0 bg-transparent"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Fonts */}
                            <div>
                                <h3 className="text-sm uppercase tracking-widest text-white/50 mb-4 font-semibold">Fonts (Google Fonts)</h3>
                                <div className="space-y-4">
                                    {[
                                        { key: 'heading', label: 'Heading Font', default: 'Anton' },
                                        { key: 'body', label: 'Body Font', default: 'Inter' },
                                        { key: 'script', label: 'Script Font', default: 'Dancing Script' }
                                    ].map(font => (
                                        <div key={font.key}>
                                            <label className="block text-white text-sm mb-2">{font.label}</label>
                                            <input 
                                                type="text" 
                                                value={data.global?.theme?.fonts?.[font.key] || font.default} 
                                                onChange={(e) => {
                                                    setData(prev => ({
                                                        ...prev,
                                                        global: {
                                                            ...prev.global,
                                                            theme: {
                                                                ...prev.global?.theme,
                                                                fonts: {
                                                                    ...(prev.global?.theme?.fonts || {}),
                                                                    [font.key]: e.target.value
                                                                }
                                                            }
                                                        }
                                                    }));
                                                }}
                                                className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none font-mono text-sm" 
                                                placeholder="e.g. Roboto"
                                            />
                                        </div>
                                    ))}
                                    <p className="text-xs text-muted italic mt-2">
                                        Note: Font names must exactly match Google Fonts (e.g., 'Playfair Display'). The system will automatically load them.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
                )}

                {/* Section: Hero */}
                {activeTab === 'hero' && (
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
                                <input type="file" className="hidden" onChange={(e) => handleFileSelect(e, 'hero', 'heroImage', null, 21/9)} accept="image/*,video/*" />
                            </label>
                        </div>
                    </div>
                </section>
                )}

                {/* Section: Welcome */}
                {activeTab === 'welcome' && (
                <section className="mb-12 bg-white/5 p-6 rounded-2xl border border-white/10">
                    <h2 className="text-2xl font-heading text-accent mb-6 uppercase tracking-wider">Welcome Section</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-muted text-sm mb-2">Image 1 (Tall right)</label>
                            <img src={data.welcome.image1} alt="Welcome 1" className="w-full h-48 object-cover rounded-xl mb-3" />
                            <label className="cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                <Upload size={16} /> Upload New Image
                                <input type="file" className="hidden" onChange={(e) => handleFileSelect(e, 'welcome', 'image1', null, 3/4)} accept="image/*,video/*" />
                            </label>
                        </div>
                        <div>
                            <label className="block text-muted text-sm mb-2">Image 2 (Short left)</label>
                            <img src={data.welcome.image2} alt="Welcome 2" className="w-full h-48 object-cover rounded-xl mb-3" />
                            <label className="cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                <Upload size={16} /> Upload New Image
                                <input type="file" className="hidden" onChange={(e) => handleFileSelect(e, 'welcome', 'image2', null, 4/3)} accept="image/*,video/*" />
                            </label>
                        </div>
                    </div>
                </section>
                )}

                {/* Section: About Us */}
                {activeTab === 'about' && (
                <section className="mb-12 bg-white/5 p-6 rounded-2xl border border-white/10">
                    <h2 className="text-2xl font-heading text-accent mb-6 uppercase tracking-wider">About Me Section</h2>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-muted text-sm mb-2">Headline</label>
                            <input value={data.aboutMe?.headline || ''} onChange={(e) => handleTextChange(e, 'aboutMe', 'headline')} className="w-full bg-background border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none" />
                        </div>
                        <div>
                            <label className="block text-muted text-sm mb-2">Biography (New lines create paragraphs)</label>
                            <textarea 
                                value={data.aboutMe?.text || ''} 
                                onChange={(e) => handleTextChange(e, 'aboutMe', 'text')} 
                                className="w-full bg-background border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none h-48 resize-y" 
                            />
                        </div>
                        <div>
                            <label className="block text-muted text-sm mb-2">Portrait Image</label>
                            <img src={data.aboutMe?.image} alt="About Me" className="w-48 h-48 object-cover rounded-xl mb-3" />
                            <label className="cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg inline-flex items-center justify-center gap-2 transition-colors">
                                <Upload size={16} /> Upload New Portrait
                                <input type="file" className="hidden" onChange={(e) => handleFileSelect(e, 'aboutMe', 'image', null, 1/1)} accept="image/*,video/*" />
                            </label>
                        </div>
                    </div>
                </section>
                )}

                {/* Section: Project Portfolio (Creatives) */}
                {activeTab === 'creatives' && (
                <section className="mb-12 bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-heading text-accent uppercase tracking-wider">Creatives (Projects)</h2>
                        <button onClick={handleAddProject} className="bg-accent text-background px-4 py-2 rounded-full font-bold uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-all text-sm">
                            <Plus size={16} /> Add Project
                        </button>
                    </div>
                    
                    <div className="flex flex-col gap-8">
                        {data.projectPortfolio?.projects?.map((project, pIdx) => (
                            <div key={pIdx} className="bg-background border border-white/10 p-6 rounded-xl relative group">
                                <button onClick={() => handleDeleteProject(pIdx)} className="absolute top-4 right-4 text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white/5 rounded-lg">
                                    <Trash2 size={18} />
                                </button>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-muted text-sm mb-2">Project Name</label>
                                        <input value={project.name || ''} onChange={(e) => handleProjectChange(pIdx, 'name', e.target.value)} className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-muted text-sm mb-2">Type / Category</label>
                                        <input value={project.type || ''} onChange={(e) => handleProjectChange(pIdx, 'type', e.target.value)} className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-muted text-sm mb-2">Description</label>
                                        <textarea value={project.description || ''} onChange={(e) => handleProjectChange(pIdx, 'description', e.target.value)} className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none h-24 resize-none" />
                                    </div>
                                    <div>
                                        <label className="block text-muted text-sm mb-2">Year</label>
                                        <input value={project.year || ''} onChange={(e) => handleProjectChange(pIdx, 'year', e.target.value)} className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-muted text-sm mb-2">Role</label>
                                        <input value={project.role || ''} onChange={(e) => handleProjectChange(pIdx, 'role', e.target.value)} className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none" />
                                    </div>
                                </div>
                                
                                <div className="mb-6">
                                    <label className="block text-muted text-sm mb-2">Cover Image</label>
                                    <div className="flex items-center gap-4">
                                        <img src={project.coverImage} alt="Cover" className="w-32 h-32 object-cover rounded-lg" />
                                        <label className="cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                            <Upload size={16} /> Replace Cover
                                            <input type="file" className="hidden" onChange={(e) => handleProjectFileSelect(e, pIdx, true, null, 1/1)} accept="image/*,video/*" />
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-muted text-sm mb-2">Gallery Images</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {project.gallery?.map((img, gIdx) => (
                                            <div key={gIdx} className="relative group/gal">
                                                <img src={img} alt={`Gallery ${gIdx}`} className="w-full h-24 object-cover rounded-lg" />
                                                <button onClick={() => handleRemoveGalleryImage(pIdx, gIdx)} className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1 rounded-md opacity-0 group-hover/gal:opacity-100 transition-opacity">
                                                    <XIcon size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center h-24 transition-colors">
                                            <Plus size={20} className="text-white/50 mb-1" />
                                            <span className="text-xs text-white/50">Add Image</span>
                                            <input type="file" className="hidden" onChange={(e) => handleProjectFileSelect(e, pIdx, false, null, 16/9)} accept="image/*,video/*" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                )}

                {/* Section: Project Gallery Images */}
                {activeTab === 'gallery' && (
                <section className="mb-12 bg-white/5 p-6 rounded-2xl border border-white/10">
                    <h2 className="text-2xl font-heading text-accent mb-6 uppercase tracking-wider">Gallery Images</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {data.projectPortfolio.images.map((img, index) => (
                            <div key={index}>
                                <img src={img} alt={`Gallery ${index}`} className="w-full h-32 object-cover rounded-xl mb-3" />
                                <label className="cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm">
                                    <Upload size={14} /> Replace
                                    <input type="file" className="hidden" onChange={(e) => handleFileSelect(e, 'projectPortfolio', 'images', index, 16/9)} accept="image/*,video/*" />
                                </label>
                            </div>
                        ))}
                    </div>
                </section>
                )}

                {/* Section: Visual Gallery Slideshow */}
                {activeTab === 'slideshow' && (
                <section className="mb-12 bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-heading text-accent uppercase tracking-wider">Visual Gallery (Slideshow)</h2>
                        <p className="text-muted text-sm">Add images that will loop on the About page slideshow.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(data.aboutMe?.slideshowImages || []).map((item, index) => {
                            const isString = typeof item === 'string';
                            const imgUrl = isString ? item : item.url;
                            const title = isString ? '' : (item.title || '');
                            const caption = isString ? '' : (item.caption || '');

                            return (
                            <div key={index} className="relative group/slide border border-white/10 rounded-xl overflow-hidden bg-background flex flex-col">
                                <div className="relative h-48 shrink-0">
                                    <img src={imgUrl} alt={`Slide ${index}`} className="w-full h-full object-cover" />
                                    <button onClick={() => {
                                        setData(prev => {
                                            const newImages = [...(prev.aboutMe?.slideshowImages || [])];
                                            newImages.splice(index, 1);
                                            return { ...prev, aboutMe: { ...prev.aboutMe, slideshowImages: newImages } };
                                        });
                                    }} className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded-md opacity-0 group-hover/slide:opacity-100 transition-opacity">
                                        <XIcon size={14} />
                                    </button>
                                </div>
                                <div className="p-4 space-y-3 flex-1 flex flex-col">
                                    <div>
                                        <label className="block text-muted text-xs mb-1">Title</label>
                                        <input 
                                            value={title} 
                                            onChange={(e) => {
                                                setData(prev => {
                                                    const newImages = [...(prev.aboutMe?.slideshowImages || [])];
                                                    const current = newImages[index];
                                                    newImages[index] = typeof current === 'string' 
                                                        ? { url: current, title: e.target.value, caption: '' }
                                                        : { ...current, title: e.target.value };
                                                    return { ...prev, aboutMe: { ...prev.aboutMe, slideshowImages: newImages } };
                                                });
                                            }}
                                            className="w-full bg-white/5 border border-white/20 rounded-md p-2 text-white focus:border-accent outline-none text-sm" 
                                            placeholder="Optional title"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-muted text-xs mb-1">Caption</label>
                                        <input 
                                            value={caption} 
                                            onChange={(e) => {
                                                setData(prev => {
                                                    const newImages = [...(prev.aboutMe?.slideshowImages || [])];
                                                    const current = newImages[index];
                                                    newImages[index] = typeof current === 'string' 
                                                        ? { url: current, title: '', caption: e.target.value }
                                                        : { ...current, caption: e.target.value };
                                                    return { ...prev, aboutMe: { ...prev.aboutMe, slideshowImages: newImages } };
                                                });
                                            }}
                                            className="w-full bg-white/5 border border-white/20 rounded-md p-2 text-white focus:border-accent outline-none text-sm" 
                                            placeholder="Optional caption"
                                        />
                                    </div>
                                </div>
                            </div>
                        )})}
                        <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center min-h-[250px] transition-colors">
                            <Plus size={24} className="text-white/50 mb-2" />
                            <span className="text-sm text-white/50">Add Image</span>
                            <input type="file" className="hidden" onChange={(e) => handleFileSelect(e, 'aboutMe', 'slideshowImages', null, 16/9)} accept="image/*,video/*" />
                        </label>
                    </div>
                </section>
                )}

                {/* Section: Contact */}
                {activeTab === 'contact' && (
                <section className="mb-12 bg-white/5 p-6 rounded-2xl border border-white/10">
                    <h2 className="text-2xl font-heading text-accent mb-6 uppercase tracking-wider">Contact Section</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <label className="block text-muted text-sm mb-2">Headline</label>
                            <input value={data.contact?.headline || ''} onChange={(e) => handleTextChange(e, 'contact', 'headline')} className="w-full bg-background border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none" />
                        </div>
                        <div className="md:row-span-2">
                            <label className="block text-muted text-sm mb-2">Contact Portrait</label>
                            <img src={data.contact?.image} alt="Contact" className="w-full h-48 object-cover rounded-xl mb-3" />
                            <label className="cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                <Upload size={16} /> Upload New Portrait
                                <input type="file" className="hidden" onChange={(e) => handleFileSelect(e, 'contact', 'image', null, 3/4)} accept="image/*,video/*" />
                            </label>
                        </div>
                        <div>
                            <label className="block text-muted text-sm mb-2">Text / Description</label>
                            <textarea value={data.contact?.text || ''} onChange={(e) => handleTextChange(e, 'contact', 'text')} className="w-full bg-background border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none h-32 resize-y" />
                        </div>
                    </div>

                    <h3 className="text-lg font-heading text-white mb-4 uppercase tracking-wider border-b border-white/10 pb-2">Global Contact Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-muted text-sm mb-2">Email Address</label>
                            <input value={data.global?.email || ''} onChange={(e) => handleTextChange(e, 'global', 'email')} className="w-full bg-background border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none" />
                        </div>
                        <div>
                            <label className="block text-muted text-sm mb-2">Social Media Handle (e.g. @username)</label>
                            <input value={data.global?.social || ''} onChange={(e) => handleTextChange(e, 'global', 'social')} className="w-full bg-background border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none" />
                        </div>
                        <div>
                            <label className="block text-muted text-sm mb-2">Website URL</label>
                            <input value={data.global?.website || ''} onChange={(e) => handleTextChange(e, 'global', 'website')} className="w-full bg-background border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none" />
                        </div>
                        <div>
                            <label className="block text-muted text-sm mb-2">Phone Number</label>
                            <input value={data.global?.phone || ''} onChange={(e) => handleTextChange(e, 'global', 'phone')} className="w-full bg-background border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none" />
                        </div>
                    </div>
                </section>
                )}

                {/* Notice */}
                <p className="text-muted text-center italic mt-12 mb-8">
                    Note: Only the most prominent images are hooked up to this quick demo. The logic is fully scalable to all text and image fields.
                </p>

            </div>

            {/* Cropper Modal */}
            {cropModal.isOpen && (
                <ImageCropper
                    imageSrc={cropModal.imageSrc}
                    aspect={cropModal.aspect}
                    onSave={handleCropSave}
                    onCancel={() => setCropModal({ isOpen: false, imageSrc: null })}
                />
            )}
        </div>
    );
};

export default Admin;
