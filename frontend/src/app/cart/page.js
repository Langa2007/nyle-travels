'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiMinus, FiPlus, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value || 0);

function itemTitle(item) {
  return item.title || item.name || item.tour_name || item.hotel_name || 'Travel item';
}

function itemImage(item) {
  return item.image || item.featured_image || item.tour_image || item.hotel_image || '/images/hotel-placeholder.svg';
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
            <p className="mt-2 text-gray-600">Review the trips you are collecting.</p>
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
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <section className="space-y-4">
              {cart.map((item) => {
                const price = item.price || item.base_price || 0;
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
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center rounded-xl border border-gray-200">
                          <button className="p-3 text-gray-600 hover:text-primary-600" onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)} aria-label="Decrease quantity">
                            <FiMinus />
                          </button>
                          <span className="min-w-10 text-center font-semibold">{item.quantity}</span>
                          <button className="p-3 text-gray-600 hover:text-primary-600" onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)} aria-label="Increase quantity">
                            <FiPlus />
                          </button>
                        </div>
                        <Button variant="ghost" size="sm" icon={FiTrash2} onClick={() => removeFromCart(item.id, item.type)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-gray-900">Summary</h2>
              <div className="mt-6 space-y-3 border-b border-gray-100 pb-6 text-sm text-gray-600">
                <div className="flex justify-between"><span>Items</span><span>{cart.length}</span></div>
                <div className="flex justify-between"><span>Estimated total</span><span>{formatCurrency(total)}</span></div>
              </div>
              <Link href="/contact" className="mt-6 block">
                <Button fullWidth>Request booking help</Button>
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
