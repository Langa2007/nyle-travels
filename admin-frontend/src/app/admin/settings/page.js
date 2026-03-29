'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiUploadCloud, FiImage, FiVideo, FiAlertCircle } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { adminAPI } from '@/lib/AdminApi';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('hero'); // 'hero', 'destinations', 'tours', 'hotels', 'video'

  const [heroFiles, setHeroFiles] = useState(Array(5).fill(null));
  const [heroPrevs, setHeroPrevs] = useState(Array(5).fill(''));
  
  const [destFiles, setDestFiles] = useState(Array(6).fill(null));
  const [destPrevs, setDestPrevs] = useState(Array(6).fill(''));

  const [toursFiles, setToursFiles] = useState(Array(5).fill(null));
  const [toursPrevs, setToursPrevs] = useState(Array(5).fill(''));

  const [hotelsFiles, setHotelsFiles] = useState(Array(4).fill(null));
  const [hotelsPrevs, setHotelsPrevs] = useState(Array(4).fill(''));

  const [videoFile, setVideoFile] = useState(null);
  const [videoPrev, setVideoPrev] = useState('');

  // Fetch current settings
  useEffect(() => {
    const fetchCurrentSettings = async () => {
      try {
        const { data: result } = await adminAPI.getSettings();
        
        if (result?.status === 'success' && result.data) {
          if (result.data.hero_images) setHeroPrevs(result.data.hero_images);
          if (result.data.destinations_images) setDestPrevs(result.data.destinations_images);
          if (result.data.tours_images) setToursPrevs(result.data.tours_images);
          if (result.data.hotels_images) setHotelsPrevs(result.data.hotels_images);
          if (result.data.showcase_video?.url) setVideoPrev(result.data.showcase_video.url);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    fetchCurrentSettings();
  }, []);

  const handleArrayFileChange = (index, e, filesState, setFilesState, prevsState, setPrevsState) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      const newFiles = [...filesState];
      newFiles[index] = file;
      setFilesState(newFiles);

      const newPrevs = [...prevsState];
      newPrevs[index] = URL.createObjectURL(file);
      setPrevsState(newPrevs);
    }
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error('Video size must be less than 50MB to prevent crashes');
        return;
      }
      setVideoFile(file);
      setVideoPrev(URL.createObjectURL(file));
    }
  };

  const uploadMedia = async (file, isVideo = false) => {
    const formData = new FormData();
    formData.append('media', file);
    try {
      const response = await adminAPI.uploadMedia(formData, isVideo);
      return response.data.url;
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to upload ${isVideo ? 'video' : 'image'}`);
    }
  };

  const processArrayUploads = async (filesArray, prevsArray) => {
    const finalImages = [...prevsArray];
    for (let i = 0; i < filesArray.length; i++) {
      if (filesArray[i]) {
        const url = await uploadMedia(filesArray[i], false);
        finalImages[i] = url;
      }
    }
    return finalImages;
  };

  const handleSave = async () => {
    setLoading(true);
    toast.loading('Saving configuration...', { id: 'saveConfig' });

    try {
      const finalHeroImages = await processArrayUploads(heroFiles, heroPrevs);
      const finalDestImages = await processArrayUploads(destFiles, destPrevs);
      const finalToursImages = await processArrayUploads(toursFiles, toursPrevs);
      const finalHotelsImages = await processArrayUploads(hotelsFiles, hotelsPrevs);

      let finalVideoUrl = videoPrev;
      if (videoFile) {
        finalVideoUrl = await uploadMedia(videoFile, true);
      }

      await adminAPI.updateSettings({
        hero_images: finalHeroImages,
        destinations_images: finalDestImages,
        tours_images: finalToursImages,
        hotels_images: finalHotelsImages,
        showcase_video: { url: finalVideoUrl }
      });

      toast.success('Configuration saved successfully!', { id: 'saveConfig' });
    } catch (error) {
      toast.error(error.message || 'Error saving settings.', { id: 'saveConfig' });
    } finally {
      setLoading(false);
    }
  };

  const renderImageSection = (title, description, count, filesState, setFilesState, prevsState, setPrevsState, idPrefix) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl">
      <div className="flex items-center space-x-3 mb-6 border-b border-gray-100 pb-4">
        <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
          <FiImage size={24} />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="space-y-6">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex items-start space-x-6 border border-gray-100 p-4 rounded-xl">
            <div 
              className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0"
              style={{
                backgroundImage: prevsState[index] ? `url(${prevsState[index]})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {!prevsState[index] && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <FiImage size={24} />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Item {index + 1}</h3>
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/webp"
                  onChange={(e) => handleArrayFileChange(index, e, filesState, setFilesState, prevsState, setPrevsState)}
                  className="hidden"
                  id={`${idPrefix}-upload-${index}`}
                />
                <label 
                  htmlFor={`${idPrefix}-upload-${index}`}
                  className="inline-flex items-center px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <FiUploadCloud className="mr-2" />
                  Browse Image
                </label>
              </div>
              <p className="text-xs text-gray-400 mt-2">Max limit: 5MB</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between sticky top-0 bg-gray-50/90 backdrop-blur-md py-4 z-10 border-b border-gray-200">
        <h1 className="text-2xl font-serif font-bold">Dynamic Media Configuration</h1>
        <Button variant="luxury" onClick={handleSave} disabled={loading}>
          <FiSave className="mr-2" />
          {loading ? 'Saving...' : 'Save Configuration'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {['hero', 'destinations', 'tours', 'hotels', 'video'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${
              activeTab === tab ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            {tab} Configuration
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'hero' && renderImageSection('Hero Slider Images', 'Updates the main frontend landing section dynamically', 5, heroFiles, setHeroFiles, heroPrevs, setHeroPrevs, 'hero')}
        
        {activeTab === 'destinations' && renderImageSection('Destinations Images', 'Updates the 6 images in the breathtaking destinations grid', 6, destFiles, setDestFiles, destPrevs, setDestPrevs, 'dest')}
        
        {activeTab === 'tours' && renderImageSection('Featured Tours Images', 'Updates the 5 featured safaris in the slider loop', 5, toursFiles, setToursFiles, toursPrevs, setToursPrevs, 'tour')}
        
        {activeTab === 'hotels' && renderImageSection('Luxury Hotels Images', 'Updates the 4 exclusive accommodations in the luxury stays grid', 4, hotelsFiles, setHotelsFiles, hotelsPrevs, setHotelsPrevs, 'hotel')}

        {activeTab === 'video' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-3xl">
            <div className="flex items-center space-x-3 mb-6 border-b border-gray-100 pb-4">
              <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
                <FiVideo size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Showcase Video</h2>
                <p className="text-sm text-gray-500">The immersive video on the landing page</p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 flex items-start space-x-3">
              <FiAlertCircle className="text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-800">Strict Size Limit</h4>
                <p className="text-sm text-red-600">
                  To prevent database overloading and client-side lag, uploaded videos must not exceed <span className="font-bold">50MB</span> in total file size. Use MP4 or WebM formats.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-8 bg-gray-50 relative">
              {videoPrev ? (
                <video 
                  src={videoPrev}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                  controls
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 mb-4">
                  <FiVideo size={32} />
                </div>
              )}
              
              <input 
                type="file" 
                accept="video/mp4, video/webm, video/quicktime"
                onChange={handleVideoFileChange}
                className="hidden"
                id="video-upload"
              />
              <label 
                htmlFor="video-upload"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 cursor-pointer transition-colors shadow-sm"
              >
                <FiUploadCloud className="mr-2" />
                Upload New Video
              </label>
              <p className="text-xs text-gray-500 mt-4 text-center">
                Replaces the current showcase clip.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
