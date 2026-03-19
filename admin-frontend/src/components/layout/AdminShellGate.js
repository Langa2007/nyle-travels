'use client';

import { usePathname } from 'next/navigation';
import AdminShell from '@/components/layout/AdminShell';

const PUBLIC_ROUTES = new Set(['/login']);

export default function AdminShellGate({ children }) {
  const pathname = usePathname();

  if (PUBLIC_ROUTES.has(pathname)) {
    return children;
  }

  return <AdminShell>{children}</AdminShell>;
}
