'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FiClock, 
  FiUsers, 
  FiMapPin, 
  FiStar, 
  FiCalendar,
  FiDollarSign,
  FiShield,
  FiWifi,
  FiCoffee,
  FiCamera,
  FiHeart,
  FiShare2,
  FiChevronRight,
  FiCheckCircle
} from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import { useParams } from 'next/navigation';
import { toursAPI } from '@/lib/api';
import Button from '@/components/ui/Button';
import Rating from '@/components/ui/Rating';
import BookingWidget from '@/components/tours/BookingWidget';
import TourMap from '@/components/tours/TourMap';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewForm from '@/components/reviews/ReviewForm';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function TourDetails() {
  const { slug } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    fetchTour();
  }, [slug]);

  const fetchTour = async () => {
    try {
      const response = await toursAPI.getOne(slug);
      setTour(response.data.data.tour);
    } catch (error) {
      console.error('Failed to fetch tour:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Tour Not Found</h2>
          <Link href="/tours">
            <Button>Browse Tours</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Gallery Section */}
      <section className="relative h-[70vh]">
        <Swiper
          modules={[Navigation, Pagination, Thumbs]}
          navigation
          pagination={{ clickable: true }}
          thumbs={{ swiper: thumbsSwiper }}
          className="h-full"
        >
          {tour.gallery_images?.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full">
                <Image
                  src={image}
                  alt={`${tour.name} - ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Thumbnail Navigation */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            className="thumbs-slider"
          >
            {tour.gallery_images?.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-24 h-16 cursor-pointer rounded-lg overflow-hidden border-2 border-white/50 hover:border-primary-500 transition-colors">
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 z-20 flex space-x-2">
          <button
            onClick={() => setInWishlist(!inWishlist)}
            className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            <FiHeart
              className={`w-5 h-5 ${
                inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </button>
          <button className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
            <FiShare2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2">
              {/* Breadcrumbs */}
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Link href="/" className="hover:text-primary-600">Home</Link>
                <FiChevronRight className="mx-2" />
                <Link href="/tours" className="hover:text-primary-600">Tours</Link>
                <FiChevronRight className="mx-2" />
                <span className="text-gray-900">{tour.name}</span>
              </div>

              {/* Title & Rating */}
              <div className="mb-6">
                <h1 className="text-4xl font-serif font-bold mb-4">{tour.name}</h1>
                <div className="flex items-center space-x-4">
                  <Rating value={tour.average_rating} />
                  <span className="text-gray-600">
                    ({tour.review_count} reviews)
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="text-primary-600 font-semibold">
                    {tour.difficulty_level}
                  </span>
                </div>
              </div>

              {/* Quick Info */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
              >
                <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
                    <FiClock className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Duration</div>
                  <div className="font-serif text-lg font-bold text-gray-900">{tour.duration_days} Days</div>
                </div>
                <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
                    <FiUsers className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Group Size</div>
                  <div className="font-serif text-lg font-bold text-gray-900">Max {tour.group_size_max}</div>
                </div>
                <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
                    <FiMapPin className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Location</div>
                  <div className="font-serif text-lg font-bold text-gray-900 truncate">{tour.destination_name}</div>
                </div>
                <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
                    <FiCalendar className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Best Time</div>
                  <div className="font-serif text-lg font-bold text-gray-900 line-clamp-1">{tour.best_time_to_visit || 'Year-round'}</div>
                </div>
              </motion.div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <div className="flex space-x-8">
                  {['overview', 'itinerary', 'includes', 'reviews', 'location'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 text-sm font-medium capitalize border-b-2 transition-colors ${
                        activeTab === tab
                          ? 'border-primary-600 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="mb-8">
                {activeTab === 'overview' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="prose max-w-none"
                  >
                    <p className="text-lg text-gray-600 mb-6">
                      {tour.short_description}
                    </p>
                    <div className="whitespace-pre-line">
                      {tour.description}
                    </div>

                    {/* Highlights */}
                    <h3 className="text-xl font-semibold mt-8 mb-4">Tour Highlights</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {tour.highlights?.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <FiCheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {activeTab === 'itinerary' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    {tour.itineraries?.map((day, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center mb-4">
                          <span className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                            {day.day_number}
                          </span>
                          <h3 className="text-xl font-semibold ml-4">{day.title}</h3>
                        </div>
                        <p className="text-gray-600 mb-4">{day.description}</p>
                        
                        {day.activities && day.activities.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-semibold mb-2">Activities:</h4>
                            <div className="flex flex-wrap gap-2">
                              {day.activities.map((activity, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 bg-white rounded-full text-sm"
                                >
                                  {activity}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {day.accommodation_name && (
                          <div className="mt-4 p-4 bg-white rounded-lg">
                            <div className="flex items-center">
                              <FiCoffee className="w-5 h-5 text-primary-600 mr-2" />
                              <span className="font-medium">Accommodation:</span>
                              <span className="ml-2">{day.accommodation_name}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {day.accommodation_description}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'includes' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  >
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-green-600">Included</h3>
                      <ul className="space-y-3">
                        {tour.included_items?.map((item, index) => (
                          <li key={index} className="flex items-center">
                            <FiCheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-red-600">Not Included</h3>
                      <ul className="space-y-3">
                        {tour.excluded_items?.map((item, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-3 flex-shrink-0">×</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'reviews' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <ReviewList tourId={tour.id} />
                    {user && <ReviewForm tourId={tour.id} />}
                  </motion.div>
                )}

                {activeTab === 'location' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <TourMap 
                      center={{ lat: tour.latitude, lng: tour.longitude }}
                      markers={[
                        {
                          lat: tour.latitude,
                          lng: tour.longitude,
                          title: tour.name
                        }
                      ]}
                    />
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">How to Get There</h3>
                      <p className="text-gray-600">{tour.how_to_get_there}</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right Column - Booking Widget */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <BookingWidget tour={tour} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}