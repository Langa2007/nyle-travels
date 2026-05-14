'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiMail, FiPhone, FiShield, FiUser } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardProfilePage() {
  const { user, loading, updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-32">
        <Loader />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-28">
        <section className="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
          <FiShield className="mx-auto mb-4 text-primary-500" size={44} />
          <h1 className="font-serif text-3xl font-bold text-gray-900">Sign in to view your profile</h1>
          <p className="mt-2 text-gray-600">Your account details are available after sign in.</p>
          <Link href="/login" className="mt-8 inline-flex">
            <Button>Sign in</Button>
          </Link>
        </section>
      </main>
    );
  }

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-28">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-gray-900">Profile</h1>
          <p className="mt-2 text-gray-600">Keep your travel contact details current.</p>
        </div>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8 flex items-center gap-4 border-b border-gray-100 pb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-700">
              <FiUser size={28} />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-gray-900">{user.first_name} {user.last_name}</h2>
              <p className="mt-1 flex items-center gap-2 text-sm text-gray-600"><FiMail /> {user.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">First name</span>
              <input name="first_name" value={form.first_name} onChange={handleChange} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Last name</span>
              <input name="last_name" value={form.last_name} onChange={handleChange} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100" />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold text-gray-700">Phone</span>
              <div className="relative mt-2">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100" />
              </div>
            </label>
            <div className="sm:col-span-2">
              <Button type="submit" loading={saving}>Save profile</Button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
