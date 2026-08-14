import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Save, Loader2, ArrowLeft, Plus, Trash2, X as XIcon, Music, Crop, Video, Play, Film, Image as ImageIcon, Check, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import ImageCropModal from '../components/ImageCropModal';
import { imageFrameConfigs } from '../utils/imageFrameConfigs';

const isVideoUrl = (url) => {
    if (typeof url !== 'string' || !url) return false;
    return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url) || url.includes('/video/upload/') || url.startsWith('data:video/');
};

const Admin = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('homepage');
    const [dragActiveField, setDragActiveField] = useState(null);
    const [autoSaveStatus, setAutoSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
    const isInitialMount = useRef(true);

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
        configKey: null // Replaced aspect with configKey
    });

    useEffect(() => {
        if (sessionStorage.getItem('adminToken')) {
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
                sessionStorage.setItem('adminToken', result.token);
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

    // Auto-Save Effect (Debounced 1.2s)
    useEffect(() => {
        if (!data || !isAuthenticated) return;

        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        setAutoSaveStatus('saving');

        const timer = setTimeout(async () => {
            try {
                const token = sessionStorage.getItem('adminToken');
                if (!token) return;

                const res = await fetch('/api/portfolio', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                if (result.success) {
                    setAutoSaveStatus('saved');
                    setTimeout(() => {
                        setAutoSaveStatus('idle');
                    }, 3000);
                } else {
                    setAutoSaveStatus('error');
                }
            } catch (err) {
                console.error("Auto-save failed:", err);
                setAutoSaveStatus('error');
            }
        }, 1200);

        return () => clearTimeout(timer);
    }, [data, isAuthenticated]);

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
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
                },
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

    const processUploadedFile = (file, targetSection, targetKey, targetIndex = null, configKey = null) => {
        if (!file) return;
        if (file.type.startsWith('image/')) {
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
                    configKey
                });
            };
            reader.readAsDataURL(file);
        } else {
            uploadMediaBlob(file, targetSection, targetKey, targetIndex);
        }
    };

    const handleFileSelect = (e, targetSection, targetKey, targetIndex = null, configKey = null) => {
        const file = e.target.files[0];
        if (!file) return;
        processUploadedFile(file, targetSection, targetKey, targetIndex, configKey);
    };

    const handleDropFile = (e, targetSection, targetKey, targetIndex = null, configKey = null) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActiveField(null);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            processUploadedFile(file, targetSection, targetKey, targetIndex, configKey);
        }
    };

    const handleDragOver = (e, fieldKey) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActiveField(fieldKey);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActiveField(null);
    };

    const handleEditImage = (imageUrl, targetSection, targetKey, targetIndex = null, configKey = null, isCover = false, galleryIndex = null) => {
        if (!imageUrl) return;
        setCropModal({
            isOpen: true,
            imageSrc: imageUrl,
            targetSection,
            targetKey,
            targetIndex,
            isCover,
            galleryIndex,
            configKey
        });
    };

    const handleProjectFileSelect = (e, targetIndex, isCover, galleryIndex = null, configKey = null) => {
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
                    configKey
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
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
                },
                body: formData
            });
            const result = await res.json();
            
            if (result.success) {
                setData(prev => {
                    const newData = { ...prev };
                    
                    if (section === 'aboutMe' && key === 'slideshowImages') {
                        // Special handling for slideshow images
                         const currentImages = [...(prev.aboutMe?.slideshowImages || [])];
                         if (index !== null) {
                             currentImages[index] = typeof currentImages[index] === 'string' 
                                ? { url: result.url, title: '', caption: '' }
                                : { ...currentImages[index], url: result.url };
                         } else {
                             currentImages.push({ url: result.url, title: '', caption: '' });
                         }
                         return { ...prev, aboutMe: { ...prev.aboutMe, slideshowImages: currentImages } };
                    }

                    if (section === 'brands') {
                         const currentBrands = [...(prev.brands || [])];
                         if (index !== null) {
                             currentBrands[index] = typeof currentBrands[index] === 'string'
                                ? { name: currentBrands[index], logo: result.url }
                                : { ...currentBrands[index], logo: result.url };
                         } else {
                             currentBrands.push({ name: 'New Brand', logo: result.url });
                         }
                         return { ...prev, brands: currentBrands };
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
            const res = await fetch('/api/upload', { 
                method: 'POST', 
                headers: { 'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}` },
                body: formData 
            });
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

    const handleCropSave = async (blob) => {
        if (cropModal.targetSection === 'projectPortfolio' && cropModal.targetKey === 'projects') {
            await uploadProjectMediaBlob(blob, cropModal.targetIndex, cropModal.isCover, cropModal.galleryIndex);
        } else {
            await uploadMediaBlob(blob, cropModal.targetSection, cropModal.targetKey, cropModal.targetIndex);
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

    const handleAddWorkExperienceItem = () => {
        setData(prev => ({
            ...prev,
            workExperience: {
                ...prev.workExperience,
                items: [...(prev.workExperience?.items || []), { year: '', company: '', description: '' }]
            }
        }));
    };

    const handleRemoveWorkExperienceItem = (index) => {
        setData(prev => {
            const newItems = [...(prev.workExperience?.items || [])];
            newItems.splice(index, 1);
            return {
                ...prev,
                workExperience: { ...prev.workExperience, items: newItems }
            };
        });
    };

    const handleWorkExperienceItemChange = (index, field, value) => {
        setData(prev => {
            const newItems = [...(prev.workExperience?.items || [])];
            newItems[index] = { ...newItems[index], [field]: value };
            return {
                ...prev,
                workExperience: { ...prev.workExperience, items: newItems }
            };
        });
    };

    const handleAddEducationItem = () => {
        setData(prev => ({
            ...prev,
            education: {
                ...prev.education,
                items: [...(prev.education?.items || []), { year: '', institution: '', description: '' }]
            }
        }));
    };

    const handleRemoveEducationItem = (index) => {
        setData(prev => {
            const newItems = [...(prev.education?.items || [])];
            newItems.splice(index, 1);
            return {
                ...prev,
                education: { ...prev.education, items: newItems }
            };
        });
    };

    const handleEducationItemChange = (index, field, value) => {
        setData(prev => {
            const newItems = [...(prev.education?.items || [])];
            newItems[index] = { ...newItems[index], [field]: value };
            return {
                ...prev,
                education: { ...prev.education, items: newItems }
            };
        });
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
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12 border-b border-white/10 pb-6">
                    <div>
                        <Link to="/" className="text-accent flex items-center gap-2 mb-4 hover:underline">
                            <ArrowLeft size={16} /> Back to Live Site
                        </Link>
                        <h1 className="text-4xl font-heading uppercase tracking-widest">Admin Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                        {/* Auto-Save Indicator Badge */}
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                            {autoSaveStatus === 'saving' && (
                                <span className="text-amber-400 flex items-center gap-1.5 animate-pulse">
                                    <Loader2 className="animate-spin" size={14} /> Auto-saving...
                                </span>
                            )}
                            {autoSaveStatus === 'saved' && (
                                <span className="text-emerald-400 flex items-center gap-1.5">
                                    <Check size={14} /> Auto-saved
                                </span>
                            )}
                            {autoSaveStatus === 'error' && (
                                <span className="text-rose-400 flex items-center gap-1.5">
                                    <AlertCircle size={14} /> Auto-save Failed
                                </span>
                            )}
                            {autoSaveStatus === 'idle' && (
                                <span className="text-emerald-400/80 flex items-center gap-1.5">
                                    <Check size={14} className="text-emerald-400" /> Auto-save ON
                                </span>
                            )}
                        </div>

                        <button 
                            onClick={handleSave} 
                            disabled={saving}
                            className="bg-accent text-background px-6 py-3 rounded-full font-bold uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            Save
                        </button>
                    </div>
                </header>

                {uploading && (
                    <div className="fixed top-4 right-4 bg-accent text-background px-4 py-2 rounded-lg flex items-center gap-2 z-50 animate-pulse">
                        <Loader2 className="animate-spin" size={16} /> Uploading media...
                    </div>
                )}

                {/* Main Tab Navigation */}
                <div className="flex flex-wrap gap-3 mb-6 border-b border-white/10 pb-4">
                    {[
                        { id: 'homepage', label: 'HOMEPAGE (ALL CONTENT)' },
                        { id: 'gigs', label: 'SERVICES & GIGS (/gigs)' },
                        { id: 'creatives', label: 'ALL PROJECTS LIST (/creatives)' },
                        { id: 'global', label: 'THEME & AVAILABILITY' },
                        { id: 'slideshow', label: 'VISUAL SLIDESHOW' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-2.5 rounded-full uppercase tracking-wider font-heading text-xs sm:text-sm transition-all ${
                                activeTab === tab.id 
                                    ? 'bg-accent text-background shadow-xl scale-105 font-bold' 
                                    : 'bg-white/5 text-muted hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Sticky Quick Jump Bar for Homepage Tab */}
                {activeTab === 'homepage' && (
                    <div className="bg-[#141414]/95 border border-white/15 rounded-2xl p-3.5 mb-8 flex flex-wrap items-center gap-2 sticky top-4 z-30 backdrop-blur-md shadow-2xl">
                        <span className="text-xs font-bold text-accent uppercase tracking-wider px-2 flex items-center gap-1">
                            QUICK JUMP:
                        </span>
                        {[
                            { id: 'admin-hero', label: '1. Hero' },
                            { id: 'admin-welcome', label: '2. Welcome 1:1' },
                            { id: 'admin-portfolio', label: '3. Gigs / Portfolio' },
                            { id: 'admin-brands', label: '4. Brands & Logos' },
                            { id: 'admin-about', label: '5. About Me' },
                            { id: 'admin-work', label: '6. Work Exp' },
                            { id: 'admin-education', label: '7. Education' },
                            { id: 'admin-contact', label: '8. Contact' },
                        ].map(item => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                className="text-xs bg-white/10 hover:bg-accent hover:text-black text-white px-3 py-1.5 rounded-lg transition-all font-semibold uppercase tracking-wider"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                )}

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
                {(activeTab === 'homepage' || activeTab === 'hero') && (
                <section id="admin-hero" className="mb-12 bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                        <div>
                            <h2 className="text-2xl font-heading text-accent uppercase tracking-wider">1. Hero Section</h2>
                            <p className="text-muted text-sm mt-1 font-light">Main hero section displayed at the top of the homepage.</p>
                        </div>
                        <span className="bg-accent/15 border border-accent/30 text-accent px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider self-start sm:self-auto">
                            Aspect Ratio: 16:9 (Landscape) or 4:5 (Portrait)
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-muted text-sm mb-2 font-medium">Headline</label>
                            <input value={data.hero.headline} onChange={(e) => handleTextChange(e, 'hero', 'headline')} className="w-full bg-background border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none" />
                        </div>
                        <div>
                            <label className="block text-muted text-sm mb-2 font-medium">Accent Word</label>
                            <input value={data.hero.accentWord} onChange={(e) => handleTextChange(e, 'hero', 'accentWord')} className="w-full bg-background border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none" />
                        </div>
                        <div className="md:col-span-2">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-muted text-sm font-medium">Hero Media (Image or Video)</label>
                                <span className="text-xs text-accent font-mono">Recommended: 16:9 (1920x1080) or 4:5 (1080x1350)</span>
                            </div>
                            {isVideoUrl(data.hero.heroImage) ? (
                                <video src={data.hero.heroImage} autoPlay loop muted playsInline className="w-full h-56 object-cover rounded-xl mb-3" />
                            ) : (
                                <img src={data.hero.heroImage} alt="Hero" className="w-full h-56 object-cover rounded-xl mb-3" />
                            )}
                            <div className="flex gap-2">
                                <label className="flex-1 cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-semibold uppercase tracking-wider">
                                    <Upload size={16} /> Replace
                                    <input type="file" className="hidden" onChange={(e) => handleFileSelect(e, 'hero', 'heroImage', null, 'heroPhoto')} accept="image/*,video/*" />
                                </label>
                                {data.hero.heroImage && !isVideoUrl(data.hero.heroImage) && (
                                    <button onClick={() => handleEditImage(data.hero.heroImage, 'hero', 'heroImage', null, 'heroPhoto')} className="flex-1 cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-semibold uppercase tracking-wider">
                                        <Crop size={16} /> Edit
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
                )}

                {/* Section: Welcome */}
                {(activeTab === 'homepage' || activeTab === 'welcome') && (
                <section id="admin-welcome" className="mb-12 bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                        <div>
                            <h2 className="text-2xl font-heading text-accent uppercase tracking-wider">2. Welcome Section (1:1 Media)</h2>
                            <p className="text-muted text-sm mt-1 font-light">Upload images or videos in 1:1 square ratio with Drag & Drop support.</p>
                        </div>
                        <span className="bg-accent/10 border border-accent/30 text-accent px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto">
                            <Video size={14} /> 1:1 Video + Image Enabled
                        </span>
                    </div>

                    {/* Headline & Intro Text */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-muted text-sm mb-2 font-medium">Section Headline</label>
                            <input 
                                value={data.welcome?.headline || ''} 
                                onChange={(e) => handleTextChange(e, 'welcome', 'headline')} 
                                className="w-full bg-background border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none" 
                                placeholder="WELCOME TO MY BRAND"
                            />
                        </div>
                        <div>
                            <label className="block text-muted text-sm mb-2 font-medium">Introductory Description</label>
                            <textarea 
                                value={data.welcome?.introText || ''} 
                                onChange={(e) => handleTextChange(e, 'welcome', 'introText')} 
                                className="w-full bg-background border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none h-24 resize-none" 
                                placeholder="Short overview about your brand..."
                            />
                        </div>
                    </div>

                    {/* Drag & Drop 1:1 Media Cards */}
                    <h3 className="text-base font-heading text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Upload size={18} className="text-accent" /> Media Slides (1:1 Aspect Ratio - Drag & Drop Allowed)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { key: 'image1', label: 'Media Slide 1 (1:1 Ratio)', val: data.welcome?.image1 },
                            { key: 'image2', label: 'Media Slide 2 (1:1 Ratio)', val: data.welcome?.image2 }
                        ].map((mediaItem, idx) => {
                            const isDragActive = dragActiveField === `welcome-${mediaItem.key}`;
                            const isVid = isVideoUrl(mediaItem.val);

                            return (
                                <div key={mediaItem.key} className="bg-black/30 border border-white/10 rounded-2xl p-5 flex flex-col">
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-sm font-semibold text-white/90">{mediaItem.label}</label>
                                        {mediaItem.val && (
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                                                isVid ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                            }`}>
                                                {isVid ? <Play size={10} className="fill-purple-400" /> : <ImageIcon size={10} />}
                                                {isVid ? '1:1 Video' : '1:1 Image'}
                                            </span>
                                        )}
                                    </div>

                                    {/* Drag & Drop Zone Box */}
                                    <div 
                                        onDragOver={(e) => handleDragOver(e, `welcome-${mediaItem.key}`)}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDropFile(e, 'welcome', mediaItem.key, null, 'welcomeSquareMedia')}
                                        className={`relative w-full aspect-square rounded-2xl border-2 border-dashed overflow-hidden flex flex-col items-center justify-center transition-all duration-300 ${
                                            isDragActive 
                                                ? 'border-accent bg-accent/20 scale-[1.02]' 
                                                : 'border-white/20 bg-white/5 hover:border-accent/60'
                                        }`}
                                    >
                                        {mediaItem.val ? (
                                            isVid ? (
                                                <video 
                                                    src={mediaItem.val} 
                                                    autoPlay 
                                                    loop 
                                                    muted 
                                                    playsInline 
                                                    className="w-full h-full object-cover rounded-xl"
                                                />
                                            ) : (
                                                <img 
                                                    src={mediaItem.val} 
                                                    alt={`Welcome Media ${idx + 1}`} 
                                                    className="w-full h-full object-cover rounded-xl"
                                                />
                                            )
                                        ) : (
                                            <div className="text-center p-6 flex flex-col items-center">
                                                <Upload size={36} className="text-accent mb-3 animate-bounce" />
                                                <p className="text-white font-medium text-sm mb-1">Drag & Drop Video or Image Here</p>
                                                <p className="text-muted text-xs">Supports MP4, MOV, WEBM, PNG, JPG, WEBP (1:1 Ratio)</p>
                                            </div>
                                        )}

                                        {/* Drag Overlay Cue */}
                                        {isDragActive && (
                                            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center text-accent z-30 font-bold border-2 border-accent rounded-2xl">
                                                <Upload size={44} className="mb-2 animate-bounce text-accent" />
                                                <p className="uppercase tracking-widest text-sm text-white">Drop File to Upload</p>
                                                <span className="text-xs text-accent font-normal mt-1">Video / Image 1:1 Aspect Ratio</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 mt-4">
                                        <label className="flex-1 cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-xs font-semibold uppercase tracking-wider">
                                            <Upload size={14} /> Replace
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                onChange={(e) => handleFileSelect(e, 'welcome', mediaItem.key, null, 'welcomeSquareMedia')} 
                                                accept="image/*,video/*" 
                                            />
                                        </label>
                                        {mediaItem.val && !isVid && (
                                            <button 
                                                onClick={() => handleEditImage(mediaItem.val, 'welcome', mediaItem.key, null, 'welcomeSquareMedia')} 
                                                className="flex-1 cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-xs font-semibold uppercase tracking-wider"
                                            >
                                                <Crop size={14} /> Crop (1:1)
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
                )}

                {/* Section: About Us */}
                {(activeTab === 'homepage' || activeTab === 'about') && (
                <section id="admin-about" className="mb-12 bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                        <div>
                            <h2 className="text-2xl font-heading text-accent uppercase tracking-wider">5. About Me Section</h2>
                            <p className="text-muted text-sm mt-1 font-light">Biography text and featured portrait media.</p>
                        </div>
                        <span className="bg-accent/15 border border-accent/30 text-accent px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider self-start sm:self-auto">
                            Aspect Ratio: 1:1 Square (1080x1080) or 4:5 Portrait
                        </span>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-muted text-sm mb-2 font-medium">Headline</label>
                            <input value={data.aboutMe?.headline || ''} onChange={(e) => handleTextChange(e, 'aboutMe', 'headline')} className="w-full bg-background border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none" />
                        </div>
                        <div>
                            <label className="block text-muted text-sm mb-2 font-medium">Biography (New lines create paragraphs)</label>
                            <textarea 
                                value={data.aboutMe?.text || ''} 
                                onChange={(e) => handleTextChange(e, 'aboutMe', 'text')} 
                                className="w-full bg-background border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none h-48 resize-y" 
                            />
                        </div>
                        <div>
                            <label className="block text-muted text-sm mb-2 font-medium">Portrait Media (Image or Video)</label>
                            {isVideoUrl(data.aboutMe?.image) ? (
                                <video src={data.aboutMe?.image} autoPlay loop muted playsInline className="w-48 h-48 object-cover rounded-xl mb-3" />
                            ) : (
                                <img src={data.aboutMe?.image} alt="About Me" className="w-48 h-48 object-cover rounded-xl mb-3" />
                            )}
                            <div className="flex gap-2 w-48">
                                <label className="flex-1 cursor-pointer bg-white/10 hover:bg-white/20 px-2 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors text-xs font-semibold uppercase tracking-wider">
                                    <Upload size={14} /> Replace
                                    <input type="file" className="hidden" onChange={(e) => handleFileSelect(e, 'aboutMe', 'image', null, 'aboutImage')} accept="image/*,video/*" />
                                </label>
                                {data.aboutMe?.image && !isVideoUrl(data.aboutMe?.image) && (
                                    <button onClick={() => handleEditImage(data.aboutMe.image, 'aboutMe', 'image', null, 'aboutImage')} className="flex-1 cursor-pointer bg-white/10 hover:bg-white/20 px-2 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors text-xs font-semibold uppercase tracking-wider">
                                        <Crop size={14} /> Edit
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
                )}

                {/* Section: Work Experience */}
                {(activeTab === 'homepage' || activeTab === 'work') && (
                <section id="admin-work" className="mb-12 bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                        <div>
                            <h2 className="text-2xl font-heading text-accent uppercase tracking-wider">6. Work Experience Section</h2>
                            <p className="text-muted text-sm mt-1 font-light">Timeline items and featured experience cards.</p>
                        </div>
                        <span className="bg-accent/15 border border-accent/30 text-accent px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider self-start sm:self-auto">
                            Aspect Ratio: 16:9 Landscape (1920x1080)
                        </span>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-muted text-sm mb-2 font-medium">Section Headline</label>
                            <input value={data.workExperience?.headline || ''} onChange={(e) => handleTextChange(e, 'workExperience', 'headline')} className="w-full bg-background border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none" />
                        </div>
                        
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <label className="block text-muted text-sm font-medium">Experience Items</label>
                                <button onClick={handleAddWorkExperienceItem} className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm transition-colors font-semibold">
                                    <Plus size={14} /> Add Item
                                </button>
                            </div>
                            <div className="space-y-4">
                                {data.workExperience?.items?.map((item, index) => (
                                    <div key={index} className="bg-background border border-white/10 p-4 rounded-xl relative group">
                                        <button 
                                            onClick={() => handleRemoveWorkExperienceItem(index)}
                                            className="absolute top-4 right-4 text-white/40 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-white/50 text-xs mb-1 font-medium">Year(s)</label>
                                                <input 
                                                    value={item.year} 
                                                    onChange={(e) => handleWorkExperienceItemChange(index, 'year', e.target.value)}
                                                    placeholder="e.g. 2023 - Present"
                                                    className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-sm text-white focus:border-accent outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-white/50 text-xs mb-1 font-medium">Company / Role</label>
                                                <input 
                                                    value={item.company} 
                                                    onChange={(e) => handleWorkExperienceItemChange(index, 'company', e.target.value)}
                                                    placeholder="e.g. Lead Designer at Apple"
                                                    className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-sm text-white focus:border-accent outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-white/50 text-xs mb-1 font-medium">Description</label>
                                            <textarea 
                                                value={item.description} 
                                                onChange={(e) => handleWorkExperienceItemChange(index, 'description', e.target.value)}
                                                placeholder="Describe your role and impact..."
                                                className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-sm text-white focus:border-accent outline-none h-20 resize-y"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 border-t border-white/10 pt-8">
                            <div>
                                <label className="block text-muted text-sm mb-2 font-medium">Media 1 (Top Image or Video)</label>
                                {isVideoUrl(data.workExperience?.image1) ? (
                                    <video src={data.workExperience?.image1} autoPlay loop muted playsInline className="w-full h-48 object-cover rounded-xl mb-3" />
                                ) : (
                                    <img src={data.workExperience?.image1} alt="Work 1" className="w-full h-48 object-cover rounded-xl mb-3" />
                                )}
                                <div className="flex gap-2">
                                    <label className="flex-1 cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-semibold uppercase tracking-wider">
                                        <Upload size={16} /> Replace
                                        <input type="file" className="hidden" onChange={(e) => handleFileSelect(e, 'workExperience', 'image1', null, 'experienceImage')} accept="image/*,video/*" />
                                    </label>
                                    {data.workExperience?.image1 && !isVideoUrl(data.workExperience?.image1) && (
                                        <button onClick={() => handleEditImage(data.workExperience.image1, 'workExperience', 'image1', null, 'experienceImage')} className="flex-1 cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-semibold uppercase tracking-wider">
                                            <Crop size={16} /> Edit
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-muted text-sm mb-2 font-medium">Media 2 (Bottom Image or Video)</label>
                                {isVideoUrl(data.workExperience?.image2) ? (
                                    <video src={data.workExperience?.image2} autoPlay loop muted playsInline className="w-full h-48 object-cover rounded-xl mb-3" />
                                ) : (
                                    <img src={data.workExperience?.image2} alt="Work 2" className="w-full h-48 object-cover rounded-xl mb-3" />
                                )}
                                <div className="flex gap-2">
                                    <label className="flex-1 cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-semibold uppercase tracking-wider">
                                        <Upload size={16} /> Replace
                                        <input type="file" className="hidden" onChange={(e) => handleFileSelect(e, 'workExperience', 'image2', null, 'experienceImage')} accept="image/*,video/*" />
                                    </label>
                                    {data.workExperience?.image2 && !isVideoUrl(data.workExperience?.image2) && (
                                        <button onClick={() => handleEditImage(data.workExperience.image2, 'workExperience', 'image2', null, 'experienceImage')} className="flex-1 cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-semibold uppercase tracking-wider">
                                            <Crop size={16} /> Edit
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                )}

                {/* Section: Education */}
                {(activeTab === 'homepage' || activeTab === 'education') && (
                <section id="admin-education" className="mb-12 bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                        <div>
                            <h2 className="text-2xl font-heading text-accent uppercase tracking-wider">7. Education Section</h2>
                            <p className="text-muted text-sm mt-1 font-light">Academic background items and banner media.</p>
                        </div>
                        <span className="bg-accent/15 border border-accent/30 text-accent px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider self-start sm:self-auto">
                            Aspect Ratio: 16:9 Landscape (1920x1080)
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Text Content */}
                        <div className="flex flex-col gap-6">
                            <div>
                                <label className="block text-muted text-sm mb-2 font-medium">Headline</label>
                                <input value={data.education?.headline || ''} onChange={(e) => handleTextChange(e, 'education', 'headline')} className="w-full bg-background border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none" />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-muted text-sm font-medium">Timeline Items</label>
                                    <button onClick={handleAddEducationItem} className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm transition-colors font-semibold">
                                        <Plus size={16} /> Add Item
                                    </button>
                                </div>
                                
                                {data.education?.items?.map((item, index) => (
                                    <div key={index} className="bg-background border border-white/10 p-4 rounded-xl mb-4 relative group">
                                        <button 
                                            onClick={() => handleRemoveEducationItem(index)}
                                            className="absolute top-2 right-2 text-red-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        
                                        <div className="grid grid-cols-2 gap-4 mb-4 mt-2">
                                            <div>
                                                <label className="block text-white/50 text-xs mb-1 font-medium">Year(s)</label>
                                                <input 
                                                    value={item.year || ''} 
                                                    onChange={(e) => handleEducationItemChange(index, 'year', e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white"
                                                    placeholder="e.g. 2018 - 2022"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-white/50 text-xs mb-1 font-medium">Institution</label>
                                                <input 
                                                    value={item.institution || ''} 
                                                    onChange={(e) => handleEducationItemChange(index, 'institution', e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white"
                                                    placeholder="e.g. University Name"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-white/50 text-xs mb-1 font-medium">Description</label>
                                            <textarea 
                                                value={item.description || ''} 
                                                onChange={(e) => handleEducationItemChange(index, 'description', e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white h-20 resize-none"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Images */}
                        <div className="flex flex-col gap-6">
                            <div>
                                <label className="block text-muted text-sm mb-2 font-medium">Banner Media (Image or Video)</label>
                                {isVideoUrl(data.education?.bannerImage) ? (
                                    <video src={data.education?.bannerImage} autoPlay loop muted playsInline className="w-full h-48 object-cover rounded-xl mb-3" />
                                ) : (
                                    <img src={data.education?.bannerImage} alt="Education Banner" className="w-full h-48 object-cover rounded-xl mb-3" />
                                )}
                                <div className="flex gap-2">
                                    <label className="flex-1 cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-semibold uppercase tracking-wider">
                                        <Upload size={16} /> Replace
                                        <input type="file" className="hidden" onChange={(e) => handleFileSelect(e, 'education', 'bannerImage', null, 'educationBanner')} accept="image/*,video/*" />
                                    </label>
                                    {data.education?.bannerImage && !isVideoUrl(data.education?.bannerImage) && (
                                        <button onClick={() => handleEditImage(data.education.bannerImage, 'education', 'bannerImage', null, 'educationBanner')} className="flex-1 cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-semibold uppercase tracking-wider">
                                            <Crop size={16} /> Edit
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                )}

                {/* Section: Services & Gigs (/gigs) */}
                {activeTab === 'gigs' && (
                <section className="mb-12 bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                        <div>
                            <h2 className="text-2xl font-heading text-accent uppercase tracking-wider">Services & Gigs Page (/gigs)</h2>
                            <p className="text-muted text-sm mt-1 font-light">Manage offered service packages, prices, ratings, and preview images/videos for the /gigs page.</p>
                        </div>
                        <button 
                            onClick={() => {
                                setData(prev => ({
                                    ...prev,
                                    gigs: [
                                        ...(prev.gigs || []),
                                        {
                                            id: Date.now(),
                                            title: 'New Service Package',
                                            price: 150,
                                            rating: 5.0,
                                            reviews: 1,
                                            image: ''
                                        }
                                    ]
                                }));
                            }} 
                            className="bg-accent text-background px-4 py-2 rounded-full font-bold uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-all text-xs self-start sm:self-auto"
                        >
                            <Plus size={14} /> Add New Gig
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(data.gigs || []).map((gig, gIdx) => (
                            <div key={gIdx} className="bg-background border border-white/10 p-5 rounded-2xl relative group flex flex-col">
                                <button 
                                    onClick={() => {
                                        setData(prev => ({
                                            ...prev,
                                            gigs: (prev.gigs || []).filter((_, i) => i !== gIdx)
                                        }));
                                    }}
                                    className="absolute top-4 right-4 text-red-500 hover:text-red-400 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>

                                <div className="space-y-4 mb-4">
                                    <div>
                                        <label className="block text-white/50 text-xs mb-1 font-medium">Gig Title / Service Package</label>
                                        <input 
                                            value={gig.title || ''} 
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setData(prev => {
                                                    const newGigs = [...(prev.gigs || [])];
                                                    newGigs[gIdx] = { ...newGigs[gIdx], title: val };
                                                    return { ...prev, gigs: newGigs };
                                                });
                                            }} 
                                            className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none text-sm" 
                                            placeholder="e.g. I will design a modern UI/UX website"
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-white/50 text-xs mb-1 font-medium">Price ($)</label>
                                            <input 
                                                type="number"
                                                value={gig.price ?? ''} 
                                                onChange={(e) => {
                                                    const val = Number(e.target.value);
                                                    setData(prev => {
                                                        const newGigs = [...(prev.gigs || [])];
                                                        newGigs[gIdx] = { ...newGigs[gIdx], price: val };
                                                        return { ...prev, gigs: newGigs };
                                                    });
                                                }} 
                                                className="w-full bg-white/5 border border-white/20 rounded-lg p-2.5 text-white focus:border-accent outline-none text-sm" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-white/50 text-xs mb-1 font-medium">Rating</label>
                                            <input 
                                                type="number"
                                                step="0.1"
                                                value={gig.rating ?? 5.0} 
                                                onChange={(e) => {
                                                    const val = Number(e.target.value);
                                                    setData(prev => {
                                                        const newGigs = [...(prev.gigs || [])];
                                                        newGigs[gIdx] = { ...newGigs[gIdx], rating: val };
                                                        return { ...prev, gigs: newGigs };
                                                    });
                                                }} 
                                                className="w-full bg-white/5 border border-white/20 rounded-lg p-2.5 text-white focus:border-accent outline-none text-sm" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-white/50 text-xs mb-1 font-medium">Reviews</label>
                                            <input 
                                                type="number"
                                                value={gig.reviews ?? 0} 
                                                onChange={(e) => {
                                                    const val = Number(e.target.value);
                                                    setData(prev => {
                                                        const newGigs = [...(prev.gigs || [])];
                                                        newGigs[gIdx] = { ...newGigs[gIdx], reviews: val };
                                                        return { ...prev, gigs: newGigs };
                                                    });
                                                }} 
                                                className="w-full bg-white/5 border border-white/20 rounded-lg p-2.5 text-white focus:border-accent outline-none text-sm" 
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-white/50 text-xs font-medium">Gig Media (Image or Video)</label>
                                            <span className="text-[11px] text-accent font-mono">Aspect Ratio: 16:9 or 1:1</span>
                                        </div>
                                        {isVideoUrl(gig.image) ? (
                                            <video src={gig.image} autoPlay loop muted playsInline className="w-full h-40 object-cover rounded-xl mb-3" />
                                        ) : (
                                            <img src={gig.image || '/ai-images/gallery_1_1784234838549.png'} alt="Gig" className="w-full h-40 object-cover rounded-xl mb-3" />
                                        )}
                                        <div className="flex gap-2">
                                            <label className="flex-1 cursor-pointer bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors text-xs font-semibold uppercase tracking-wider">
                                                <Upload size={14} /> Replace
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (!file) return;
                                                        processUploadedFile(file, 'gigs', 'image', gIdx, 'projectGallery');
                                                    }} 
                                                    accept="image/*,video/*" 
                                                />
                                            </label>
                                            {gig.image && !isVideoUrl(gig.image) && (
                                                <button 
                                                    onClick={() => handleEditImage(gig.image, 'gigs', 'image', gIdx, 'projectGallery')} 
                                                    className="flex-1 cursor-pointer bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors text-xs font-semibold uppercase tracking-wider"
                                                >
                                                    <Crop size={14} /> Edit
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
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
                                        <div className="flex flex-col gap-2">
                                            <label className="cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm">
                                                <Upload size={14} /> Replace
                                                <input type="file" className="hidden" onChange={(e) => handleProjectFileSelect(e, pIdx, true, null, 'projectCover')} accept="image/*,video/*" />
                                            </label>
                                            {project.coverImage && (
                                                <button onClick={() => handleEditImage(project.coverImage, 'projectPortfolio', 'projects', pIdx, 'projectCover', true, null)} className="cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm">
                                                    <Crop size={14} /> Edit
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-muted text-sm mb-2">Gallery Images</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {project.gallery?.map((img, gIdx) => (
                                            <div key={gIdx} className="relative group/gal">
                                                <img src={img} alt={`Gallery ${gIdx}`} className="w-full h-24 object-cover rounded-lg" />
                                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/gal:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEditImage(img, 'projectPortfolio', 'projects', pIdx, 'projectGallery', false, gIdx)} className="bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-1 rounded-md">
                                                        <Crop size={12} />
                                                    </button>
                                                    <button onClick={() => handleRemoveGalleryImage(pIdx, gIdx)} className="bg-red-500/80 hover:bg-red-500 text-white p-1 rounded-md">
                                                        <XIcon size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center h-24 transition-colors">
                                            <Plus size={20} className="text-white/50 mb-1" />
                                            <span className="text-xs text-white/50">Add Image</span>
                                            <input type="file" className="hidden" onChange={(e) => handleProjectFileSelect(e, pIdx, false, null, 'projectGallery')} accept="image/*,video/*" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                )}

                {/* Section: Project Portfolio (Homepage) */}
                {(activeTab === 'homepage' || activeTab === 'gallery') && (
                <section id="admin-portfolio" className="mb-12 bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                        <div>
                            <h2 className="text-2xl font-heading text-accent uppercase tracking-wider">3. Gigs & Project Portfolio (Homepage Cards)</h2>
                            <p className="text-muted text-sm mt-1 font-light">Manage headline, description, drag & drop media cards, and crop aspect ratio for the homepage portfolio section.</p>
                        </div>
                        <span className="bg-accent/15 border border-accent/30 text-accent px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider self-start sm:self-auto">
                            Aspect Ratio: 1:1 Square (1080x1080) or 16:9 Landscape
                        </span>
                    </div>

                    {/* Headline & Description Editor */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-muted text-sm mb-2 font-medium">Section Headline</label>
                            <input 
                                value={data.projectPortfolio?.headline || ''} 
                                onChange={(e) => handleTextChange(e, 'projectPortfolio', 'headline')} 
                                className="w-full bg-background border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none font-heading uppercase" 
                                placeholder="PROJECT PORTFOLIO"
                            />
                        </div>
                        <div>
                            <label className="block text-muted text-sm mb-2 font-medium">Description Text</label>
                            <textarea 
                                value={data.projectPortfolio?.text || ''} 
                                onChange={(e) => handleTextChange(e, 'projectPortfolio', 'text')} 
                                className="w-full bg-background border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none h-24 resize-none" 
                                placeholder="A mix of brand campaigns, celebrity collaborations..."
                            />
                        </div>
                    </div>

                    {/* Homepage Portfolio Images Grid */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base font-heading text-white uppercase tracking-wider flex items-center gap-2">
                            <Upload size={18} className="text-accent" /> Homepage Featured Images (Drag & Drop Allowed)
                        </h3>
                        <label className="cursor-pointer bg-accent text-background px-4 py-2 rounded-full font-bold uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-all text-xs">
                            <Plus size={14} /> Add Image
                            <input 
                                type="file" 
                                className="hidden" 
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    const newIdx = data.projectPortfolio?.images?.length || 0;
                                    processUploadedFile(file, 'projectPortfolio', 'images', newIdx, 'projectGallery');
                                }} 
                                accept="image/*,video/*" 
                            />
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {data.projectPortfolio?.images?.map((img, index) => {
                            const isDragActive = dragActiveField === `projectPortfolio-images-${index}`;
                            const isVid = isVideoUrl(img);

                            return (
                                <div key={index} className="bg-black/30 border border-white/10 rounded-2xl p-4 flex flex-col">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs font-semibold text-white/90">Homepage Image #{index + 1}</label>
                                        <button 
                                            onClick={() => {
                                                setData(prev => {
                                                    const updatedImages = (prev.projectPortfolio?.images || []).filter((_, i) => i !== index);
                                                    return {
                                                        ...prev,
                                                        projectPortfolio: { ...prev.projectPortfolio, images: updatedImages }
                                                    };
                                                });
                                            }}
                                            className="text-red-400 hover:text-red-300 p-1 transition-colors"
                                            title="Delete Image"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    {/* Drag & Drop Zone Box */}
                                    <div 
                                        onDragOver={(e) => handleDragOver(e, `projectPortfolio-images-${index}`)}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDropFile(e, 'projectPortfolio', 'images', index, 'projectGallery')}
                                        className={`relative w-full h-48 rounded-xl border-2 border-dashed overflow-hidden flex flex-col items-center justify-center transition-all duration-300 ${
                                            isDragActive 
                                                ? 'border-accent bg-accent/20 scale-[1.02]' 
                                                : 'border-white/20 bg-white/5 hover:border-accent/60'
                                        }`}
                                    >
                                        {img ? (
                                            isVid ? (
                                                <video src={img} autoPlay loop muted playsInline className="w-full h-full object-cover rounded-lg" />
                                            ) : (
                                                <img src={img} alt={`Homepage Portfolio ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                                            )
                                        ) : (
                                            <div className="text-center p-4">
                                                <Upload size={28} className="text-accent mb-2 animate-bounce mx-auto" />
                                                <p className="text-white text-xs font-medium">Drag & Drop File Here</p>
                                            </div>
                                        )}

                                        {isDragActive && (
                                            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center text-accent z-30 font-bold border-2 border-accent rounded-xl">
                                                <Upload size={32} className="mb-2 animate-bounce text-accent" />
                                                <p className="uppercase tracking-widest text-xs text-white">Drop File to Upload</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 mt-3">
                                        <label className="flex-1 cursor-pointer bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors text-xs font-semibold uppercase tracking-wider">
                                            <Upload size={12} /> Replace
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                onChange={(e) => handleFileSelect(e, 'projectPortfolio', 'images', index, 'projectGallery')} 
                                                accept="image/*,video/*" 
                                            />
                                        </label>
                                        {img && !isVid && (
                                            <button 
                                                onClick={() => handleEditImage(img, 'projectPortfolio', 'images', index, 'projectGallery')} 
                                                className="flex-1 cursor-pointer bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors text-xs font-semibold uppercase tracking-wider"
                                            >
                                                <Crop size={12} /> Crop
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
                )}

                {/* Section: Brands & Logos */}
                {(activeTab === 'homepage' || activeTab === 'brands') && (
                <section id="admin-brands" className="mb-12 bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                        <div>
                            <h2 className="text-2xl font-heading text-accent uppercase tracking-wider">4. Brands & Logos (Marquee)</h2>
                            <p className="text-muted text-sm mt-1 font-light">Manage brand logos displayed in the marquee banner on the Homepage.</p>
                        </div>
                        <label className="cursor-pointer bg-accent text-background px-4 py-2 rounded-full font-bold uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-all text-xs self-start sm:self-auto">
                            <Plus size={14} /> Add Brand Logo
                            <input 
                                type="file" 
                                className="hidden" 
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    const newIdx = data.brands?.length || 0;
                                    processUploadedFile(file, 'brands', newIdx, null, 'brandLogo');
                                }} 
                                accept="image/*" 
                            />
                        </label>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        {(data.brands || []).map((brandUrl, index) => (
                            <div key={index} className="relative group bg-black/40 border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center h-28">
                                <img src={brandUrl} alt={`Brand ${index + 1}`} className="max-h-12 max-w-full object-contain filter invert opacity-80" />
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => {
                                            setData(prev => ({
                                                ...prev,
                                                brands: (prev.brands || []).filter((_, i) => i !== index)
                                            }));
                                        }}
                                        className="bg-red-500/80 hover:bg-red-500 text-white p-1 rounded-md"
                                        title="Delete Logo"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
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
                                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover/slide:opacity-100 transition-opacity">
                                        <button onClick={() => handleEditImage(imgUrl, 'aboutMe', 'slideshowImages', index, 'slideshowImage')} className="bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-1.5 rounded-md">
                                            <Crop size={14} />
                                        </button>
                                        <button onClick={() => {
                                            setData(prev => {
                                                const newImages = [...(prev.aboutMe?.slideshowImages || [])];
                                                newImages.splice(index, 1);
                                                return { ...prev, aboutMe: { ...prev.aboutMe, slideshowImages: newImages } };
                                            });
                                        }} className="bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded-md">
                                            <XIcon size={14} />
                                        </button>
                                    </div>
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
                            <input type="file" className="hidden" onChange={(e) => handleFileSelect(e, 'aboutMe', 'slideshowImages', null, 'slideshowImage')} accept="image/*,video/*" />
                        </label>
                    </div>
                </section>
                )}

                {/* Section: Contact */}
                {(activeTab === 'homepage' || activeTab === 'contact') && (
                <section id="admin-contact" className="mb-12 bg-white/5 p-6 rounded-2xl border border-white/10">
                    <h2 className="text-2xl font-heading text-accent mb-6 uppercase tracking-wider">8. Contact Section</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <label className="block text-muted text-sm mb-2 font-medium">Headline</label>
                            <input value={data.contact?.headline || ''} onChange={(e) => handleTextChange(e, 'contact', 'headline')} className="w-full bg-background border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none" />
                        </div>
                        <div className="md:row-span-2">
                            <label className="block text-muted text-sm mb-2 font-medium">Contact Portrait (Image or Video)</label>
                            {isVideoUrl(data.contact?.image) ? (
                                <video src={data.contact?.image} autoPlay loop muted playsInline className="w-full h-48 object-cover rounded-xl mb-3" />
                            ) : (
                                <img src={data.contact?.image} alt="Contact" className="w-full h-48 object-cover rounded-xl mb-3" />
                            )}
                            <div className="flex gap-2">
                                <label className="flex-1 cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-semibold uppercase tracking-wider">
                                    <Upload size={16} /> Replace
                                    <input type="file" className="hidden" onChange={(e) => handleFileSelect(e, 'contact', 'image', null, 'contactImage')} accept="image/*,video/*" />
                                </label>
                                {data.contact?.image && !isVideoUrl(data.contact?.image) && (
                                    <button onClick={() => handleEditImage(data.contact.image, 'contact', 'image', null, 'contactImage')} className="flex-1 cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-semibold uppercase tracking-wider">
                                        <Crop size={16} /> Edit
                                    </button>
                                )}
                            </div>
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
            {cropModal.isOpen && cropModal.configKey && imageFrameConfigs[cropModal.configKey] && (
                <ImageCropModal
                    imageSrc={cropModal.imageSrc}
                    aspectRatio={imageFrameConfigs[cropModal.configKey].aspectRatio}
                    outputWidth={imageFrameConfigs[cropModal.configKey].outputWidth}
                    outputHeight={imageFrameConfigs[cropModal.configKey].outputHeight}
                    frameLabel={imageFrameConfigs[cropModal.configKey].label}
                    onConfirm={handleCropSave}
                    onCancel={() => setCropModal({ isOpen: false, imageSrc: null })}
                />
            )}
        </div>
    );
};

export default Admin;
