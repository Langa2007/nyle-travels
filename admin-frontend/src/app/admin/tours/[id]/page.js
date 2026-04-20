'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FiSave, 
  FiArrowLeft, 
  FiImage, 
  FiList, 
  FiMap, 
  FiCalendar,
  FiPlus,
  FiTrash2,
  FiCheck,
  FiAlertCircle
} from 'react-icons/fi';
import { toursAPI, destinationsAPI } from '@/lib/api';
import Button from '@/components/ui/Button';

export default function TourEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [destinations, setDestinations] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    package_code: '',
    destination_id: '',
    base_price: 0,
    duration_days: 1,
    duration_nights: 0,
    difficulty_level: 'moderate',
    group_size_max: 20,
    short_description: '',
    description: '',
    featured_image: '',
    highlights: [],
    included_items: [],
    excluded_items: [],
    is_featured: false,
    is_active: true
  });

  const [itineraries, setItineraries] = useState([]);
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const destsRes = await destinationsAPI.getAll();
      setDestinations(destsRes.data.data.destinations);

      if (!isNew) {
        const res = await toursAPI.getById(id); 
        const tourData = res.data.data.tour;
        setFormData(tourData);
        setItineraries(res.data.data.itinerary || []);
        setAvailability(res.data.data.availability || []);
      }
    } catch (err) {
      console.error('Failed to fetch tour data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleListUpdate = (field, index, value) => {
    const newList = [...formData[field]];
    newList[index] = value;
    setFormData(prev => ({ ...prev, [field]: newList }));
  };

  const addListItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeListItem = (field, index) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: prev[field].filter((_, i) => i !== index) 
    }));
  };

  const addItineraryDay = () => {
    const nextDay = itineraries.length + 1;
    setItineraries([...itineraries, {
      day_number: nextDay,
      title: '',
      description: '',
      accommodation_name: '',
      meals_included: [],
      activities: []
    }]);
  };

  const saveTour = async () => {
    try {
      setSaving(true);
      let tourId = id;
      
      if (isNew) {
        const res = await toursAPI.create(formData);
        tourId = res.data.data.id;
      } else {
        await toursAPI.update(id, formData);
      }

      // Save Itinerary
      await toursAPI.bulkUpdateItinerary(tourId, { itineraries });

      alert('Expedition saved successfully');
      if (isNew) router.push('/admin/tours');
    } catch (err) {
      console.error('Save failed', err);
      alert('Failed to save expedition');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center italic">Synchronizing details...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto mb-20">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center space-x-6">
          <button onClick={() => router.back()} className="p-3 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-primary-500 transition-all shadow-sm">
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">
              {isNew ? 'New Expedition' : 'Edit Expedition'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">{isNew ? 'Creating a new luxury odyssey' : formData.name}</p>
          </div>
        </div>
        <Button 
          variant="primary" 
          onClick={saveTour} 
          disabled={saving}
          className="flex items-center space-x-3 px-8"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSave />}
          <span>{saving ? 'Preserving...' : 'Save Changes'}</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-10 p-1.5 bg-gray-100 rounded-[1.5rem] w-fit">
        {[
          { id: 'basic', label: 'Basics', icon: <FiMap /> },
          { id: 'content', label: 'Details', icon: <FiList /> },
          { id: 'itinerary', label: 'Itinerary', icon: <FiCalendar /> },
          { id: 'media', label: 'Media', icon: <FiImage /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Form Content */}
      <div className="space-y-10">
        {activeTab === 'basic' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 font-bold">Expedition Name</label>
                <input 
                  type="text" name="name" value={formData.name} onChange={handleInputChange}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 transition-all"
                  placeholder="e.g. Serengeti Silk Route"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 font-bold">URL Slug</label>
                  <input 
                    type="text" name="slug" value={formData.slug} onChange={handleInputChange}
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 font-bold">Package Code</label>
                  <input 
                    type="text" name="package_code" value={formData.package_code} onChange={handleInputChange}
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 font-bold">Destination</label>
                <select 
                  name="destination_id" value={formData.destination_id} onChange={handleInputChange}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 transition-all"
                >
                  <option value="">Select Destination</option>
                  {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 font-bold">Base Price ($)</label>
                  <input 
                    type="number" name="base_price" value={formData.base_price} onChange={handleInputChange}
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 font-bold">Max Guests</label>
                  <input 
                    type="number" name="group_size_max" value={formData.group_size_max} onChange={handleInputChange}
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 font-bold">Days</label>
                  <input 
                    type="number" name="duration_days" value={formData.duration_days} onChange={handleInputChange}
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 font-bold">Difficulty</label>
                  <select 
                    name="difficulty_level" value={formData.difficulty_level} onChange={handleInputChange}
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 transition-all"
                  >
                    <option value="easy">Easy</option>
                    <option value="moderate">Moderate</option>
                    <option value="challenging">Challenging</option>
                    <option value="difficult">Difficult</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-6 pt-4">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input 
                    type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleInputChange}
                    className="w-5 h-5 rounded-lg border-gray-200 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm font-bold text-gray-600 group-hover:text-primary-500 transition-colors">Featured Expedition</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input 
                    type="checkbox" name="is_active" checked={formData.is_active} onChange={handleInputChange}
                    className="w-5 h-5 rounded-lg border-gray-200 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm font-bold text-gray-600 group-hover:text-primary-500 transition-colors">Published</span>
                </label>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'content' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4">Expedition Highlights</label>
              <div className="space-y-3">
                {formData.highlights.map((item, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <input 
                      type="text" value={item} onChange={(e) => handleListUpdate('highlights', i, e.target.value)}
                      className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium"
                    />
                    <button onClick={() => removeListItem('highlights', i)} className="p-3 text-gray-300 hover:text-red-500 transition-colors"><FiTrash2 /></button>
                  </div>
                ))}
                <button 
                  onClick={() => addListItem('highlights')}
                  className="w-full py-4 border-2 border-dashed border-gray-100 rounded-xl text-xs font-bold text-gray-400 hover:border-primary-100 hover:text-primary-500 transition-all flex items-center justify-center space-x-2"
                >
                  <FiPlus /> <span>Add Highlight</span>
                </button>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4">Narrative Description</label>
              <textarea 
                name="description" value={formData.description} onChange={handleInputChange}
                rows="12"
                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-primary-500/10 transition-all"
              />
            </div>
          </motion.div>
        )}

        {activeTab === 'itinerary' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {itineraries.map((day, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center font-serif font-bold">
                      {day.day_number}
                    </div>
                    <input 
                      type="text" value={day.title} 
                      onChange={(e) => {
                        const newIt = [...itineraries];
                        newIt[i].title = e.target.value;
                        setItineraries(newIt);
                      }}
                      placeholder="Daily Title"
                      className="text-lg font-serif font-bold text-gray-900 border-none bg-transparent p-0 focus:ring-0 placeholder:text-gray-200"
                    />
                  </div>
                  <button onClick={() => setItineraries(itineraries.filter((_, idx) => idx !== i))} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                    <FiTrash2 />
                  </button>
                </div>
                <textarea 
                  value={day.description}
                  onChange={(e) => {
                    const newIt = [...itineraries];
                    newIt[i].description = e.target.value;
                    setItineraries(newIt);
                  }}
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm mb-4"
                  rows="4"
                  placeholder="What happens on this day?"
                />
                <div className="grid grid-cols-2 gap-4">
                   <input 
                    type="text" value={day.accommodation_name} 
                    onChange={(e) => {
                      const newIt = [...itineraries];
                      newIt[i].accommodation_name = e.target.value;
                      setItineraries(newIt);
                    }}
                    placeholder="Accommodation Name"
                    className="bg-gray-50 border-none rounded-xl px-4 py-3 text-xs"
                  />
                  <input 
                    type="text" value={day.meals_included?.join(', ')} 
                    onChange={(e) => {
                      const newIt = [...itineraries];
                      newIt[i].meals_included = e.target.value.split(',').map(s => s.trim());
                      setItineraries(newIt);
                    }}
                    placeholder="Meals (e.g. Breakfast, Lunch)"
                    className="bg-gray-50 border-none rounded-xl px-4 py-3 text-xs"
                  />
                </div>
              </div>
            ))}
            <button 
              onClick={addItineraryDay}
              className="w-full py-6 border-2 border-dashed border-gray-100 rounded-[2.5rem] text-sm font-bold text-gray-400 hover:border-primary-100 hover:text-primary-500 transition-all flex items-center justify-center space-x-3"
            >
              <FiPlus /> <span>Append Sequence Day</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
