'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { Sidebar } from './Sidebar';

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated && pathname !== '/admi/login') {
      router.push('/admi/login');
    }
  }, [isAuthenticated, pathname, router]);

  if (!mounted) return null;
  if (!isAuthenticated && pathname !== '/admi/login') return null;

  if (pathname === '/admi/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-bg-primary">
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};
