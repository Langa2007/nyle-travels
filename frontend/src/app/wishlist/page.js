'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiShoppingBag, FiTrash2 } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';

function itemTitle(item) {
  return item.title || item.name || item.tour_name || item.hotel_name || 'Saved trip';
}

function itemImage(item) {
  return item.image || item.featured_image || item.tour_image || item.hotel_image || '/images/hotel-placeholder.svg';
}

function itemHref(item) {
  const slug = item.slug || item.id;
  if (!slug) return item.type === 'hotel' ? '/hotels' : '/tours';
  return item.type === 'hotel' ? `/hotels/${slug}` : `/tours/${slug}`;
}

export default function WishlistPage() {
  const { wishlist, loading, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

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
            <h1 className="font-serif text-4xl font-bold text-gray-900">Wishlist</h1>
            <p className="mt-2 text-gray-600">Your saved tours and stays.</p>
          </div>
          {wishlist.length > 0 && (
            <Button variant="ghost" icon={FiTrash2} onClick={clearWishlist}>
              Clear wishlist
            </Button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <section className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
            <FiHeart className="mx-auto mb-4 text-primary-500" size={44} />
            <h2 className="font-serif text-2xl font-bold text-gray-900">No saved items yet</h2>
            <p className="mx-auto mt-2 max-w-md text-gray-600">
              Save tours and hotels while browsing, then return here when you are ready to plan.
            </p>
            <Link href="/tours" className="mt-8 inline-flex">
              <Button>Explore tours</Button>
            </Link>
          </section>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {wishlist.map((item) => (
              <article key={`${item.type}-${item.id}`} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="relative h-56">
                  <Image src={itemImage(item)} alt={itemTitle(item)} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <div className="mb-2 text-xs font-bold uppercase tracking-widest text-primary-600">{item.type || 'tour'}</div>
                  <h2 className="font-serif text-2xl font-bold text-gray-900">{itemTitle(item)}</h2>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">{item.description || item.location || 'Saved for your next Nyle Travel itinerary.'}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href={itemHref(item)}>
                      <Button size="sm">View details</Button>
                    </Link>
                    <Button size="sm" variant="outline" icon={FiShoppingBag} onClick={() => addToCart(item, item.type || 'tour')}>
                      Add to cart
                    </Button>
                    <Button size="sm" variant="ghost" icon={FiTrash2} onClick={() => removeFromWishlist(item.id, item.type)}>
                      Remove
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
