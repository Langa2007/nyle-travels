'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  FiEdit,
  FiImage,
  FiMapPin,
  FiPlus,
  FiRefreshCw,
  FiSave,
  FiSearch,
  FiStar,
  FiTrash2,
  FiUpload,
  FiX,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import Badge from '@/components/ui/Badge';
import { adminAPI } from '@/lib/AdminApi';
import { hotels as seedHotels } from '@/data/hotels';

const SETTINGS_KEY = 'hotels_catalog';
const IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80';
const hotelTypes = ['luxury', 'boutique', 'beach', 'safari', 'wellness', 'city'];

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseList(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map((item) => String(item).trim()).filter(Boolean);
  }

  if (!value) {
    return [];
  }

  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeHotel(hotel, index = 0) {
  return {
    ...hotel,
    id: hotel.id ?? `hotel-${index + 1}`,
    name: hotel.name ?? '',
    slug: hotel.slug ?? slugify(hotel.name || `hotel-${index + 1}`),
    destination: hotel.destination ?? '',
    region: hotel.region ?? '',
    country: hotel.country ?? 'Kenya',
    type: hotel.type ?? 'luxury',
    starRating: Number(hotel.starRating ?? hotel.rating ?? 4),
    price: Number(hotel.price ?? 0),
    priceCurrency: hotel.priceCurrency ?? 'USD',
    badge: hotel.badge ?? '',
    shortDescription: hotel.shortDescription ?? hotel.description ?? '',
    description: hotel.description ?? hotel.shortDescription ?? '',
    amenities: parseList(hotel.amenities),
    defaultImage: hotel.defaultImage ?? hotel.image ?? '',
    image: hotel.image ?? '',
    gallery: parseList(hotel.gallery),
    checkInTime: hotel.checkInTime ?? '14:00',
    checkOutTime: hotel.checkOutTime ?? '11:00',
    cancellationPolicy: hotel.cancellationPolicy ?? 'Standard cancellation policy applies. Please check during booking for specific terms.',
    houseRules: parseList(hotel.houseRules),
    featured: Boolean(hotel.featured),
    featuredOnHome: Boolean(hotel.featuredOnHome ?? hotel.featured),
  };
}

function createEmptyHotel() {
  return normalizeHotel(
    {
      id: `draft-${Date.now()}`,
      name: '',
      slug: '',
      destination: '',
      region: '',
      country: 'Kenya',
      type: 'luxury',
      starRating: 5,
      price: 250,
      priceCurrency: 'USD',
      badge: 'New Stay',
      shortDescription: '',
      description: '',
      amenities: [],
      defaultImage: '',
      image: '',
      gallery: [],
      checkInTime: '14:00',
      checkOutTime: '11:00',
      cancellationPolicy: 'Standard cancellation policy applies. Please check during booking for specific terms.',
      houseRules: ['No smoking inside rooms', 'Pets are not allowed', 'Quiet hours from 10:00 PM to 6:00 AM'],
      featured: false,
      featuredOnHome: false,
    },
    0
  );
}

function getHotelImage(hotel) {
  return hotel.image || hotel.defaultImage || IMAGE_FALLBACK;
}

const seedCatalog = seedHotels.map((hotel, index) => normalizeHotel(hotel, index));

