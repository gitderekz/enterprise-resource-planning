'use client';
import { Provider } from 'react-redux';
import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from './lib/ThemeContext';
import { MenuProvider } from './lib/MenuContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './lib/i18n';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WebSocketProvider } from './lib/WebSocketContext';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import store from './lib/store';
import type { RootState } from './lib/store';
import { SidebarProvider } from './lib/SidebarContext';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { login, logout } from './lib/authSlice';
import LoadingSpinner from './components/LoadingSpinner';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

// List of authentication routes that don't require a token
const authRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password'
];

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <ThemeProvider>
              <ToastContainer />
              {isAuthRoute ? (
                children
              ) : (
                <AuthWrapper>
                  <WebSocketProvider>
                    <MenuProvider>
                      <SidebarProvider>
                        {children}
                      </SidebarProvider>
                    </MenuProvider>
                  </WebSocketProvider>
                </AuthWrapper>
              )}
            </ThemeProvider>
          </I18nextProvider>
        </Provider>
      </body>
    </html>
  );
}

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const authCheckComplete = useRef(false);

  useEffect(() => {
    // if (typeof window === 'undefined') return; // Don't run on server
    
    if (authCheckComplete.current) return;
    authCheckComplete.current = true;

    const verifyAuth = async () => {
      // Don't redirect if we're already on an auth route
      if (authRoutes.some(route => pathname.startsWith(route))) {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      const userString = localStorage.getItem('user');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!token) {
        dispatch(logout());
        if (!authRoutes.some(route => pathname.startsWith(route))) {
          router.push('/login');
        }
        setLoading(false);
        return;
      }

      if (token && userString) {
        dispatch(login({
          token,
          user: JSON.parse(userString)
        }));
      }

      try {
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        try {
          if (!refreshToken) throw new Error('No refresh token available');

          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            { refreshToken },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          localStorage.setItem('token', response.data.token);
          if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }

          dispatch(login({
            token: response.data.token,
            user: response.data.user || JSON.parse(userString || '{}')
          }));
        } catch (refreshError) {
          dispatch(logout());
          if (!authRoutes.some(route => pathname.startsWith(route))) {
            router.push('/login');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();

    const refreshInterval = setInterval(async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return;

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refreshToken },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );

        localStorage.setItem('token', response.data.token);
        dispatch(login({
          token: response.data.token,
          user: response.data.user || JSON.parse(localStorage.getItem('user') || '{}')
        }));
      } catch (error) {
        console.error('Token refresh failed:', error);
      }
    }, 15 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [dispatch, router, pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated && !authRoutes.some(route => pathname.startsWith(route))) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return <>{children}</>;
}
// *****************************




// 'use client';
// import { Provider } from 'react-redux';
// import './globals.css';
// import { Inter } from 'next/font/google';
// import { ThemeProvider } from './lib/ThemeContext';
// import { MenuProvider } from './lib/MenuContext';
// import { I18nextProvider } from 'react-i18next';
// import i18n from './lib/i18n';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { WebSocketProvider } from './lib/WebSocketContext';
// import { usePathname } from 'next/navigation';
// import { useEffect, useState, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import store from './lib/store';
// import type { RootState } from './lib/store';
// import { SidebarProvider } from './lib/SidebarContext';
// import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';
// import { login, logout } from './lib/authSlice'; // Updated import
// import LoadingSpinner from './components/LoadingSpinner';
// import { ReactNode } from 'react';

// const inter = Inter({ subsets: ['latin'] });

// // List of authentication routes that don't require a token
// const authRoutes = [
//   '/login',
//   '/register',
//   '/forgot-password',
//   '/reset-password'
// ];

// export default function RootLayout({ children }: { children: ReactNode }) {
//   const pathname = usePathname();
//   // const isAuthRoute = pathname === '/login';
//   const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <Provider store={store}>
//           <I18nextProvider i18n={i18n}>
//             <ThemeProvider>
//               <ToastContainer />
//               {isAuthRoute ? (
//                 children
//               ) : (
//                 <AuthWrapper>
//                   <WebSocketProvider>
//                     <MenuProvider>
//                       <SidebarProvider>
//                         {children}
//                       </SidebarProvider>
//                     </MenuProvider>
//                   </WebSocketProvider>
//                 </AuthWrapper>
//               )}
//             </ThemeProvider>
//           </I18nextProvider>
//         </Provider>
//       </body>
//     </html>
//   );
// }

// function AuthWrapper({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const dispatch = useDispatch();
//   const { isAuthenticated } = useSelector((state: RootState) => state.auth);
//   const [loading, setLoading] = useState(true);
//   const authCheckComplete = useRef(false);

//   useEffect(() => {
//     if (authCheckComplete.current) return;
//     authCheckComplete.current = true;

//     const verifyAuth = async () => {
//       const token = localStorage.getItem('token');
//       const userString = localStorage.getItem('user');
//       const refreshToken = localStorage.getItem('refreshToken');

//       if (!token) {
//         dispatch(logout()); // Now properly imported
//         if (pathname !== '/login') {
//           router.push('/login');
//         }
//         setLoading(false);
//         return;
//       }

//       if (token && userString) {
//         dispatch(login({
//           token,
//           user: JSON.parse(userString)
//         }));
//       }

//       try {
//         await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//       } catch (error) {
//         try {
//           if (!refreshToken) throw new Error('No refresh token available');

//           const response = await axios.post(
//             `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
//             { refreshToken },
//             { headers: { Authorization: `Bearer ${token}` } }
//           );

//           localStorage.setItem('token', response.data.token);
//           if (response.data.user) {
//             localStorage.setItem('user', JSON.stringify(response.data.user));
//           }

//           dispatch(login({
//             token: response.data.token,
//             user: response.data.user || JSON.parse(userString || '{}')
//           }));
//         } catch (refreshError) {
//           dispatch(logout()); // Now properly imported
//           if (pathname !== '/login') {
//             router.push('/login');
//           }
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     verifyAuth();

//     const refreshInterval = setInterval(async () => {
//       const refreshToken = localStorage.getItem('refreshToken');
//       if (!refreshToken) return;

//       try {
//         const response = await axios.post(
//           `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
//           { refreshToken },
//           { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//         );

//         localStorage.setItem('token', response.data.token);
//         dispatch(login({
//           token: response.data.token,
//           user: response.data.user || JSON.parse(localStorage.getItem('user') || '{}')
//         }));
//       } catch (error) {
//         console.error('Token refresh failed:', error);
//       }
//     }, 15 * 60 * 1000);

//     return () => clearInterval(refreshInterval);
//   }, [dispatch, router, pathname]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   if (!isAuthenticated && !['/login', '/register'].includes(pathname)) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p>Redirecting to login...</p>
//       </div>
//     );
//   }

//   return <>{children}</>;
// }
// ***********************************



// REFRESH AUTH/LOGIN ILIJSAIDIA KIDOGO
// 'use client';
// import { Provider } from 'react-redux';
// import './globals.css';
// import { Inter } from 'next/font/google';
// import { ThemeProvider } from './lib/ThemeContext';
// import { MenuProvider } from './lib/MenuContext';
// import { I18nextProvider } from 'react-i18next';
// import i18n from './lib/i18n';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { WebSocketProvider } from './lib/WebSocketContext';
// import { usePathname } from 'next/navigation';
// import { useEffect, useState, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import store from './lib/store';
// import type { RootState } from './lib/store';
// import { SidebarProvider } from './lib/SidebarContext';
// import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';
// import { login, logout } from './lib/authSlice';
// import LoadingSpinner from './components/LoadingSpinner';
// import { ReactNode } from 'react';

// const inter = Inter({ subsets: ['latin'] });

// // List of authentication routes that don't require a token
// const authRoutes = [
//   '/auth/login',
//   '/auth/register',
//   '/auth/forgot-password',
//   '/auth/reset-password'
// ];

// export default function RootLayout({ children }: { children: ReactNode }) {
//   const pathname = usePathname();
//   const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <Provider store={store}>
//           <I18nextProvider i18n={i18n}>
//             <ThemeProvider>
//               <ToastContainer />
//               {isAuthRoute ? (
//                 children
//               ) : (
//                 <AuthWrapper>
//                   <WebSocketProvider>
//                     <MenuProvider>
//                       <SidebarProvider>
//                         {children}
//                       </SidebarProvider>
//                     </MenuProvider>
//                   </WebSocketProvider>
//                 </AuthWrapper>
//               )}
//             </ThemeProvider>
//           </I18nextProvider>
//         </Provider>
//       </body>
//     </html>
//   );
// }

// function AuthWrapper({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [loading, setLoading] = useState(true);
//   const { isAuthenticated } = useSelector((state: RootState) => state.auth);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const isAuthRoute = ['/auth/login', '/auth/register', '/auth/forgot-password'].includes(pathname);

//     if (!token && !isAuthRoute) {
//       router.push('/auth/login');
//     } else if (token && isAuthRoute) {
//       router.push('/dashboard');
//     }
//     setLoading(false);
//   }, [pathname, router]);

//   if (loading) return <LoadingSpinner />;
//   return <>{children}</>;
// }
// ***************************************************