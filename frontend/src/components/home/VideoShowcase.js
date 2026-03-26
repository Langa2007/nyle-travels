'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiPlay, FiPause, FiVolume2, FiVolumeX } from 'react-icons/fi';

export default function VideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [title, setTitle] = useState('Discover Your African Dream');
  const [description, setDescription] = useState('Watch our story and see why discerning travelers choose Nyle for unforgettable African adventures.');
  const [videoUrl, setVideoUrl] = useState('/videos/showcase.mp4');
  const [thumbnail, setThumbnail] = useState('https://picsum.photos/seed/33oywj/800/600');
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');
        if (!apiUrl) return;
        
        const res = await fetch(`${apiUrl}/settings/showcase_video_section`);
        const result = await res.json();
        
        if (result.status === 'success' && result.data) {
          if (result.data.url) setVideoUrl(result.data.url);
          if (result.data.title) setTitle(result.data.title);
          if (result.data.description) setDescription(result.data.description);
          if (result.data.thumbnail) setThumbnail(result.data.thumbnail);
        }
      } catch (error) {
        console.error('Failed to fetch video settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
        setShowThumbnail(false);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative h-[80vh] overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 bg-black">
        {showThumbnail ? (
          <Image
            src={thumbnail}
            alt="Video Thumbnail"
            fill
            className="object-cover opacity-80"
          />
        ) : (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            loop
            muted={isMuted}
            playsInline
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <span className="inline-block px-4 py-1 border border-white/30 rounded-full text-sm mb-6 backdrop-blur-sm">
              Experience the Magic
            </span>

            {/* Title */}
            <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 drop-shadow-lg">
              {title.split(' ').map((word, i, arr) => (
                <span key={i}>
                  {i === arr.length - 2 ? <span className="text-primary-400">{word} </span> : word + ' '}
                </span>
              ))}
            </h2>

            {/* Description */}
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto drop-shadow-md">
              {description}
            </p>

            {/* Video Controls */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handlePlayPause}
                className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors group z-10"
              >
                {isPlaying ? (
                  <FiPause className="w-8 h-8 text-white" />
                ) : (
                  <FiPlay className="w-8 h-8 text-white ml-1" />
                )}
              </button>

              <button
                onClick={handleMute}
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-10"
              >
                {isMuted ? (
                  <FiVolumeX className="w-5 h-5 text-white" />
                ) : (
                  <FiVolume2 className="w-5 h-5 text-white" />
                )}
              </button>
            </div>

            {/* Stats Overlay */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-400">10K+</div>
                <div className="text-sm text-gray-300">Happy Travelers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-400">150+</div>
                <div className="text-sm text-gray-300">Destinations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-400">4.9</div>
                <div className="text-sm text-gray-300">Rating</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
