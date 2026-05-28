'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FiCheckCircle,
  FiCopy,
  FiCreditCard,
  FiMinus,
  FiPhone,
  FiPlus,
  FiShield,
  FiShoppingCart,
  FiTrash2,
  FiUsers,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import { travelFundsAPI } from '@/lib/api';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

function itemTitle(item) {
  return item.title || item.name || item.tour_name || item.hotel_name || 'Travel item';
}

function itemImage(item) {
  return item.image || item.featured_image || item.tour_image || item.hotel_image || '/images/hotel-placeholder.svg';
}

function itemPrice(item) {
  return Number(item.price || item.base_price || item.price_per_night || 0);
}

function TravelFundCheckout({ cart, total }) {
  const hasGroupBooking = cart.some((item) => item.bookingMode === 'group_pool' || item.bookingPlan?.bookingMode === 'group_pool');
  const firstPlan = cart.find((item) => item.bookingPlan)?.bookingPlan;
  const preferredMode = hasGroupBooking ? 'group_pool' : firstPlan?.paymentModeHint || 'full_payment';
  const [mode, setMode] = useState(preferredMode);
  const [phone, setPhone] = useState('');
  const [participants, setParticipants] = useState(Math.max(2, firstPlan?.travellerCount || cart.reduce((sum, item) => sum + item.quantity, 0)));
  const [depositPercent, setDepositPercent] = useState(30);
  const [months, setMonths] = useState(4);
  const [dueDate, setDueDate] = useState(firstPlan?.paymentDeadline || '');
  const [loading, setLoading] = useState(false);
  const [createdFund, setCreatedFund] = useState(null);

  useEffect(() => {
    if (hasGroupBooking) {
      setMode('group_pool');
      setParticipants(Math.max(2, firstPlan?.travellerCount || participants));
      if (firstPlan?.paymentDeadline) setDueDate(firstPlan.paymentDeadline);
    }
  }, [hasGroupBooking, firstPlan?.travellerCount, firstPlan?.paymentDeadline, participants]);

  const depositAmount = useMemo(() => Math.round((total * depositPercent) / 100), [depositPercent, total]);
  const monthlyAmount = useMemo(() => {
    const balance = Math.max(total - depositAmount, 0);
    return Math.ceil(balance / Math.max(months, 1));
  }, [depositAmount, months, total]);
  const perPerson = useMemo(() => Math.ceil(total / Math.max(participants, 1)), [participants, total]);

  const handleCreateFund = async () => {
    if (!total) return;
    setLoading(true);
    setCreatedFund(null);

    try {
      const tripTitle = cart.length === 1 ? itemTitle(cart[0]) : `${cart.length} item Nyle trip`;
      const response = await travelFundsAPI.create({
        title: tripTitle,
        mode,
        phone,
        total_amount: total,
        deposit_amount: mode === 'full_payment' ? total : depositAmount,
        initial_amount: mode === 'full_payment' ? total : depositAmount,
        participants,
        due_date: dueDate || null,
        share_policy: hasGroupBooking ? 'equal_split_locked' : 'solo_or_installment',
        equal_contribution_amount: mode === 'group_pool' ? perPerson : null,
        cart_items: cart.map((item) => ({
          id: item.id,
          type: item.type,
          title: itemTitle(item),
          quantity: item.quantity,
          amount: itemPrice(item),
        })),
      });

      const fund = response.data.data.fund;
      setCreatedFund(fund);
      toast.success('Travel fund preview created');
    } catch (error) {
      console.error('Failed to create travel fund:', error);
      toast.error(error.response?.data?.message || 'Sign in to create a travel fund');
    } finally {
      setLoading(false);
    }
  };

  const copyShareLink = async () => {
    if (!createdFund?.share_url) return;
    await navigator.clipboard.writeText(createdFund.share_url);
    toast.success('Share link copied');
  };

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
          <FiShield size={20} />
        </div>
        <div>
          <h2 className="font-serif text-2xl font-bold text-gray-900">Pay with M-Pesa, installments, or a group pool</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Contributions are tracked as customer funds held through a licensed payment or escrow provider. Nyle only
            recognizes commission after the trip is confirmed and supplier obligations are accepted.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { key: 'full_payment', label: 'Pay now', icon: FiCreditCard },
          { key: 'installment_plan', label: 'Lipa Pole Pole', icon: FiPhone },
          { key: 'group_pool', label: 'Group pool', icon: FiUsers },
        ].map((option) => {
          const Icon = option.icon;
          const active = mode === option.key;
          const disabled = hasGroupBooking && option.key !== 'group_pool';
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => !disabled && setMode(option.key)}
              disabled={disabled}
              className={`flex min-h-20 items-center gap-3 rounded-xl border p-4 text-left transition ${
                active ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-700 hover:border-primary-200'
              } ${disabled ? 'cursor-not-allowed opacity-40' : ''}`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-bold">{option.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-gray-700">M-Pesa phone</span>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="2547..."
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Payment deadline</span>
          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </label>
      </div>

      {mode !== 'full_payment' && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">Opening deposit</span>
            <select
              value={depositPercent}
              onChange={(event) => setDepositPercent(Number(event.target.value))}
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >
              <option value={20}>20%</option>
              <option value={30}>30%</option>
              <option value={50}>50%</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">{mode === 'group_pool' ? 'People paying' : 'Months'}</span>
            <input
              type="number"
              min="1"
              value={mode === 'group_pool' ? participants : months}
              onChange={(event) => {
                const value = Number(event.target.value);
                if (mode === 'group_pool') setParticipants(value);
                else setMonths(value);
              }}
              disabled={hasGroupBooking && mode === 'group_pool'}
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </label>
        </div>
      )}

      <div className="mt-6 grid gap-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-700 sm:grid-cols-3">
        <div>
          <p className="text-xs font-bold uppercase text-gray-500">First payment</p>
          <p className="mt-1 font-bold text-gray-900">{formatCurrency(mode === 'full_payment' ? total : depositAmount)}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-gray-500">{mode === 'group_pool' ? 'Each person' : 'Monthly estimate'}</p>
          <p className="mt-1 font-bold text-gray-900">{formatCurrency(mode === 'group_pool' ? perPerson : monthlyAmount)}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-gray-500">Nyle revenue now</p>
          <p className="mt-1 font-bold text-gray-900">{formatCurrency(0)}</p>
        </div>
      </div>

      {hasGroupBooking && (
        <div className="mt-4 rounded-xl border border-primary-100 bg-primary-50 p-4 text-sm leading-6 text-primary-900">
          This cart started as a group booking. Nyle will create one shared travel fund, lock the equal member amount at
          {` ${formatCurrency(perPerson)} `}each, and track who has contributed before confirming supplier reservations.
        </div>
      )}

      {createdFund && (
        <div className="mt-6 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-900">
          <div className="flex items-start gap-3">
            <FiCheckCircle className="mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-bold">Travel fund created: {createdFund.fund_number}</p>
              <p className="mt-1 break-words text-green-800">{createdFund.share_url}</p>
              <button
                type="button"
                onClick={copyShareLink}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 font-semibold text-green-700"
              >
                <FiCopy /> Copy WhatsApp share link
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button fullWidth loading={loading} onClick={handleCreateFund}>
          {mode === 'group_pool' ? 'Create group payment link' : mode === 'installment_plan' ? 'Create payment plan' : 'Start M-Pesa checkout'}
        </Button>
        <Link href="/travel-fund" className="sm:w-auto">
          <Button variant="outline" fullWidth>
            Learn how funds are held
          </Button>
        </Link>
      </div>
    </section>
  );
}

export default function CartPage() {
  const { cart, loading, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const total = getCartTotal();

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-32">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-4xl font-bold text-gray-900">Cart</h1>
            <p className="mt-2 text-gray-600">Review your trip and choose how the money will be collected.</p>
          </div>
          {cart.length > 0 && (
            <Button variant="ghost" icon={FiTrash2} onClick={clearCart}>
              Clear cart
            </Button>
          )}
        </div>

        {cart.length === 0 ? (
          <section className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
            <FiShoppingCart className="mx-auto mb-4 text-primary-500" size={44} />
            <h2 className="font-serif text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="mx-auto mt-2 max-w-md text-gray-600">
              Add tours or hotels, then come back here to continue planning.
            </p>
            <Link href="/tours" className="mt-8 inline-flex">
              <Button>Browse tours</Button>
            </Link>
          </section>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-6">
              <section className="space-y-4">
                {cart.map((item) => {
                  const price = itemPrice(item);
                  const isGroupItem = item.bookingMode === 'group_pool' || item.bookingPlan?.bookingMode === 'group_pool';
                  return (
                    <article key={`${item.type}-${item.id}`} className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm sm:flex-row">
                      <div className="relative h-48 sm:h-auto sm:w-56 sm:flex-shrink-0">
                        <Image src={itemImage(item)} alt={itemTitle(item)} fill className="object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col justify-between gap-6 p-6">
                        <div>
                          <div className="text-xs font-bold uppercase tracking-widest text-primary-600">{item.type || 'tour'}</div>
                          <h2 className="mt-1 font-serif text-2xl font-bold text-gray-900">{itemTitle(item)}</h2>
                          <p className="mt-2 text-sm text-gray-600">{formatCurrency(price)} each</p>
                          {item.bookingPlan && (
                            <div className="mt-3 rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
                              <p className="font-bold text-gray-900">
                                {item.bookingMode === 'group_pool' ? 'Group pool booking' : 'Solo booking'}
                              </p>
                              <p className="mt-1">
                                {item.bookingMode === 'group_pool'
                                  ? `Equal split: ${formatCurrency(item.bookingPlan.equalContributionAmount)} per member for ${item.bookingPlan.travellerCount} members.`
                                  : `${item.bookingPlan.travellerCount} traveller(s). Pay in full or create an installment plan.`}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center rounded-xl border border-gray-200">
                            <button
                              className="p-3 text-gray-600 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-40"
                              onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                              aria-label="Decrease quantity"
                              disabled={isGroupItem}
                            >
                              <FiMinus />
                            </button>
                            <span className="min-w-10 text-center font-semibold">{item.quantity}</span>
                            <button
                              className="p-3 text-gray-600 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-40"
                              onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                              aria-label="Increase quantity"
                              disabled={isGroupItem}
                            >
                              <FiPlus />
                            </button>
                          </div>
                          {isGroupItem && (
                            <span className="text-xs font-semibold text-primary-700">
                              Members are locked for equal split
                            </span>
                          )}
                          <Button variant="ghost" size="sm" icon={FiTrash2} onClick={() => removeFromCart(item.id, item.type)}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </section>

              <TravelFundCheckout cart={cart} total={total} />
            </div>

            <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-gray-900">Summary</h2>
              <div className="mt-6 space-y-3 border-b border-gray-100 pb-6 text-sm text-gray-600">
                <div className="flex justify-between"><span>Items</span><span>{cart.length}</span></div>
                <div className="flex justify-between"><span>Estimated total</span><span>{formatCurrency(total)}</span></div>
                <div className="flex justify-between"><span>Customer funds holder</span><span className="text-right font-semibold text-gray-900">Licensed provider</span></div>
              </div>
              <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                Funds collected before confirmation are customer liabilities. Supplier payouts and Nyle commission are released only after booking milestones are met.
              </div>
              <Link href="/contact" className="mt-6 block">
                <Button variant="outline" fullWidth>Ask a travel advisor</Button>
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
