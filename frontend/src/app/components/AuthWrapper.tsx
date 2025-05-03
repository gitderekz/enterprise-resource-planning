'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { login } from '../lib/authSlice';
import LoadingSpinner from './LoadingSpinner';
import type { RootState } from '../lib/store';

import { WebSocketProvider } from '../lib/WebSocketContext';
import { MenuProvider } from '../lib/MenuContext';
import { SidebarProvider } from '../lib/SidebarContext';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const hasRedirectedRef = useRef(false);

  const authRoutes = ['/login', '/register', '/forgot-password'];
  const isAuthRoute = authRoutes.includes(pathname || '');

  useEffect(() => {
    if (isAuthRoute) {
      setLoading(false); // ✅ Don’t auth-check on auth routes
      return;
    }

    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!token) {
        if (!hasRedirectedRef.current) {
          hasRedirectedRef.current = true;
          router.push('/login');
        }
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        dispatch(login({ token, user: res.data.user }));
      } catch (error) {
        try {
          const refreshRes = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            { refreshToken },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          localStorage.setItem('token', refreshRes.data.token);
          dispatch(login({ token: refreshRes.data.token, user: refreshRes.data.user }));
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          if (!hasRedirectedRef.current) {
            hasRedirectedRef.current = true;
            router.push('/login');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [dispatch, router, pathname, isAuthRoute]);

  if (loading) return <LoadingSpinner />;

  // ✅ For auth routes, don't include protected providers
  if (isAuthRoute) return <>{children}</>;

  // ✅ Wrap protected content with providers
  return (
    <WebSocketProvider>
      <MenuProvider>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </MenuProvider>
    </WebSocketProvider>
  );
}
