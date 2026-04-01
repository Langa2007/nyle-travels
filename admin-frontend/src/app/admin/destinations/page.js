'use client';

import { useEffect, useState } from 'react';
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
import { destinations as seedDestinations } from '@/data/destinations';

const SETTINGS_KEY = 'destinations_catalog';

function slugify(value) {
  return value
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

function normalizeDestination(destination, index = 0) {
  return {
    ...destination,
    id: destination.id ?? `destination-${index + 1}`,
    name: destination.name ?? '',
    slug: destination.slug ?? slugify(destination.name || `destination-${index + 1}`),
    region: destination.region ?? '',
    country: destination.country ?? 'Kenya',
    description: destination.description ?? '',
    shortDescription: destination.shortDescription ?? '',
    bestTimeToVisit: destination.bestTimeToVisit ?? '',
    weather: destination.weather ?? '',
    activities: parseList(destination.activities),
    wildlife: parseList(destination.wildlife),
    image: destination.image ?? '',
    gallery: parseList(destination.gallery),
    rating: Number(destination.rating ?? 4),
    featured: Boolean(destination.featured),
    tourCount: Number(destination.tourCount ?? 0),
    hotelCount: Number(destination.hotelCount ?? 0),
    area: destination.area ? String(destination.area) : '',
    established: destination.established ? String(destination.established) : '',
  };
}

function createEmptyDestination() {
  return normalizeDestination(
    {
      id: `draft-${Date.now()}`,
      name: '',
      slug: '',
      region: '',
      country: 'Kenya',
      description: '',
      shortDescription: '',
      bestTimeToVisit: '',
      weather: '',
      activities: [],
      wildlife: [],
      image: '',
      gallery: [],
      rating: 4,
      featured: false,
      tourCount: 0,
      hotelCount: 0,
      area: '',
      established: '',
    },
    0
  );
}

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [formState, setFormState] = useState(createEmptyDestination());

  const seedCatalog = seedDestinations.map((destination, index) =>
    normalizeDestination(destination, index)
  );

  useEffect(() => {
    loadDestinations();
  }, []);

  async function loadDestinations() {
    setLoading(true);

    try {
      const response = await adminAPI.getSettings();
      const savedCatalog = response.data?.data?.[SETTINGS_KEY];

      if (Array.isArray(savedCatalog) && savedCatalog.length > 0) {
        setDestinations(savedCatalog.map((destination, index) => normalizeDestination(destination, index)));
      } else {
        setDestinations(seedCatalog);
      }
    } catch (error) {
      console.error('Failed to load destinations catalog:', error);
      toast.error('Failed to load saved destinations. Showing main-site catalog instead.');
      setDestinations(seedCatalog);
    } finally {
      setLoading(false);
    }
  }

  async function persistCatalog(nextCatalog, successMessage) {
    setSaving(true);

    try {
      await adminAPI.updateSettings({
        [SETTINGS_KEY]: nextCatalog,
      });
      setDestinations(nextCatalog);
      toast.success(successMessage);
      return true;
    } catch (error) {
      console.error('Failed to save destinations catalog:', error);
      toast.error('Failed to save destinations catalog.');
      return false;
    } finally {
      setSaving(false);
    }
  }

  function openCreateModal() {
    setSelectedDestination(null);
    setFormState(createEmptyDestination());
    setIsModalOpen(true);
  }

  function openEditModal(destination) {
    setSelectedDestination(destination);
    setFormState(normalizeDestination(destination));
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedDestination(null);
    setFormState(createEmptyDestination());
  }

  function updateFormField(field, value) {
    setFormState((current) => {
      const next = { ...current, [field]: value };

      if (field === 'name' && (!current.slug || current.slug === slugify(current.name))) {
        next.slug = slugify(value);
      }

      return next;
    });
  }

  async function handleMainImageUpload(event) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    setUploading(true);

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
        image: imageUrl,
      }));
      toast.success('Main image uploaded.');
    } catch (error) {
      console.error('Failed to upload main image:', error);
      toast.error('Failed to upload main image.');
    } finally {
      setUploading(false);
    }
  }

  async function handleGalleryUpload(event) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    setUploading(true);

    try {
      const payload = new FormData();
      payload.append('media', file);
      const response = await adminAPI.uploadMedia(payload, false);
      const imageUrl = response.data?.data?.url;

      if (!imageUrl) {
        throw new Error('Missing uploaded gallery image URL');
      }

      setFormState((current) => ({
        ...current,
        gallery: [...current.gallery, imageUrl],
      }));
      toast.success('Gallery image uploaded.');
    } catch (error) {
      console.error('Failed to upload gallery image:', error);
      toast.error('Failed to upload gallery image.');
    } finally {
      setUploading(false);
    }
  }

  function removeGalleryImage(imageUrl) {
    setFormState((current) => ({
      ...current,
      gallery: current.gallery.filter((image) => image !== imageUrl),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !formState.name.trim() ||
      !formState.region.trim() ||
      !formState.country.trim() ||
      !formState.shortDescription.trim() ||
      !formState.description.trim()
    ) {
      toast.error('Name, region, country, short description, and description are required.');
      return;
    }

    const nextDestination = normalizeDestination({
      ...(selectedDestination || {}),
      ...formState,
      slug: formState.slug ? slugify(formState.slug) : slugify(formState.name),
    });

    const nextCatalog = selectedDestination
      ? destinations.map((destination) =>
          destination.id === selectedDestination.id ? nextDestination : destination
        )
      : [nextDestination, ...destinations];

    const saved = await persistCatalog(
      nextCatalog,
      selectedDestination ? 'Destination updated successfully.' : 'Destination created successfully.'
    );

    if (saved) {
      closeModal();
    }
  }

  async function handleDelete() {
    if (!selectedDestination) {
      return;
    }

    const nextCatalog = destinations.filter((destination) => destination.id !== selectedDestination.id);
    const saved = await persistCatalog(nextCatalog, 'Destination removed successfully.');

    if (saved) {
      setIsDeleteModalOpen(false);
      setSelectedDestination(null);
    }
  }

  async function handleSyncFromMainSite() {
    if (!window.confirm('Replace the admin destinations catalog with the current main-site destination data?')) {
      return;
    }

    await persistCatalog(seedCatalog, 'Main-site destinations synced to admin.');
  }

  async function handleToggleFeatured(destination) {
    const nextCatalog = destinations.map((item) =>
      item.id === destination.id ? { ...item, featured: !item.featured } : item
    );

    await persistCatalog(
      nextCatalog,
      `${destination.name} ${destination.featured ? 'removed from' : 'added to'} featured destinations.`
    );
  }

  const filteredDestinations = destinations.filter((destination) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      destination.name.toLowerCase().includes(query) ||
      destination.region.toLowerCase().includes(query) ||
      destination.country.toLowerCase().includes(query) ||
      destination.description.toLowerCase().includes(query);
    const matchesRegion = regionFilter === 'all' || destination.region === regionFilter;
    const matchesFeatured = !featuredOnly || destination.featured;

    return matchesSearch && matchesRegion && matchesFeatured;
  });

  const regions = ['all', ...new Set(destinations.map((destination) => destination.region).filter(Boolean))];
  const totalFeatured = destinations.filter((destination) => destination.featured).length;
  const averageRating = destinations.length
    ? (destinations.reduce((sum, destination) => sum + Number(destination.rating || 0), 0) / destinations.length).toFixed(1)
    : '0.0';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading destinations catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Destinations Catalog</h1>
          <p className="text-gray-500 mt-1">
            Manage the same destination catalog used by the main website and the new static destinations page.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={loadDestinations} loading={loading}>
            <FiRefreshCw className="mr-2" />
            Reload
          </Button>
          <Button variant="outline" onClick={handleSyncFromMainSite} loading={saving}>
            <FiSave className="mr-2" />
            Sync Main Site
          </Button>
          <Button variant="primary" onClick={openCreateModal}>
            <FiPlus className="mr-2" />
            Add Destination
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Destinations</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{destinations.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Featured</p>
          <p className="text-2xl font-bold text-primary-600 mt-1">{totalFeatured}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Average Rating</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{averageRating}</p>
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
              placeholder="Search by name, region, country, or description..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={regionFilter}
            onChange={(event) => setRegionFilter(event.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region === 'all' ? 'All Regions' : region}
              </option>
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
        {filteredDestinations.map((destination) => (
          <div
            key={destination.id}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="relative h-52 bg-gray-100">
              {destination.image ? (
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <FiImage className="w-10 h-10" />
                </div>
              )}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                {destination.featured && <Badge variant="primary">Featured</Badge>}
                <Badge variant="default">{destination.country}</Badge>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{destination.name}</h2>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <FiMapPin className="w-4 h-4 mr-1" />
                    <span>{destination.region}</span>
                  </div>
                </div>
                <div className="flex items-center text-sm font-medium text-yellow-600">
                  <FiStar className="w-4 h-4 mr-1" />
                  {destination.rating}
                </div>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2">{destination.shortDescription}</p>

              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span className="px-2 py-1 bg-gray-100 rounded-full">{destination.tourCount} tours</span>
                <span className="px-2 py-1 bg-gray-100 rounded-full">{destination.hotelCount} hotels</span>
                {destination.bestTimeToVisit && (
                  <span className="px-2 py-1 bg-gray-100 rounded-full">{destination.bestTimeToVisit}</span>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => handleToggleFeatured(destination)}
                  className={`text-sm font-medium ${
                    destination.featured ? 'text-primary-600' : 'text-gray-500 hover:text-primary-600'
                  }`}
                >
                  {destination.featured ? 'Featured' : 'Set Featured'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(destination)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Edit destination"
                  >
                    <FiEdit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDestination(destination);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete destination"
                  >
                    <FiTrash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDestinations.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
          No destinations match the current filters.
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedDestination ? 'Edit Destination' : 'Add Destination'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name"
              value={formState.name}
              onChange={(event) => updateFormField('name', event.target.value)}
              placeholder="e.g. Maasai Mara National Reserve"
            />
            <Input
              label="Slug"
              value={formState.slug}
              onChange={(event) => updateFormField('slug', slugify(event.target.value))}
              placeholder="e.g. maasai-mara"
            />
            <Input
              label="Region"
              value={formState.region}
              onChange={(event) => updateFormField('region', event.target.value)}
              placeholder="e.g. Rift Valley"
            />
            <Input
              label="Country"
              value={formState.country}
              onChange={(event) => updateFormField('country', event.target.value)}
              placeholder="Kenya"
            />
          </div>

          <Input
            label="Short Description"
            value={formState.shortDescription}
            onChange={(event) => updateFormField('shortDescription', event.target.value)}
            placeholder="Short summary used in destination cards"
          />

          <TextArea
            label="Description"
            value={formState.description}
            onChange={(event) => updateFormField('description', event.target.value)}
            rows={5}
            placeholder="Full destination description"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Best Time To Visit"
              value={formState.bestTimeToVisit}
              onChange={(event) => updateFormField('bestTimeToVisit', event.target.value)}
              placeholder="e.g. July to October"
            />
            <Input
              label="Weather"
              value={formState.weather}
              onChange={(event) => updateFormField('weather', event.target.value)}
              placeholder="e.g. Warm days, cool nights"
            />
            <Input
              label="Area"
              value={formState.area}
              onChange={(event) => updateFormField('area', event.target.value)}
              placeholder="e.g. 1,510 km2"
            />
            <Input
              label="Established"
              value={formState.established}
              onChange={(event) => updateFormField('established', event.target.value)}
              placeholder="e.g. 1961"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={formState.rating}
              onChange={(event) => updateFormField('rating', Number(event.target.value || 0))}
            />
            <Input
              label="Tour Count"
              type="number"
              min="0"
              value={formState.tourCount}
              onChange={(event) => updateFormField('tourCount', Number(event.target.value || 0))}
            />
            <Input
              label="Hotel Count"
              type="number"
              min="0"
              value={formState.hotelCount}
              onChange={(event) => updateFormField('hotelCount', Number(event.target.value || 0))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextArea
              label="Activities"
              value={formState.activities.join(', ')}
              onChange={(event) => updateFormField('activities', parseList(event.target.value))}
              rows={4}
              placeholder="Comma-separated list"
            />
            <TextArea
              label="Wildlife"
              value={formState.wildlife.join(', ')}
              onChange={(event) => updateFormField('wildlife', parseList(event.target.value))}
              rows={4}
              placeholder="Comma-separated list"
            />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">Images</h3>
                <p className="text-sm text-gray-500">Upload the cover image and gallery images used on the static destinations page.</p>
              </div>
              <label className="inline-flex items-center px-4 py-2 rounded-xl bg-white border border-gray-200 cursor-pointer hover:bg-gray-50">
                <FiUpload className="mr-2" />
                <span>{uploading ? 'Uploading...' : 'Upload Main Image'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleMainImageUpload} />
              </label>
            </div>

            <div className="relative h-56 rounded-2xl overflow-hidden bg-white border border-gray-200">
              {formState.image ? (
                <Image src={formState.image} alt={formState.name || 'Destination'} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <FiImage className="w-10 h-10" />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Gallery</h4>
              <label className="inline-flex items-center px-4 py-2 rounded-xl bg-white border border-gray-200 cursor-pointer hover:bg-gray-50">
                <FiPlus className="mr-2" />
                <span>{uploading ? 'Uploading...' : 'Add Gallery Image'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleGalleryUpload} />
              </label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formState.gallery.map((imageUrl) => (
                <div key={imageUrl} className="relative h-28 rounded-xl overflow-hidden bg-white border border-gray-200">
                  <Image src={imageUrl} alt="Gallery" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(imageUrl)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {formState.gallery.length === 0 && (
                <div className="col-span-full text-sm text-gray-500 bg-white border border-dashed border-gray-300 rounded-xl p-4 text-center">
                  No gallery images added yet.
                </div>
              )}
            </div>
          </div>

          <label className="flex items-center gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={formState.featured}
              onChange={(event) => updateFormField('featured', event.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            Feature this destination on the main site
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              <FiSave className="mr-2" />
              {selectedDestination ? 'Save Changes' : 'Create Destination'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Destination"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Delete <span className="font-semibold">{selectedDestination?.name}</span> from the destinations catalog?
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
