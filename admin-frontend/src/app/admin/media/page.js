'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSave, 
  FiUploadCloud, 
  FiImage, 
  FiVideo, 
  FiAlertCircle, 
  FiPlus, 
  FiTrash2, 
  FiChevronUp, 
  FiChevronDown,
  FiPackage,
  FiStar,
  FiMap,
  FiDollarSign,
  FiFileText,
  FiUsers,
  FiMessageSquare,
  FiCheckCircle
} from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { adminAPI } from '@/lib/AdminApi';
import toast from 'react-hot-toast';

export default function MediaManagement() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab ] = useState('hero');
  
  const [settings, setSettings] = useState({
    hero_sections: [],
    featured_safaris: [],
    destinations_sections: [],
    luxury_stays_sections: [],
    exclusive_offers_sections: [],
    blog_posts_sections: [],
    showcase_video_section: { url: '', title: '', description: '', thumbnail: '' },
    partners_section: [],
    testimonials_section: [],
    why_choose_us_section: []
  });

  // Fetch current settings
  useEffect(() => {
    const fetchCurrentSettings = async () => {
      try {
        const response = await adminAPI.getSettings();
        const result = response.data;
        
        if (result.status === 'success' && result.data) {
          setSettings(prev => ({
            ...prev,
            ...result.data,
            hero_sections: result.data.hero_sections || [],
            featured_safaris: result.data.featured_safaris || [],
            destinations_sections: result.data.destinations_sections || [],
            luxury_stays_sections: result.data.luxury_stays_sections || [],
            exclusive_offers_sections: result.data.exclusive_offers_sections || [],
            blog_posts_sections: result.data.blog_posts_sections || [],
            showcase_video_section: result.data.showcase_video_section || prev.showcase_video_section,
            partners_section: result.data.partners_section || [],
            testimonials_section: result.data.testimonials_section || [],
            why_choose_us_section: result.data.why_choose_us_section || []
          }));
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
        toast.error('Failed to load site content.');
      }
    };
    fetchCurrentSettings();
  }, []);

  const handleAddField = (section) => {
    const newItems = [...settings[section]];
    const newItem = { id: Date.now() };
    
    // Add default fields based on section
    if (section === 'hero_sections') {
      Object.assign(newItem, { title: '', subtitle: '', description: '', image: '' });
    } else if (section === 'exclusive_offers_sections') {
      Object.assign(newItem, { title: '', description: '', discount: 0, code: '', image: '', type: '' });
    } else if (section === 'partners_section') {
      Object.assign(newItem, { name: '', logo: '' });
    } else if (section === 'testimonials_section') {
      Object.assign(newItem, { name: '', location: '', avatar: '', tour: '', rating: 5, text: '', date: '' });
    } else if (section === 'why_choose_us_section') {
      Object.assign(newItem, { title: '', description: '', icon: 'FiStar', color: 'from-primary-500 to-primary-700' });
    } else {
      Object.assign(newItem, { name: '', title: '', image: '', description: '' });
    }
    
    setSettings({ ...settings, [section]: [...newItems, newItem] });
  };

  const handleRemoveField = (section, index) => {
    const newItems = [...settings[section]];
    newItems.splice(index, 1);
    setSettings({ ...settings, [section]: newItems });
  };

  const handleInputChange = (section, index, field, value) => {
    if (index === null) {
      setSettings({ ...settings, [section]: { ...settings[section], [field]: value } });
    } else {
      const newItems = [...settings[section]];
      newItems[index] = { ...newItems[index], [field]: value };
      setSettings({ ...settings, [section]: newItems });
    }
  };

  const handleFileUpload = async (section, index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const isVideo = file.mimetype?.startsWith('video') || file.type?.startsWith('video');
    const formData = new FormData();
    formData.append('media', file);

    setLoading(true);
    const toastId = toast.loading('Uploading media...');

    try {
      const response = await adminAPI.uploadMedia(formData, isVideo);
      const url = response.data.url;
      
      if (index === null) {
        handleInputChange(section, null, isVideo ? 'url' : 'thumbnail', url);
      } else {
        const fieldName = section === 'partners_section' ? 'logo' : (section === 'testimonials_section' ? 'avatar' : 'image');
        handleInputChange(section, index, fieldName, url);
      }
      toast.success('Uploaded successfully!', { id: toastId });
    } catch (error) {
      toast.error('Upload failed.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const toastId = toast.loading('Saving site content...');

    try {
      await adminAPI.updateSettings(settings);
      toast.success('Site content saved successfully!', { id: toastId });
    } catch (error) {
      toast.error('Failed to save content.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const renderSectionHeader = (title, description, Icon) => (
    <div className="flex items-center space-x-3 mb-6 border-b border-gray-100 pb-4">
      <div className="p-3 bg-primary-50 text-primary-600 rounded-xl shadow-sm">
        <Icon size={24} />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-600 font-bold">{description}</p>
      </div>
    </div>
  );

  const renderMediaCard = (section, index, item, fields) => {
    let imageField = item.image;
    if (section === 'partners_section') imageField = item.logo;
    if (section === 'testimonials_section') imageField = item.avatar;
    
    return (
      <div key={item.id || index} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image Preview / Upload */}
          <div className="w-full md:w-48 h-32 bg-gray-50 rounded-2xl overflow-hidden relative flex-shrink-0 group border border-gray-100">
            {imageField ? (
              <img src={imageField} alt={item.title || item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <FiImage size={32} />
                <span className="text-xs mt-2 font-bold uppercase tracking-tight">No Media</span>
              </div>
            )}
            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => handleFileUpload(section, index, e)} 
              />
              <FiUploadCloud className="text-white w-8 h-8" />
            </label>
          </div>

          {/* Inputs */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(field => (
              <div key={field.name} className={field.fullWidth ? 'md:col-span-2' : ''}>
                <label className="block text-[10px] font-bold text-gray-900 uppercase tracking-widest mb-1">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={item[field.name] || ''}
                    onChange={(e) => handleInputChange(section, index, field.name, e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:outline-none placeholder-gray-400 font-bold leading-relaxed"
                    rows={field.rows || 3}
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                  />
                ) : (
                  <input
                    type={field.type || 'text'}
                    value={item[field.name] || ''}
                    onChange={(e) => handleInputChange(section, index, field.name, e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:outline-none placeholder-gray-400 font-bold"
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-row md:flex-col justify-end space-x-2 md:space-x-0 md:space-y-2">
            <button 
              onClick={() => handleRemoveField(section, index)}
              className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors shadow-sm bg-white"
              title="Delete Item"
            >
              <FiTrash2 size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleRestoreDefaults = async () => {
    if (!confirm('This will overwrite current site content with the defaults from the main page. Continue?')) return;
    
    setLoading(true);
    const toastId = toast.loading('Syncing with defaults...');
    try {
      await adminAPI.restoreDefaults();
      toast.success('Synced successfully! Refreshing...', { id: toastId });
      // Refresh data
      const response = await adminAPI.getSettings();
      if (response.data.status === 'success') {
        setSettings(prev => ({ ...prev, ...response.data.data }));
      }
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast.error('Sync failed.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {id: 'hero', label: 'Hero Slider', icon: FiImage},
    {id: 'safaris', label: 'Safaris', icon: FiPackage},
    {id: 'destinations', label: 'Destinations', icon: FiStar},
    {id: 'stays', label: 'Luxury Stays', icon: FiMap},
    {id: 'offers', label: 'Offers', icon: FiDollarSign},
    {id: 'blog', label: 'Blog Feed', icon: FiFileText},
    {id: 'video', label: 'Video', icon: FiVideo},
    {id: 'partners', label: 'Partners', icon: FiUsers},
    {id: 'testimonials', label: 'Reviews', icon: FiMessageSquare},
    {id: 'benefits', label: 'Benefits', icon: FiCheckCircle},
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50/30">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-black text-gray-900 tracking-tight">Site Content Management</h1>
          <p className="text-gray-600 font-bold uppercase text-xs tracking-widest mt-1">Full Administrative control over homepage elements</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRestoreDefaults}
            disabled={loading}
            className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all flex items-center shadow-sm"
          >
            <FiUploadCloud className="mr-2 text-primary-600" />
            Restore Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-8 py-3 bg-primary-600 text-white font-black rounded-2xl hover:bg-primary-700 transition-all flex items-center shadow-luxury uppercase tracking-widest text-xs"
          >
            <FiSave className="mr-2" />
            Publish Changes
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 overflow-x-auto pb-4 scrollbar-hide border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-primary-600 shadow-md border border-gray-100' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-8">
        {activeTab === 'hero' && (
          <div className="space-y-6">
            {renderSectionHeader('Hero Slider', 'Top-of-page interactive highlights', FiImage)}
            {settings.hero_sections.map((item, index) => 
              renderMediaCard('hero_sections', index, item, [
                { name: 'subtitle', label: 'Badge Text', fullWidth: false },
                { name: 'title', label: 'Heading', fullWidth: false },
                { name: 'description', label: 'Description Content', type: 'textarea', fullWidth: true },
              ])
            )}
            <button onClick={() => handleAddField('hero_sections')} className="w-full py-6 border-2 border-dashed border-gray-300 rounded-3xl text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-all flex items-center justify-center space-x-2 font-black uppercase tracking-widest text-xs bg-white/50">
              <FiPlus />
              <span>Add New Hero Slide</span>
            </button>
          </div>
        )}

        {activeTab === 'safaris' && (
          <div className="space-y-6">
            {renderSectionHeader('Featured Safaris', 'High-priority tour packages', FiPackage)}
            {settings.featured_safaris.map((item, index) => 
              renderMediaCard('featured_safaris', index, item, [
                { name: 'name', label: 'Package Name', fullWidth: false },
                { name: 'badge', label: 'Highlight Badge', fullWidth: false },
                { name: 'destination', label: 'Region', fullWidth: false },
                { name: 'price', label: 'Base Price ($)', type: 'number', fullWidth: false },
              ])
            )}
            <button onClick={() => handleAddField('featured_safaris')} className="w-full py-6 border-2 border-dashed border-gray-300 rounded-3xl text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-all flex items-center justify-center space-x-2 font-black uppercase tracking-widest text-xs bg-white/50">
              <FiPlus />
              <span>Add Proposed Safari</span>
            </button>
          </div>
        )}

        {activeTab === 'destinations' && (
          <div className="space-y-6">
            {renderSectionHeader('Key Destinations', 'Global locations and experiences', FiStar)}
            {settings.destinations_sections.map((item, index) => 
              renderMediaCard('destinations_sections', index, item, [
                { name: 'name', label: 'Location Tile', fullWidth: false },
                { name: 'country', label: 'Country / State', fullWidth: false },
                { name: 'description', label: 'Experience Summary', type: 'textarea', fullWidth: true },
              ])
            )}
            <button onClick={() => handleAddField('destinations_sections')} className="w-full py-6 border-2 border-dashed border-gray-300 rounded-3xl text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-all flex items-center justify-center space-x-2 font-black uppercase tracking-widest text-xs bg-white/50">
              <FiPlus />
              <span>Add New Destination</span>
            </button>
          </div>
        )}

        {activeTab === 'stays' && (
          <div className="space-y-6">
            {renderSectionHeader('Luxury Stays', 'Premium hotels and wilderness camps', FiMap)}
            {settings.luxury_stays_sections.map((item, index) => 
              renderMediaCard('luxury_stays_sections', index, item, [
                { name: 'name', label: 'Property Title', fullWidth: false },
                { name: 'badge', label: 'Luxury Class', fullWidth: false },
                { name: 'price', label: 'Nightly Rate ($)', type: 'number', fullWidth: false },
                { name: 'description', label: 'Stay Overview', type: 'textarea', fullWidth: true },
              ])
            )}
            <button onClick={() => handleAddField('luxury_stays_sections')} className="w-full py-6 border-2 border-dashed border-gray-300 rounded-3xl text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-all flex items-center justify-center space-x-2 font-black uppercase tracking-widest text-xs bg-white/50">
              <FiPlus />
              <span>Register New Property</span>
            </button>
          </div>
        )}

        {activeTab === 'offers' && (
          <div className="space-y-6">
            {renderSectionHeader('Promotional Offers', 'Conversion-focused deals', FiDollarSign)}
            {settings.exclusive_offers_sections.map((item, index) => 
              renderMediaCard('exclusive_offers_sections', index, item, [
                { name: 'title', label: 'Deal Headline', fullWidth: false },
                { name: 'code', label: 'Access Code', fullWidth: false },
                { name: 'discount', label: 'Reduction %', type: 'number', fullWidth: false },
                { name: 'description', label: 'Offer Particulars', type: 'textarea', fullWidth: true },
              ])
            )}
            <button onClick={() => handleAddField('exclusive_offers_sections')} className="w-full py-6 border-2 border-dashed border-gray-300 rounded-3xl text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-all flex items-center justify-center space-x-2 font-black uppercase tracking-widest text-xs bg-white/50">
              <FiPlus />
              <span>Create New Offer</span>
            </button>
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="space-y-6">
            {renderSectionHeader('Blog Highlights', 'Latest travel insights and reports', FiFileText)}
            {settings.blog_posts_sections.map((item, index) => 
              renderMediaCard('blog_posts_sections', index, item, [
                { name: 'title', label: 'Post Title', fullWidth: false },
                { name: 'category', label: 'Segment', fullWidth: false },
                { name: 'excerpt', label: 'Summary Text', type: 'textarea', fullWidth: true },
              ])
            )}
            <button onClick={() => handleAddField('blog_posts_sections')} className="w-full py-6 border-2 border-dashed border-gray-300 rounded-3xl text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-all flex items-center justify-center space-x-2 font-black uppercase tracking-widest text-xs bg-white/50">
              <FiPlus />
              <span>Feature New Post</span>
            </button>
          </div>
        )}

        {activeTab === 'video' && (
          <div className="max-w-5xl mx-auto space-y-6">
            {renderSectionHeader('Showcase Video', 'Cinematic brand immersion', FiVideo)}
            <div className="bg-white border border-gray-200 rounded-[32px] p-10 shadow-sm border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-2">Primary Title</label>
                    <input
                      type="text"
                      value={settings.showcase_video_section.title || ''}
                      onChange={(e) => handleInputChange('showcase_video_section', null, 'title', e.target.value)}
                      className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-2">Marketing Copy</label>
                    <textarea
                      value={settings.showcase_video_section.description || ''}
                      onChange={(e) => handleInputChange('showcase_video_section', null, 'description', e.target.value)}
                      className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:outline-none font-bold leading-relaxed"
                      rows={6}
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="relative aspect-video bg-black rounded-[24px] overflow-hidden group shadow-2xl">
                    {settings.showcase_video_section.url ? (
                      <video 
                        src={settings.showcase_video_section.url}
                        className="w-full h-full object-cover"
                        poster={settings.showcase_video_section.thumbnail}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                        <FiVideo size={48} className="mb-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Video Missing</span>
                      </div>
                    )}
                    <label className="absolute inset-0 bg-primary-600/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer scale-95 group-hover:scale-100">
                      <input type="file" className="hidden" accept="video/*" onChange={(e) => handleFileUpload('showcase_video_section', null, e)} />
                      <FiUploadCloud className="text-white w-12 h-12 mb-3" />
                      <span className="text-white text-[10px] font-black uppercase tracking-widest">Replace Brand Film</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'partners' && (
          <div className="space-y-6">
            {renderSectionHeader('Verified Vendors', 'Global brand partnerships', FiUsers)}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {settings.partners_section.map((item, index) => 
                renderMediaCard('partners_section', index, item, [
                  { name: 'name', label: 'Company Name', fullWidth: true },
                ])
              )}
              <button onClick={() => handleAddField('partners_section')} className="aspect-square md:aspect-auto py-10 border-2 border-dashed border-gray-300 rounded-[32px] text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-all flex flex-col items-center justify-center space-y-2 font-black uppercase tracking-widest text-[10px] bg-white/50">
                <FiPlus size={24} />
                <span>New Partner</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            {renderSectionHeader('Client Reviews', 'Social proof and travel journals', FiMessageSquare)}
            {settings.testimonials_section.map((item, index) => 
              renderMediaCard('testimonials_section', index, item, [
                { name: 'name', label: 'Reviewer Name', fullWidth: false },
                { name: 'location', label: 'Origins', fullWidth: false },
                { name: 'tour', label: 'Experience Type', fullWidth: false },
                { name: 'rating', label: 'Score (1-5)', type: 'number', fullWidth: false },
                { name: 'text', label: 'Review Text', type: 'textarea', fullWidth: true, rows: 4 },
              ])
            )}
            <button onClick={() => handleAddField('testimonials_section')} className="w-full py-6 border-2 border-dashed border-gray-300 rounded-3xl text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-all flex items-center justify-center space-x-2 font-black uppercase tracking-widest text-xs bg-white/50">
              <FiPlus />
              <span>Add Verified Review</span>
            </button>
          </div>
        )}

        {activeTab === 'benefits' && (
          <div className="space-y-6">
            {renderSectionHeader('Core Benefits', 'Value propositions and strengths', FiCheckCircle)}
            {settings.why_choose_us_section.map((item, index) => 
              renderMediaCard('why_choose_us_section', index, item, [
                { name: 'title', label: 'Strength Heading', fullWidth: false },
                { name: 'icon', label: 'Icon Name (FiShield, FiStar, etc.)', fullWidth: false },
                { name: 'description', label: 'Benefit Detail', type: 'textarea', fullWidth: true },
              ])
            )}
            <button onClick={() => handleAddField('why_choose_us_section')} className="w-full py-6 border-2 border-dashed border-gray-300 rounded-3xl text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-all flex items-center justify-center space-x-2 font-black uppercase tracking-widest text-xs bg-white/50">
              <FiPlus />
              <span>Add New Benefit</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