export default function HotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState('');
  const [search, setSearch] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [formState, setFormState] = useState(createEmptyHotel());

  const loadHotels = useCallback(async () => {
    setLoading(true);

    try {
      const response = await adminAPI.getSettings();
      const savedCatalog = response.data?.data?.[SETTINGS_KEY];

      if (Array.isArray(savedCatalog) && savedCatalog.length > 0) {
        setHotels(savedCatalog.map((hotel, index) => normalizeHotel(hotel, index)));
      } else {
        setHotels(seedCatalog);
      }
    } catch (error) {
      console.error('Failed to load hotels catalog:', error);
      toast.error('Failed to load saved hotels. Showing the frontend catalog instead.');
      setHotels(seedCatalog);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHotels();
  }, [loadHotels]);

  async function persistCatalog(nextCatalog, successMessage) {
    setSaving(true);

    try {
      await adminAPI.updateSettings({
        [SETTINGS_KEY]: nextCatalog,
      });
      setHotels(nextCatalog);
      toast.success(successMessage);
      return true;
    } catch (error) {
      console.error('Failed to save hotels catalog:', error);
      toast.error('Failed to save hotels catalog.');
      return false;
    } finally {
      setSaving(false);
    }
  }

  function openCreateModal() {
    setSelectedHotel(null);
    setFormState(createEmptyHotel());
    setIsModalOpen(true);
  }

  function openEditModal(hotel) {
    setSelectedHotel(hotel);
    setFormState(normalizeHotel(hotel));
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedHotel(null);
    setFormState(createEmptyHotel());
  }

  function updateFormField(field, value) {
    setFormState((current) => {
      const next = { ...current, [field]: value };

      if (field === 'name' && (!current.slug || current.slug === slugify(current.name))) {
        next.slug = slugify(value);
      }

      if (field === 'featured') {
        next.featuredOnHome = value;
      }

      return next;
    });
  }

  async function uploadImage(field, event) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    setUploadingField(field);

    try {
      const payload = new FormData();
      payload.append('media', file);
      const response = await adminAPI.uploadMedia(payload, false);
      const imageUrl = response.data?.data?.url;

      if (!imageUrl) {
        throw new Error('Missing uploaded image URL');
      }

      setFormState((current) => ({
        ...current,
        [field]: imageUrl,
      }));
      toast.success(field === 'defaultImage' ? 'Seed image uploaded.' : 'Override image uploaded.');
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image.');
    } finally {
      setUploadingField('');
    }
  }

  async function uploadGalleryImage(event) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    setUploadingField('gallery');

    try {
      const payload = new FormData();
      payload.append('media', file);
      const response = await adminAPI.uploadMedia(payload, false);
      const imageUrl = response.data?.data?.url;

      if (!imageUrl) {
        throw new Error('Missing uploaded image URL');
      }

      setFormState((current) => ({
        ...current,
        gallery: [...current.gallery, imageUrl],
      }));
      toast.success('Gallery image added.');
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image.');
    } finally {
      setUploadingField('');
    }
  }

  function removeGalleryImage(indexToRemove) {
    setFormState((current) => ({
      ...current,
      gallery: current.gallery.filter((_, index) => index !== indexToRemove),
    }));
  }


  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !formState.name.trim() ||
      !formState.destination.trim() ||
      !formState.region.trim() ||
      !formState.shortDescription.trim() ||
      !formState.description.trim()
    ) {
      toast.error('Name, destination, region, short description, and description are required.');
      return;
    }

    const nextHotel = normalizeHotel({
      ...(selectedHotel || {}),
      ...formState,
      slug: formState.slug ? slugify(formState.slug) : slugify(formState.name),
    });

    const nextCatalog = selectedHotel
      ? hotels.map((hotel) => (hotel.id === selectedHotel.id ? nextHotel : hotel))
      : [nextHotel, ...hotels];

    const saved = await persistCatalog(
      nextCatalog,
      selectedHotel ? 'Hotel updated successfully.' : 'Hotel created successfully.'
    );

    if (saved) {
      closeModal();
    }
  }

  async function handleDelete() {
    if (!selectedHotel) {
      return;
    }

    const nextCatalog = hotels.filter((hotel) => hotel.id !== selectedHotel.id);
    const saved = await persistCatalog(nextCatalog, 'Hotel removed successfully.');

    if (saved) {
      setIsDeleteModalOpen(false);
      setSelectedHotel(null);
    }
  }

  async function handleSyncFromFrontend() {
    if (!window.confirm('Replace the admin hotels catalog with the current frontend hotel dataset?')) {
      return;
    }

    await persistCatalog(seedCatalog, 'Frontend hotel catalog synced to admin.');
  }

  const filteredHotels = hotels.filter((hotel) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      hotel.name.toLowerCase().includes(query) ||
      hotel.destination.toLowerCase().includes(query) ||
      hotel.region.toLowerCase().includes(query) ||
      hotel.description.toLowerCase().includes(query) ||
      hotel.amenities.some((item) => item.toLowerCase().includes(query));
    const matchesDestination = destinationFilter === 'all' || hotel.destination === destinationFilter;
    const matchesType = typeFilter === 'all' || hotel.type === typeFilter;
    const matchesFeatured = !featuredOnly || hotel.featuredOnHome || hotel.featured;

    return matchesSearch && matchesDestination && matchesType && matchesFeatured;
  });

  const destinations = ['all', ...new Set(hotels.map((hotel) => hotel.destination).filter(Boolean))];
  const customImageCount = hotels.filter((hotel) => hotel.image).length;
  const featuredCount = hotels.filter((hotel) => hotel.featuredOnHome || hotel.featured).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading hotel catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Hotels Catalog</h1>
          <p className="mt-1 text-gray-500">
            Manage the same Kenya hotel catalog used by the frontend hotels page, homepage, and navbar finder.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={loadHotels} loading={loading}>
            <FiRefreshCw className="mr-2" />
            Reload
          </Button>
          <Button variant="outline" onClick={handleSyncFromFrontend} loading={saving}>
            <FiSave className="mr-2" />
            Sync Frontend
          </Button>
          <Button variant="primary" onClick={openCreateModal}>
            <FiPlus className="mr-2" />
            Add Hotel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Hotels</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{hotels.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Featured On Frontend</p>
          <p className="mt-1 text-2xl font-bold text-primary-600">{featuredCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Custom Image Overrides</p>
          <p className="mt-1 text-2xl font-bold text-yellow-600">{customImageCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by hotel, destination, region, or amenity..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={destinationFilter}
            onChange={(event) => setDestinationFilter(event.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {destinations.map((destination) => (
              <option key={destination} value={destination}>
                {destination === 'all' ? 'All Destinations' : destination}
              </option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl capitalize focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Types</option>
            {hotelTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setFeaturedOnly((current) => !current)}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              featuredOnly ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Featured Only
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredHotels.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="relative h-56 bg-gray-100">
              <Image src={getHotelImage(hotel)} alt={hotel.name} fill className="object-cover" />
              <div className="absolute top-4 left-4 flex items-center gap-2 flex-wrap">
                <Badge variant="default" className="capitalize">{hotel.type}</Badge>
                {(hotel.featuredOnHome || hotel.featured) && <Badge variant="primary">Featured</Badge>}
                {hotel.image && <Badge variant="warning">Custom Image</Badge>}
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{hotel.name}</h2>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <FiMapPin className="w-4 h-4 mr-1" />
                    <span>{hotel.destination}</span>
                  </div>
                </div>
                <div className="flex items-center text-sm font-medium text-yellow-600">
                  <FiStar className="w-4 h-4 mr-1" />
                  {hotel.starRating}
                </div>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2">{hotel.shortDescription}</p>

              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span className="px-2 py-1 bg-gray-100 rounded-full">{hotel.region}</span>
                <span className="px-2 py-1 bg-gray-100 rounded-full">${hotel.price}/night</span>
                {hotel.amenities.slice(0, 2).map((amenity) => (
                  <span key={`${hotel.slug}-${amenity}`} className="px-2 py-1 bg-gray-100 rounded-full">{amenity}</span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => openEditModal(hotel)}
                  className="text-sm font-medium text-primary-600"
                >
                  Edit catalog entry
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(hotel)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Edit hotel"
                  >
                    <FiEdit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedHotel(hotel);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete hotel"
                  >
                    <FiTrash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredHotels.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
          No hotels match the current filters.
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedHotel ? 'Edit Hotel' : 'Add Hotel'}
        size="xl"
        closeOnClickOutside={false}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name"
              value={formState.name}
              onChange={(event) => updateFormField('name', event.target.value)}
              placeholder="e.g. Giraffe Manor"
            />
            <Input
              label="Slug"
              value={formState.slug}
              onChange={(event) => updateFormField('slug', slugify(event.target.value))}
              placeholder="e.g. giraffe-manor"
            />
            <Input
              label="Destination"
              value={formState.destination}
              onChange={(event) => updateFormField('destination', event.target.value)}
              placeholder="e.g. Nairobi"
            />
            <Input
              label="Region"
              value={formState.region}
              onChange={(event) => updateFormField('region', event.target.value)}
              placeholder="e.g. Nairobi County"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formState.type}
                onChange={(event) => updateFormField('type', event.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 capitalize"
              >
                {hotelTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <Input
              label="Star Rating"
              type="number"
              min="1"
              max="5"
              value={formState.starRating}
              onChange={(event) => updateFormField('starRating', Number(event.target.value || 0))}
            />
            <Input
              label="Price"
              type="number"
              min="0"
              value={formState.price}
              onChange={(event) => updateFormField('price', Number(event.target.value || 0))}
            />
            <Input
              label="Badge"
              value={formState.badge}
              onChange={(event) => updateFormField('badge', event.target.value)}
              placeholder="e.g. Iconic"
            />
          </div>

          <Input
            label="Short Description"
            value={formState.shortDescription}
            onChange={(event) => updateFormField('shortDescription', event.target.value)}
            placeholder="Card summary used on the frontend"
          />

          <TextArea
            label="Description"
            value={formState.description}
            onChange={(event) => updateFormField('description', event.target.value)}
            rows={5}
            placeholder="Full hotel description"
          />

          <TextArea
            label="Amenities"
            value={formState.amenities.join(', ')}
            onChange={(event) => updateFormField('amenities', parseList(event.target.value))}
            rows={4}
            placeholder="Comma-separated list"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Check-In Time"
              value={formState.checkInTime}
              onChange={(event) => updateFormField('checkInTime', event.target.value)}
              placeholder="e.g. 14:00"
            />
            <Input
              label="Check-Out Time"
              value={formState.checkOutTime}
              onChange={(event) => updateFormField('checkOutTime', event.target.value)}
              placeholder="e.g. 11:00"
            />
          </div>

          <TextArea
            label="Cancellation Policy"
            value={formState.cancellationPolicy}
            onChange={(event) => updateFormField('cancellationPolicy', event.target.value)}
            rows={3}
            placeholder="Standard cancellation policy applies..."
          />

          <TextArea
            label="House Rules"
            value={formState.houseRules.join(', ')}
            onChange={(event) => updateFormField('houseRules', parseList(event.target.value))}
            rows={3}
            placeholder="Comma-separated list (e.g. No smoking, Pets not allowed)"
          />

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h3 className="font-semibold text-gray-900">Images</h3>
                <p className="text-sm text-gray-500">
                  Seed image stays as the fallback. Uploading an override keeps the seeded image in place underneath.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Input
                  label="Seed / Default Image URL"
                  value={formState.defaultImage}
                  onChange={(event) => updateFormField('defaultImage', event.target.value)}
                  placeholder="Main fallback image"
                />
                <label className="inline-flex items-center px-4 py-2 rounded-xl bg-white border border-gray-200 cursor-pointer hover:bg-gray-50">
                  <FiUpload className="mr-2" />
                  <span>{uploadingField === 'defaultImage' ? 'Uploading...' : 'Upload Seed Image'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(event) => uploadImage('defaultImage', event)} />
                </label>
              </div>

              <div className="space-y-3">
                <Input
                  label="Override Image URL"
                  value={formState.image}
                  onChange={(event) => updateFormField('image', event.target.value)}
                  placeholder="Optional override image shown before the seed image"
                />
                <div className="flex flex-wrap gap-3">
                  <label className="inline-flex items-center px-4 py-2 rounded-xl bg-white border border-gray-200 cursor-pointer hover:bg-gray-50">
                    <FiUpload className="mr-2" />
                    <span>{uploadingField === 'image' ? 'Uploading...' : 'Upload Override'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(event) => uploadImage('image', event)} />
                  </label>
                  <Button type="button" variant="ghost" onClick={() => updateFormField('image', '')}>
                    <FiX className="mr-2" />
                    Clear Override
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative h-56 rounded-2xl overflow-hidden bg-white border border-gray-200">
                {formState.defaultImage ? (
                  <Image src={formState.defaultImage} alt={formState.name || 'Seed image'} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <FiImage className="w-10 h-10" />
                  </div>
                )}
              </div>
              <div className="relative h-56 rounded-2xl overflow-hidden bg-white border border-gray-200">
                <Image src={getHotelImage(formState)} alt={formState.name || 'Current image'} fill className="object-cover" />
                {formState.image && (
                  <div className="absolute top-4 left-4">
                    <Badge variant="warning">Override Active</Badge>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Gallery Images ({formState.gallery.length})</h3>
                  <p className="text-sm text-gray-500">
                    Additional images for the hotel detail page gallery.
                  </p>
                </div>
                <label className="inline-flex items-center px-4 py-2 rounded-xl bg-white border border-gray-200 cursor-pointer hover:bg-gray-50 shrink-0">
                  <FiUpload className="mr-2" />
                  <span>{uploadingField === 'gallery' ? 'Uploading...' : 'Add Gallery Image'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={uploadGalleryImage} />
                </label>
              </div>

              {formState.gallery.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {formState.gallery.map((imgUrl, index) => (
                    <div key={index} className="relative h-32 rounded-xl overflow-hidden bg-white border border-gray-200 group">
                      <Image src={imgUrl} alt={`Gallery image ${index + 1}`} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shrink-0"
                        title="Remove image"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500 text-sm">
                  No gallery images added yet.
                </div>
              )}
            </div>
          </div>

          <label className="flex items-center gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={formState.featuredOnHome}
              onChange={(event) => updateFormField('featured', event.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            Show this hotel in the homepage and navbar featured set
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              <FiSave className="mr-2" />
              {selectedHotel ? 'Save Changes' : 'Create Hotel'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Hotel"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Delete <span className="font-semibold">{selectedHotel?.name}</span> from the shared hotels catalog?
          </p>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="danger" onClick={handleDelete} loading={saving}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
