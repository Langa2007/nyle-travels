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
  FiFileText
} from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { adminAPI } from '@/lib/AdminApi';
import toast from 'react-hot-toast';

export default function MediaManagement() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  
  const [settings, setSettings] = useState({
    hero_sections: [],
    featured_safaris: [],
    destinations_sections: [],
    luxury_stays_sections: [],
    exclusive_offers_sections: [],
    blog_posts_sections: [],
    showcase_video_section: { url: '', title: '', description: '', thumbnail: '' }
  });

  // Fetch current settings
  useEffect(() => {
    const fetchCurrentSettings = async () => {
      try {
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');
        if (!apiUrl) return;
        
        const res = await fetch(`${apiUrl}/settings`);
        const result = await res.json();
        
        if (result.status === 'success' && result.data) {
          setSettings(prev => ({
            ...prev,
            hero_sections: result.data.hero_sections || [],
            featured_safaris: result.data.featured_safaris || [],
            destinations_sections: result.data.destinations_sections || [],
            luxury_stays_sections: result.data.luxury_stays_sections || [],
            exclusive_offers_sections: result.data.exclusive_offers_sections || [],
            blog_posts_sections: result.data.blog_posts_sections || [],
            showcase_video_section: result.data.showcase_video_section || prev.showcase_video_section
          }));
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
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
      Object.assign(newItem, { title: '', description: '', discount: 0, code: '', image: '' });
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
      // Single object (e.g., video showcase)
      setSettings({
        ...settings,
        [section]: { ...settings[section], [field]: value }
      });
    } else {
      // Array of objects
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
        handleInputChange(section, index, 'image', url);
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
      <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
        <Icon size={24} />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-600 font-medium">{description}</p>
      </div>
    </div>
  );

  const renderMediaCard = (section, index, item, fields) => (
    <div key={item.id || index} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image Preview / Upload */}
        <div className="w-full md:w-48 h-32 bg-gray-100 rounded-xl overflow-hidden relative flex-shrink-0 group">
          {item.image ? (
            <img src={item.image} alt={item.title || item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <FiImage size={32} />
              <span className="text-xs mt-2">No Image</span>
            </div>
          )}
          <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
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
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  value={item[field.name] || ''}
                  onChange={(e) => handleInputChange(section, index, field.name, e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:outline-none placeholder-gray-400"
                  rows={3}
                  placeholder={`Enter ${field.label.toLowerCase()}...`}
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  value={item[field.name] || ''}
                  onChange={(e) => handleInputChange(section, index, field.name, e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:outline-none placeholder-gray-400"
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
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Item"
          >
            <FiTrash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between sticky top-0 bg-gray-50/90 backdrop-blur-md py-4 z-10 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-serif font-black text-gray-900">Site Content Management</h1>
          <p className="text-sm text-gray-700 font-medium">Manage images, videos, and labels for the homepage</p>
        </div>
        <Button variant="luxury" onClick={handleSave} disabled={loading}>
          <FiSave className="mr-2" />
          {loading ? 'Saving...' : 'Publish Changes'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2 border-b border-gray-200">
        {[
          {id: 'hero', label: 'Hero Slides', icon: FiImage},
          {id: 'safaris', label: 'Featured Safaris', icon: FiPackage},
          {id: 'destinations', label: 'Destinations', icon: FiStar},
          {id: 'stays', label: 'Luxury Stays', icon: FiMap},
          {id: 'offers', label: 'Offers', icon: FiDollarSign},
          {id: 'blog', label: 'Blog Feed', icon: FiFileText},
          {id: 'video', label: 'Showcase Video', icon: FiVideo},
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-t-xl text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id 
                ? 'bg-white border-x border-t border-gray-200 text-primary-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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
            {renderSectionHeader('Hero Slider', 'The main carousel at the top of the homepage', FiImage)}
            <div className="grid grid-cols-1 gap-6">
              {settings.hero_sections.map((item, index) => 
                renderMediaCard('hero_sections', index, item, [
                  { name: 'subtitle', label: 'Lesser Title (Badge)', fullWidth: false },
                  { name: 'title', label: 'Main Title', fullWidth: false },
                  { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
                ])
              )}
              <button 
                onClick={() => handleAddField('hero_sections')}
                className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-primary-300 hover:text-primary-500 transition-all flex items-center justify-center space-x-2"
              >
                <FiPlus />
                <span>Add Hero Slide</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'safaris' && (
          <div className="space-y-6">
            {renderSectionHeader('Featured Safaris', 'The (5) highlighted tour packages', FiPackage)}
            <div className="grid grid-cols-1 gap-6">
              {settings.featured_safaris.map((item, index) => 
                renderMediaCard('featured_safaris', index, item, [
                  { name: 'name', label: 'Tour Name', fullWidth: false },
                  { name: 'badge', label: 'Badge', fullWidth: false },
                  { name: 'destination', label: 'Destination', fullWidth: false },
                  { name: 'price', label: 'Price ($)', type: 'number', fullWidth: false },
                ])
              )}
              <button 
                onClick={() => handleAddField('featured_safaris')}
                className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-primary-300 hover:text-primary-500 transition-all flex items-center justify-center space-x-2"
              >
                <FiPlus />
                <span>Add Safari</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'destinations' && (
          <div className="space-y-6">
            {renderSectionHeader('Breathtaking Destinations', 'The grid of location highlights', FiStar)}
            <div className="grid grid-cols-1 gap-6">
              {settings.destinations_sections.map((item, index) => 
                renderMediaCard('destinations_sections', index, item, [
                  { name: 'name', label: 'Location Name', fullWidth: false },
                  { name: 'country', label: 'Country', fullWidth: false },
                  { name: 'tours', label: 'Tour Count', type: 'number', fullWidth: false },
                  { name: 'hotels', label: 'Hotel Count', type: 'number', fullWidth: false },
                  { name: 'description', label: 'Short Description', type: 'textarea', fullWidth: true },
                ])
              )}
              <button 
                onClick={() => handleAddField('destinations_sections')}
                className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-primary-300 hover:text-primary-500 transition-all flex items-center justify-center space-x-2"
              >
                <FiPlus />
                <span>Add Destination</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'stays' && (
          <div className="space-y-6">
            {renderSectionHeader('Luxury Stays', 'Hand-picked luxury lodges and camps', FiMap)}
            <div className="grid grid-cols-1 gap-6">
              {settings.luxury_stays_sections.map((item, index) => 
                renderMediaCard('luxury_stays_sections', index, item, [
                  { name: 'name', label: 'Hotel Name', fullWidth: false },
                  { name: 'badge', label: 'Badge', fullWidth: false },
                  { name: 'destination', label: 'Destination', fullWidth: false },
                  { name: 'price', label: 'Price /night ($)', type: 'number', fullWidth: false },
                  { name: 'rating', label: 'Rating (1-5)', type: 'number', fullWidth: false },
                  { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
                ])
              )}
              <button 
                onClick={() => handleAddField('luxury_stays_sections')}
                className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-primary-300 hover:text-primary-500 transition-all flex items-center justify-center space-x-2"
              >
                <FiPlus />
                <span>Add Hotel</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'offers' && (
          <div className="space-y-6">
            {renderSectionHeader('Exclusive Offers', 'Limited-time deals and promo codes', FiDollarSign)}
            <div className="grid grid-cols-1 gap-6">
              {settings.exclusive_offers_sections.map((item, index) => 
                renderMediaCard('exclusive_offers_sections', index, item, [
                  { name: 'title', label: 'Offer Title', fullWidth: false },
                  { name: 'type', label: 'Offer Type (Badge)', fullWidth: false },
                  { name: 'discount', label: 'Discount %', type: 'number', fullWidth: false },
                  { name: 'code', label: 'Promo Code', fullWidth: false },
                  { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
                ])
              )}
              <button 
                onClick={() => handleAddField('exclusive_offers_sections')}
                className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-primary-300 hover:text-primary-500 transition-all flex items-center justify-center space-x-2"
              >
                <FiPlus />
                <span>Add Offer</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="space-y-6">
            {renderSectionHeader('From Our Blog', 'Featured stories and travel guides', FiFileText)}
            <div className="grid grid-cols-1 gap-6">
              {settings.blog_posts_sections.map((item, index) => 
                renderMediaCard('blog_posts_sections', index, item, [
                  { name: 'title', label: 'Article Title', fullWidth: false },
                  { name: 'category', label: 'Category', fullWidth: false },
                  { name: 'author', label: 'Author', fullWidth: false },
                  { name: 'date', label: 'Date', fullWidth: false },
                  { name: 'readTime', label: 'Read Time', fullWidth: false },
                  { name: 'excerpt', label: 'Excerpt', type: 'textarea', fullWidth: true },
                ])
              )}
              <button 
                onClick={() => handleAddField('blog_posts_sections')}
                className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-primary-300 hover:text-primary-500 transition-all flex items-center justify-center space-x-2"
              >
                <FiPlus />
                <span>Add Blog Post Item</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'video' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {renderSectionHeader('Showcase Video', 'The immersive background video on the landing page', FiVideo)}
            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Video Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Video Title</label>
                    <input
                      type="text"
                      value={settings.showcase_video_section.title || ''}
                      onChange={(e) => handleInputChange('showcase_video_section', null, 'title', e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                    <textarea
                      value={settings.showcase_video_section.description || ''}
                      onChange={(e) => handleInputChange('showcase_video_section', null, 'description', e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                      rows={4}
                    />
                  </div>
                </div>

                {/* Video / Thumbnail */}
                <div className="space-y-4">
                  <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden group">
                    {settings.showcase_video_section.url ? (
                      <video 
                        src={settings.showcase_video_section.url}
                        className="w-full h-full object-cover"
                        poster={settings.showcase_video_section.thumbnail}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-700">
                        <FiVideo size={48} />
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="video/*" 
                        onChange={(e) => handleFileUpload('showcase_video_section', null, e)} 
                      />
                      <FiUploadCloud className="text-white w-10 h-10 mb-2" />
                      <span className="text-white text-xs font-medium">Upload Video</span>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden relative">
                        {settings.showcase_video_section.thumbnail && (
                          <img src={settings.showcase_video_section.thumbnail} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Video Thumbnail</p>
                        <p className="text-xs text-gray-500">Appears while video loads</p>
                      </div>
                    </div>
                    <label className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium cursor-pointer hover:bg-gray-50">
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const formData = new FormData();
                            formData.append('media', file);
                            adminAPI.uploadMedia(formData, false).then(res => {
                              handleInputChange('showcase_video_section', null, 'thumbnail', res.data.url);
                              toast.success('Thumbnail updated!');
                            });
                          }
                        }} 
                      />
                      Change
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
