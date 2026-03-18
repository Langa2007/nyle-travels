'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import { FiUsers, FiCalendar, FiDollarSign, FiShield } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { bookingsAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import 'react-datepicker/dist/react-datepicker.css';

export default function BookingWidget({ tour }) {
  const [startDate, setStartDate] = useState(null);
  const [guests, setGuests] = useState(2);
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  const checkAvailability = async (date) => {
    try {
      const response = await toursAPI.checkAvailability(tour.id, date, guests);
      setAvailability(response.data.data);
    } catch (error) {
      console.error('Availability check failed:', error);
    }
  };

  const handleDateChange = (date) => {
    setStartDate(date);
    if (date) {
      checkAvailability(date);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please login to book this tour');
      router.push('/login');
      return;
    }

    if (!startDate) {
      toast.error('Please select a date');
      return;
    }

    if (!availability?.available) {
      toast.error('Selected date is not available');
      return;
    }

    setLoading(true);
    try {
      const response = await bookingsAPI.create({
        tour_package_id: tour.id,
        start_date: startDate,
        guests,
      });

      toast.success('Booking created successfully!');
      router.push(`/dashboard/bookings/${response.data.data.booking.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const subtotal = tour.base_price * guests;
    const discount = (subtotal * (tour.discount_percentage || 0)) / 100;
    return subtotal - discount;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="mb-6">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-3xl font-bold text-primary-600">
            ${tour.base_price}
          </span>
          <span className="text-gray-500">per person</span>
        </div>
        {tour.discount_percentage > 0 && (
          <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Save {tour.discount_percentage}% - Limited Time Offer
          </div>
        )}
      </div>

      <div className="space-y-4 mb-6">
        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <DatePicker
              selected={startDate}
              onChange={handleDateChange}
              minDate={new Date()}
              placeholderText="Choose your start date"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              dateFormat="MMMM d, yyyy"
            />
          </div>
          {availability && (
            <p className={`mt-2 text-sm ${availability.available ? 'text-green-600' : 'text-red-600'}`}>
              {availability.available 
                ? `${availability.slots} spots available` 
                : 'Not available on this date'}
            </p>
          )}
        </div>

        {/* Guest Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Guests
          </label>
          <div className="relative">
            <FiUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none"
            >
              {[...Array(tour.group_size_max || 10).keys()].map((num) => (
                <option key={num + 1} value={num + 1}>
                  {num + 1} {num === 0 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              ${tour.base_price} x {guests} {guests === 1 ? 'guest' : 'guests'}
            </span>
            <span className="font-medium">${tour.base_price * guests}</span>
          </div>
          {tour.discount_percentage > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount ({tour.discount_percentage}%)</span>
              <span>-${(tour.base_price * guests * tour.discount_percentage / 100).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Taxes & fees</span>
            <span>Calculated at checkout</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <span className="font-semibold">Total</span>
          <span className="text-2xl font-bold text-primary-600">
            ${calculateTotal().toFixed(2)}
          </span>
        </div>
      </div>

      {/* Book Button */}
      <Button
        onClick={handleBooking}
        loading={loading}
        disabled={!availability?.available}
        fullWidth
        size="lg"
        className="mb-4"
      >
        {loading ? 'Processing...' : 'Book Now'}
      </Button>

      {/* Guarantee */}
      <div className="flex items-center justify-center text-sm text-gray-500">
        <FiShield className="mr-2" />
        <span>Free cancellation up to 30 days before</span>
      </div>

      {/* Quick Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <h4 className="font-semibold mb-3">Important Information</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start">
            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 mr-2" />
            <span>Minimum age: {tour.min_age || 'No minimum'}</span>
          </li>
          <li className="flex items-start">
            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 mr-2" />
            <span>Private tour available</span>
          </li>
          <li className="flex items-start">
            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 mr-2" />
            <span>Instant confirmation</span>
          </li>
        </ul>
      </div>
    </div>
  );
}