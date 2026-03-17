import { Client } from '@googlemaps/google-maps-services-js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({});

export const googleMapsService = {
  // Geocode an address to get coordinates
  async geocode(address) {
    try {
      const response = await client.geocode({
        params: {
          address: address,
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      });

      if (response.data.status === 'OK') {
        return response.data.results[0];
      }
      throw new Error(`Geocoding failed: ${response.data.status}`);
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  },

  // Reverse geocode coordinates to get address
  async reverseGeocode(lat, lng) {
    try {
      const response = await client.reverseGeocode({
        params: {
          latlng: { lat, lng },
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      });

      if (response.data.status === 'OK') {
        return response.data.results[0];
      }
      throw new Error(`Reverse geocoding failed: ${response.data.status}`);
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw error;
    }
  },

  // Calculate distance and duration between two points
  async calculateDistance(origin, destination, mode = 'driving') {
    try {
      const response = await client.distancematrix({
        params: {
          origins: [origin],
          destinations: [destination],
          mode: mode,
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      });

      if (response.data.status === 'OK') {
        const element = response.data.rows[0].elements[0];
        return {
          distance: element.distance,
          duration: element.duration,
          status: element.status
        };
      }
      throw new Error(`Distance calculation failed: ${response.data.status}`);
    } catch (error) {
      console.error('Distance calculation error:', error);
      throw error;
    }
  },

  // Get place details by place ID
  async getPlaceDetails(placeId) {
    try {
      const response = await client.placeDetails({
        params: {
          place_id: placeId,
          fields: ['name', 'formatted_address', 'geometry', 'photos', 'rating', 'reviews', 'website', 'formatted_phone_number'],
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      });

      if (response.data.status === 'OK') {
        return response.data.result;
      }
      throw new Error(`Place details failed: ${response.data.status}`);
    } catch (error) {
      console.error('Place details error:', error);
      throw error;
    }
  },

  // Search for places near a location
  async searchNearby(lat, lng, radius, type) {
    try {
      const response = await client.placesNearby({
        params: {
          location: { lat, lng },
          radius: radius,
          type: type,
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      });

      if (response.data.status === 'OK') {
        return response.data.results;
      }
      throw new Error(`Nearby search failed: ${response.data.status}`);
    } catch (error) {
      console.error('Nearby search error:', error);
      throw error;
    }
  },

  // Get directions between points
  async getDirections(origin, destination, waypoints = [], mode = 'driving') {
    try {
      const response = await client.directions({
        params: {
          origin: origin,
          destination: destination,
          waypoints: waypoints,
          mode: mode,
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      });

      if (response.data.status === 'OK') {
        return response.data.routes[0];
      }
      throw new Error(`Directions failed: ${response.data.status}`);
    } catch (error) {
      console.error('Directions error:', error);
      throw error;
    }
  },

  // Get timezone for coordinates
  async getTimeZone(lat, lng, timestamp = Math.floor(Date.now() / 1000)) {
    try {
      const response = await client.timezone({
        params: {
          location: { lat, lng },
          timestamp: timestamp,
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      });

      if (response.data.status === 'OK') {
        return response.data;
      }
      throw new Error(`Timezone failed: ${response.data.status}`);
    } catch (error) {
      console.error('Timezone error:', error);
      throw error;
    }
  },

  // Generate static map URL
  generateStaticMapUrl(center, zoom = 12, size = '600x300', markers = []) {
    let url = `https://maps.googleapis.com/maps/api/staticmap?center=${center.lat},${center.lng}&zoom=${zoom}&size=${size}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    
    markers.forEach(marker => {
      url += `&markers=color:${marker.color || 'red'}|label:${marker.label || ''}|${marker.lat},${marker.lng}`;
    });
    
    return url;
  },

  // Autocomplete places
  async autocomplete(input, location = null, radius = null) {
    try {
      const params = {
        input: input,
        key: process.env.GOOGLE_MAPS_API_KEY
      };

      if (location && radius) {
        params.location = location;
        params.radius = radius;
      }

      const response = await client.placeAutocomplete({
        params: params
      });

      if (response.data.status === 'OK') {
        return response.data.predictions;
      }
      throw new Error(`Autocomplete failed: ${response.data.status}`);
    } catch (error) {
      console.error('Autocomplete error:', error);
      throw error;
    }
  }
};

export default googleMapsService;