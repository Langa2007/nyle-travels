'use client';

import { useParams } from 'next/navigation';
import OffersPage from '../page';

export default function SingleOfferPage() {
  const { id } = useParams();
  
  // For now, we redirect to the main offers page or show the specific one
  // Since we have a small list, we can just reuse the OffersPage layout
  // and maybe filter it in the future.
  return <OffersPage />;
}
