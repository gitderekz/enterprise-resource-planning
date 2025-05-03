'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { login } from '../lib/authSlice';
import LoadingSpinner from './LoadingSpinner';
import type { RootState } from '../lib/store';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const hasRedirectedRef = useRef(false);

  const authRoutes = ['/login', '/register', '/forgot-password'];
  const isAuthRoute = authRoutes.includes(pathname || '');

  // ✅ Skip auth logic entirely on auth routes
  if (isAuthRoute) return <>{children}</>;

  useEffect(() => {
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

    const interval = setInterval(() => {
      const refreshToken = localStorage.getItem('refreshToken');
      const token = localStorage.getItem('token');

      if (refreshToken && token) {
        axios
          .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, { refreshToken }, {
            headers: { Authorization: `Bearer ${token}` }
          })
          .then(res => {
            localStorage.setItem('token', res.data.token);
            dispatch(login({ token: res.data.token, user: res.data.user }));
          })
          .catch(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            if (!hasRedirectedRef.current) {
              hasRedirectedRef.current = true;
              router.push('/login');
            }
          });
      }
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch, router]);

  if (loading) return <LoadingSpinner />;
  return <>{children}</>;
}
