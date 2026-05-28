'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiCalendar, FiCheck, FiShield, FiUser, FiUsers, FiX } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const getTitle = (item) => item?.title || item?.name || item?.tour_name || item?.hotel_name || 'Nyle Travel booking';
const getImage = (item) => item?.image || item?.featured_image || item?.featuredImage || item?.tour_image || item?.hotel_image || '/images/hotel-placeholder.svg';
const getPrice = (item) => Number(item?.price || item?.base_price || item?.price_per_night || item?.estimated_price || 0);

export default function BookingIntentModal({
  open,
  onClose,
  item,
  itemType = 'tour',
  basePath = '/cart',
}) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [mode, setMode] = useState('solo');
  const [soloGuests, setSoloGuests] = useState(1);
  const [groupMembers, setGroupMembers] = useState(4);
  const [startDate, setStartDate] = useState('');
  const [paymentDeadline, setPaymentDeadline] = useState('');
  const [customEstimate, setCustomEstimate] = useState(15000);

  const unitPrice = getPrice(item) || Number(customEstimate || 0);
  const travellerCount = mode === 'group' ? Math.max(groupMembers, 2) : Math.max(soloGuests, 1);
  const totalEstimate = useMemo(() => unitPrice * travellerCount, [unitPrice, travellerCount]);
  const equalShare = useMemo(() => Math.ceil(totalEstimate / travellerCount), [totalEstimate, travellerCount]);
  const isDestinationQuote = itemType === 'destination' && getPrice(item) === 0;

  if (!open || !item) return null;

  const handleContinue = () => {
    const bookingMode = mode === 'group' ? 'group_pool' : 'solo';
    const normalizedItem = {
      ...item,
      id: item.id || item.slug || `${itemType}-${Date.now()}`,
      title: getTitle(item),
      name: getTitle(item),
      image: getImage(item),
      price: unitPrice,
      base_price: unitPrice,
      bookingMode,
      bookingPlan: {
        bookingMode,
        itemType,
        travellerCount,
        startDate: startDate || null,
        paymentDeadline: paymentDeadline || null,
        totalEstimate,
        equalContributionAmount: equalShare,
        paymentModeHint: bookingMode === 'group_pool' ? 'group_pool' : 'full_payment',
        sharePolicy: bookingMode === 'group_pool' ? 'equal_split' : 'solo_payment',
        memberRule: bookingMode === 'group_pool'
          ? 'Each member pays the same amount directly to the travel fund.'
          : 'Solo traveller can pay in full or create an installment plan.',
      },
    };

    addToCart(normalizedItem, itemType, {
      quantity: travellerCount,
      bookingMode,
      bookingPlan: normalizedItem.bookingPlan,
    });
    onClose?.();
    router.push(`${basePath}?mode=${bookingMode}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-600">Book now</p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-gray-900">Choose your booking style</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close booking options"
          >
            <FiX size={22} />
          </button>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[240px_1fr]">
          <aside className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
            <div className="relative h-40 bg-gray-100">
              <Image src={getImage(item)} alt={getTitle(item)} fill className="object-cover" />
            </div>
            <div className="p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{itemType}</p>
              <h3 className="mt-1 font-serif text-xl font-bold text-gray-900">{getTitle(item)}</h3>
              <p className="mt-3 text-sm text-gray-600">
                {isDestinationQuote ? 'Start with an estimated per-person amount.' : `${formatCurrency(unitPrice)} per traveller`}
              </p>
            </div>
          </aside>

          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { key: 'solo', title: 'Solo booking', text: 'Book for yourself or a small private party.', icon: FiUser },
                { key: 'group', title: 'Group booking', text: 'Split the trip equally and collect from each member.', icon: FiUsers },
              ].map((option) => {
                const Icon = option.icon;
                const active = mode === option.key;
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setMode(option.key)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      active ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-200'
                    }`}
                  >
                    <Icon className={active ? 'text-primary-600' : 'text-gray-500'} />
                    <p className="mt-3 font-bold text-gray-900">{option.title}</p>
                    <p className="mt-1 text-sm leading-6 text-gray-600">{option.text}</p>
                  </button>
                );
              })}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">
                  {mode === 'group' ? 'Group members' : 'Travellers'}
                </span>
                <input
                  type="number"
                  min={mode === 'group' ? 2 : 1}
                  value={mode === 'group' ? groupMembers : soloGuests}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    if (mode === 'group') setGroupMembers(value);
                    else setSoloGuests(value);
                  }}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
              </label>

              {isDestinationQuote && (
                <label className="block">
                  <span className="text-sm font-semibold text-gray-700">Estimate per member</span>
                  <input
                    type="number"
                    min="1000"
                    value={customEstimate}
                    onChange={(event) => setCustomEstimate(Number(event.target.value))}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </label>
              )}

              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Travel date</span>
                <div className="relative mt-2">
                  <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </label>

              {mode === 'group' && (
                <label className="block">
                  <span className="text-sm font-semibold text-gray-700">Contribution deadline</span>
                  <input
                    type="date"
                    value={paymentDeadline}
                    onChange={(event) => setPaymentDeadline(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </label>
              )}
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Total estimate</p>
                  <p className="mt-1 font-bold text-gray-900">{formatCurrency(totalEstimate)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    {mode === 'group' ? 'Each member pays' : 'Traveller count'}
                  </p>
                  <p className="mt-1 font-bold text-gray-900">{mode === 'group' ? formatCurrency(equalShare) : travellerCount}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Payment route</p>
                  <p className="mt-1 font-bold text-gray-900">{mode === 'group' ? 'Group pool' : 'Solo checkout'}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2 text-sm leading-6 text-gray-600">
                <FiShield className="mt-1 flex-shrink-0 text-primary-600" />
                <span>
                  {mode === 'group'
                    ? 'Nyle will lock the equal contribution amount so every member pays the same share into one travel fund.'
                    : 'Solo bookings can continue to checkout, then pay in full or create an installment plan.'}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button fullWidth onClick={handleContinue}>
                <FiCheck className="mr-2" />
                Continue to cart
              </Button>
              <Button variant="outline" fullWidth onClick={onClose}>
                Keep browsing
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
