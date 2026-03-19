import { AuthProvider } from '@/context/AuthContext';
import AdminShellGate from '@/components/layout/AdminShellGate';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Nyle Travels Admin',
  description: 'Admin Dashboard for Nyle Travels',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <AdminShellGate>{children}</AdminShellGate>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
