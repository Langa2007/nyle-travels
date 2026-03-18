'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiNavigation, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import Button from '@/components/ui/Button';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '1rem',
};

const defaultCenter = {
  lat: -1.286389,
  lng: 36.817223, // Nairobi coordinates
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  scaleControl: true,
  streetViewControl: true,
  rotateControl: true,
  fullscreenControl: false,
  styles: [
    {
      featureType: 'all',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#6b7280' }],
    },
    {
      featureType: 'landscape',
      elementType: 'all',
      stylers: [{ color: '#f3f4f6' }],
    },
    {
      featureType: 'poi',
      elementType: 'all',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'road',
      elementType: 'all',
      stylers: [{ saturation: -100 }, { lightness: 45 }],
    },
    {
      featureType: 'water',
      elementType: 'all',
      stylers: [{ color: '#d1d5db' }],
    },
  ],
};

export default function TourMap({
  center = defaultCenter,
  markers = [],
  zoom = 8,
  height = '400px',
  showRoute = false,
  waypoints = [],
  onMarkerClick,
  interactive = true,
}) {
  const [map, setMap] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [directions, setDirections] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  const onLoad = useCallback((map) => {
    setMap(map);
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
    mapRef.current = null;
  }, []);

  // Calculate route if needed
  useEffect(() => {
    if (showRoute && markers.length >= 2 && window.google) {
      const directionsService = new window.google.maps.DirectionsService();
      
      const origin = markers[0].position;
      const destination = markers[markers.length - 1].position;
      const waypoints = markers.slice(1, -1).map(marker => ({
        location: marker.position,
        stopover: true,
      }));

      directionsService.route(
        {
          origin,
          destination,
          waypoints,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK') {
            setDirections(result);
          }
        }
      );
    }
  }, [showRoute, markers]);

  // Get user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(pos);
          map?.panTo(pos);
          map?.setZoom(12);
        },
        () => {
          console.error('Error: The Geolocation service failed.');
        }
      );
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl overflow-hidden shadow-xl ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={mapOptions}
        >
          {/* Regular markers */}
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              title={marker.title}
              icon={{
                url: marker.icon || '/images/map-marker.svg',
                scaledSize: new window.google.maps.Size(40, 40),
              }}
              onClick={() => {
                setSelectedMarker(marker);
                onMarkerClick?.(marker);
              }}
            />
          ))}

          {/* User location marker */}
          {userLocation && (
            <Marker
              position={userLocation}
              title="Your Location"
              icon={{
                url: '/images/user-location.svg',
                scaledSize: new window.google.maps.Size(30, 30),
              }}
            />
          )}

          {/* Directions */}
          {directions && <DirectionsRenderer directions={directions} />}

          {/* Info Window */}
          <AnimatePresence>
            {selectedMarker && (
              <InfoWindow
                position={selectedMarker.position}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-3 max-w-xs"
                >
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {selectedMarker.title}
                  </h3>
                  {selectedMarker.description && (
                    <p className="text-sm text-gray-600 mb-2">
                      {selectedMarker.description}
                    </p>
                  )}
                  {selectedMarker.image && (
                    <img
                      src={selectedMarker.image}
                      alt={selectedMarker.title}
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                  )}
                  <Button
                    variant="primary"
                    size="xs"
                    fullWidth
                    onClick={() => {
                      // Handle navigation
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${selectedMarker.position.lat},${selectedMarker.position.lng}`,
                        '_blank'
                      );
                    }}
                  >
                    Get Directions
                  </Button>
                </motion.div>
              </InfoWindow>
            )}
          </AnimatePresence>
        </GoogleMap>
      </LoadScript>

      {/* Map Controls */}
      {interactive && (
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <button
            onClick={getUserLocation}
            className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            title="My Location"
          >
            <FiNavigation className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <FiMinimize2 className="w-5 h-5 text-gray-600" />
            ) : (
              <FiMaximize2 className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      )}

      {/* Legend */}
      {markers.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3">
          <div className="flex items-center space-x-2 text-sm">
            <FiMapPin className="w-4 h-4 text-primary-600" />
            <span className="text-gray-700">{markers.length} locations</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}