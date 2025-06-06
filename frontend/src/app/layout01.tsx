
// PILI
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
// import store from './lib/store'; // Correct path import for store
// import type { RootState } from './lib/store'; // For type support
// import { SidebarProvider } from './lib/SidebarContext';
// import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';
// import { login } from './lib/authSlice'; // adjust to your actual path
// import LoadingSpinner from './components/LoadingSpinner'; // adjust to your actual path
// import { ReactNode } from 'react';

// const inter = Inter({ subsets: ['latin'] });

// export default function RootLayout({ children }: { children: ReactNode }) {
//   const pathname = usePathname();
//   const authRoutes = ['/login', '/register', '/forgot-password'];
//   const isAuthRoute = authRoutes.includes(pathname);

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
//                 <AuthWrapper>{children}</AuthWrapper>
//               )}
//             </ThemeProvider>
//           </I18nextProvider>
//         </Provider>
//       </body>
//     </html>
//   );
// }

// function AuthWrapper({ children }: { children: ReactNode }) {
//   const pathname = usePathname();
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const { isAuthenticated } = useSelector((state: RootState) => state.auth);
//   const [loading, setLoading] = useState(true);
//   const hasRedirectedRef = useRef(false);

//   useEffect(() => {
//     if (pathname === '/login') {
//       setLoading(false);
//       return;
//     }

//     const verifyAuth = async () => {
//       const token = localStorage.getItem('token');
//       const refreshToken = localStorage.getItem('refreshToken');

//       if (!isAuthenticated && pathname !== '/login') {
//         setLoading(false);
//         if (!hasRedirectedRef.current) {
//           hasRedirectedRef.current = true;
//           router.push('/login');
//         }
//         return;
//       }

//       try {
//         const verifyRes = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         dispatch(login({ token, user: verifyRes.data.user }));
//       } catch (error) {
//         try {
//           const refreshRes = await axios.post(
//             `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
//             { refreshToken },
//             { headers: { Authorization: `Bearer ${token}` } }
//           );

//           localStorage.setItem('token', refreshRes.data.token);
//           dispatch(login({ token: refreshRes.data.token, user: refreshRes.data.user }));
//         } catch (refreshError) {
//           localStorage.removeItem('token');
//           localStorage.removeItem('refreshToken');
//           if (!hasRedirectedRef.current) {
//             hasRedirectedRef.current = true;
//             router.push('/login');
//           }
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     verifyAuth();

//     const interval = setInterval(() => {
//       const refreshToken = localStorage.getItem('refreshToken');
//       if (!refreshToken) return;

//       const token = localStorage.getItem('token');
//       axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
//         { refreshToken },
//         { headers: { Authorization: `Bearer ${token}` } }
//       )
//       .then(res => {
//         localStorage.setItem('token', res.data.token);
//         dispatch(login({ token: res.data.token, user: res.data.user }));
//       })
//       .catch(() => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('refreshToken');
//         if (!hasRedirectedRef.current) {
//           hasRedirectedRef.current = true;
//           router.push('/login');
//         }
//       });
//     }, 15 * 60 * 1000);

//     return () => clearInterval(interval);
//   }, [dispatch, router, pathname]);

//   if (loading) return <LoadingSpinner />;
//   if (!isAuthenticated && pathname !== '/login') return <p>Redirecting to login...</p>;

//   return <>{children}</>;
// }
// // ***********************************************

// TATU
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
import { login, logout } from './lib/authSlice'; // Updated import
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
  // const isAuthRoute = pathname === '/login';
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
    if (authCheckComplete.current) return;
    authCheckComplete.current = true;

    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      const userString = localStorage.getItem('user');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!token) {
        dispatch(logout()); // Now properly imported
        if (pathname !== '/login') {
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
          dispatch(logout()); // Now properly imported
          if (pathname !== '/login') {
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

  if (!isAuthenticated && !['/login', '/register'].includes(pathname)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return <>{children}</>;
}
// *******************************


// // MWANZO
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
// import store from './lib/store'; // Correct path import for store
// import type { RootState } from './lib/store'; // For type support
// import { SidebarProvider } from './lib/SidebarContext';
// import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';
// import { login } from './lib/authSlice'; // adjust to your actual path
// import LoadingSpinner from './components/LoadingSpinner'; // adjust to your actual path
// import { ReactNode } from 'react';

// // Functional component should call useSelector inside it
// const inter = Inter({ subsets: ['latin'] });

// export default function RootLayout({ children }: { children: ReactNode }) {
//   const pathname = usePathname();
//   // const dispatch = useDispatch();
//   // const { isAuthenticated } = useSelector((state: RootState) => state.auth); // Correct placement

//   // Check if current route is auth route
//   const authRoutes = ['/login', '/register', '/forgot-password']; // Expandable
//   // const isAuthRoute = authRoutes.some(route => pathname?.startsWith(route));  
//   // const isAuthRoute = authRoutes.includes(pathname); // Use `includes`, not `startsWith`
//   const isAuthRoute = pathname === '/login';
//   console.log('Current Pathname:', pathname === '/login');
  

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
//                   {/* Only include providers if authenticated */}
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

// // function AuthWrapper({ children }: { children: ReactNode }) {
// //   const pathname = usePathname();
// //   const router = useRouter();
// //   const dispatch = useDispatch();
// //   const { isAuthenticated } = useSelector((state: RootState) => state.auth); // Now it should be accurate
// //   const [loading, setLoading] = useState(true);
// //   const hasRedirectedRef = useRef(false);

// //   useEffect(() => {
// //     const verifyAuth = async () => {
// //       const token = localStorage.getItem('token');
// //       const refreshToken = localStorage.getItem('refreshToken');

// //       if (!isAuthenticated && pathname !== '/login') {
// //         setLoading(false);
// //         if (!hasRedirectedRef.current) {
// //           hasRedirectedRef.current = true;
// //           router.push('/login');
// //         }
// //         return;
// //       }

// //       try {
// //         const verifyRes = await axios.get(
// //           `${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
// //           { headers: { Authorization: `Bearer ${token}` } }
// //         );

// //         dispatch(login({ token, user: verifyRes.data.user }));
// //       } catch (error) {
// //         try {
// //           const refreshRes = await axios.post(
// //             `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
// //             { refreshToken },
// //             { headers: { Authorization: `Bearer ${token}` } }
// //           );

// //           localStorage.setItem('token', refreshRes.data.token);
// //           dispatch(login({ token: refreshRes.data.token, user: refreshRes.data.user }));
// //         } catch (refreshError) {
// //           localStorage.removeItem('token');
// //           localStorage.removeItem('refreshToken');
// //           if (!hasRedirectedRef.current) {
// //             hasRedirectedRef.current = true;
// //             setLoading(false);
// //             router.push('/login');
// //           }
// //         }
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     verifyAuth();

// //     const interval = setInterval(() => {
// //       const refreshToken = localStorage.getItem('refreshToken');
// //       if (!refreshToken) return;

// //       const token = localStorage.getItem('token');
// //       axios.post(
// //         `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
// //         { refreshToken },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       )
// //       .then(res => {
// //         localStorage.setItem('token', res.data.token);
// //         dispatch(login({ token: res.data.token, user: res.data.user }));
// //       })
// //       .catch(() => {
// //         localStorage.removeItem('token');
// //         localStorage.removeItem('refreshToken');
// //         if (!hasRedirectedRef.current) {
// //           hasRedirectedRef.current = true;
// //           router.push('/login');
// //         }
// //       });
// //     }, 15 * 60 * 1000);

// //     return () => clearInterval(interval);
// //   }, [dispatch, router, pathname, isAuthenticated]); // Add isAuthenticated to dependency array

// //   if (loading) return <LoadingSpinner />;
// //   if (!isAuthenticated && pathname !== '/login') return <p>Redirecting to login...</p>;

// //   return <>{children}</>;
// // }

// function AuthWrapper({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const dispatch = useDispatch();
//   const { isAuthenticated } = useSelector((state: RootState) => state.auth);
//   const [loading, setLoading] = useState(true);
//   const authCheckComplete = useRef(false);

//   useEffect(() => {
//     // Prevent duplicate auth checks
//     if (authCheckComplete.current) return;
//     authCheckComplete.current = true;

//     const verifyAuth = async () => {
//       const token = localStorage.getItem('token');
//       const userString = localStorage.getItem('user');
//       const refreshToken = localStorage.getItem('refreshToken');

//       // If no token exists, redirect to login
//       if (!token) {
//         dispatch(logout());
//         if (pathname !== '/login') {
//           router.push('/login');
//         }
//         setLoading(false);
//         return;
//       }

//       // Immediately hydrate Redux state from localStorage
//       if (token && userString) {
//         dispatch(login({
//           token,
//           user: JSON.parse(userString)
//         }));
//       }

//       try {
//         // Verify token with backend
//         await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//       } catch (error) {
//         try {
//           // Token verification failed, try to refresh
//           if (!refreshToken) throw new Error('No refresh token available');

//           const response = await axios.post(
//             `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
//             { refreshToken },
//             { headers: { Authorization: `Bearer ${token}` } }
//           );

//           // Update tokens and user data
//           localStorage.setItem('token', response.data.token);
//           if (response.data.user) {
//             localStorage.setItem('user', JSON.stringify(response.data.user));
//           }

//           dispatch(login({
//             token: response.data.token,
//             user: response.data.user || JSON.parse(userString || '{}')
//           }));
//         } catch (refreshError) {
//           // Both verification and refresh failed - logout
//           dispatch(logout());
//           if (pathname !== '/login') {
//             router.push('/login');
//           }
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     verifyAuth();

//     // Set up token refresh interval (every 15 minutes)
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
//     }, 15 * 60 * 1000); // 15 minutes

//     return () => clearInterval(refreshInterval);
//   }, [dispatch, router, pathname]);

//   // Show loading spinner while checking auth
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   // Redirect protection logic
//   if (!isAuthenticated && !['/login', '/register'].includes(pathname)) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p>Redirecting to login...</p>
//       </div>
//     );
//   }

//   // Render children if authenticated or on auth route
//   return <>{children}</>;
// }

// // function AuthWrapper({ children }: { children: ReactNode }) {
// //   const pathname = usePathname();
// //   const router = useRouter();
// //   const dispatch = useDispatch();
// //   const { isAuthenticated } = useSelector((state: RootState) => state.auth);
// //   const [loading, setLoading] = useState(true);
// //   const hasRedirectedRef = useRef(false);

// //   useEffect(() => {
// //     console.log('aithenticated:', isAuthenticated);
    
// //     if (typeof window !== 'undefined') {
// //       // Code that accesses localStorage should run only on the client side
// //       const token = localStorage.getItem('token');
// //       const refreshToken = localStorage.getItem('refreshToken');

// //       if (!isAuthenticated && pathname !== '/login') {
// //         setLoading(false);
// //         if (!hasRedirectedRef.current) {
// //           hasRedirectedRef.current = true;
// //           router.push('/login');
// //         }
// //         return;
// //       }

// //       const verifyAuth = async () => {
// //         try {
// //           const verifyRes = await axios.get(
// //             `${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
// //             { headers: { Authorization: `Bearer ${token}` } }
// //           );

// //           dispatch(login({ token, user: verifyRes.data.user }));
// //         } catch (error) {
// //           try {
// //             const refreshRes = await axios.post(
// //               `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
// //               { refreshToken },
// //               { headers: { Authorization: `Bearer ${token}` } }
// //             );

// //             localStorage.setItem('token', refreshRes.data.token);
// //             dispatch(login({ token: refreshRes.data.token, user: refreshRes.data.user }));
// //           } catch (refreshError) {
// //             localStorage.removeItem('token');
// //             localStorage.removeItem('refreshToken');
// //             if (!hasRedirectedRef.current) {
// //               hasRedirectedRef.current = true;
// //               setLoading(false);
// //               router.push('/login');
// //             }
// //           }
// //         } finally {
// //           setLoading(false);
// //         }
// //       };

// //       verifyAuth();

// //       const interval = setInterval(() => {
// //         const refreshToken = localStorage.getItem('refreshToken');
// //         if (!refreshToken) return;

// //         const token = localStorage.getItem('token');
// //         axios.post(
// //           `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
// //           { refreshToken },
// //           { headers: { Authorization: `Bearer ${token}` } }
// //         )
// //         .then(res => {
// //           localStorage.setItem('token', res.data.token);
// //           dispatch(login({ token: res.data.token, user: res.data.user }));
// //         })
// //         .catch(() => {
// //           localStorage.removeItem('token');
// //           localStorage.removeItem('refreshToken');
// //           if (!hasRedirectedRef.current) {
// //             hasRedirectedRef.current = true;
// //             router.push('/login');
// //           }
// //         });
// //       }, 15 * 60 * 1000);

// //       return () => clearInterval(interval);
// //     }
// //   }, [dispatch, router, pathname, isAuthenticated]);

// //   if (loading) return <LoadingSpinner />;
// //   if (!isAuthenticated && pathname !== '/login') return <p>Redirecting to login...</p>;

// //   return <>{children}</>;
// // }
// // ******************************

// function AuthWrapper({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const { isAuthenticated } = useSelector((state: RootState) => state.auth);

//   useEffect(() => {
//     if (!isAuthenticated) {
//       router.push('/login');
//     }
//   }, [isAuthenticated, router]);

//   if (!isAuthenticated) {
//     return null; // or a loading spinner
//   }

//   return <>{children}</>;
// }



// 'use client';
// import { usePathname } from 'next/navigation';
// import { Provider } from 'react-redux';
// import store from './lib/store';
// import './globals.css';
// import { Inter } from 'next/font/google';
// import { ThemeProvider } from './lib/ThemeContext';
// import { MenuProvider } from './lib/MenuContext';
// import { I18nextProvider } from 'react-i18next';
// import i18n from './lib/i18n';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { WebSocketProvider } from './lib/WebSocketContext';
// import Header from './components/header';
// import Sidebar from './components/sidebar';
// import { useSharedStyles } from './sharedStyles';

// const inter = Inter({ subsets: ['latin'] });

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   const styles = useSharedStyles();
//   const pathname = usePathname();

//   // Add other routes if needed
//   const authPages = ['/login'];

//   const isAuthPage = authPages.includes(pathname);

//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <Provider store={store}>
//           <WebSocketProvider>
//             <I18nextProvider i18n={i18n}>
//               <ThemeProvider>
//                 <MenuProvider>
//                   {isAuthPage ? (
//                     children
//                   ) : (
//                     <div /*style={styles.container}*/>
//                       <Header />
//                       <div /*style={styles.mainContent}*/>
//                         <Sidebar />
//                         <div /*style={styles.content}*/>
//                           {children}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                   <ToastContainer />
//                 </MenuProvider>
//               </ThemeProvider>
//             </I18nextProvider>
//           </WebSocketProvider>
//         </Provider>
//       </body>
//     </html>
//   );
// }
// **********************************

// // frontend\src\app\layout.tsx
// 'use client';
// import { Provider } from 'react-redux';
// import store from './lib/store';
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
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import type { RootState } from './lib/store'; // adjust path as needed
// import { SidebarProvider } from './lib/SidebarContext';
// import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';
// import { login } from './lib/authSlice'; // adjust to your actual path
// import LoadingSpinner from './components/LoadingSpinner'; // adjust to your actual path
// import { useSharedStyles } from './sharedStyles';

// const inter = Inter({ subsets: ['latin'] });

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();

//   // Check if current route is auth route
//   const isAuthRoute = pathname === '/login';

//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <Provider store={store}>
//           <WebSocketProvider>
//             <I18nextProvider i18n={i18n}>
//               <ThemeProvider>
//                 <MenuProvider>
//                   <SidebarProvider>
//                     {isAuthRoute ? (
//                       children
//                     ) : (
//                       <AuthWrapper>{children}</AuthWrapper>
//                     )}
//                     <ToastContainer />
//                   </SidebarProvider>
//                 </MenuProvider>
//               </ThemeProvider>
//             </I18nextProvider>
//           </WebSocketProvider>
//         </Provider>
//       </body>
//     </html>
//   );
// }

// function AuthWrapper({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const { isAuthenticated } = useSelector((state: RootState) => state.auth);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const verifyAuth = async () => {
//       const token = localStorage.getItem('token');
//       const refreshToken = localStorage.getItem('refreshToken');

//       if (!token) {
//         router.push('/login');
//         return;
//       }

//       try {
//         // Verify token
//         const verifyRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
        
//         dispatch(login({ 
//           token,
//           user: verifyRes.data.user 
//         }));
//       } catch (error) {
//         // Try to refresh token if verify fails
//         try {
//           const refreshRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
//             refreshToken
//           }, {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//             },
//           });
          
//           localStorage.setItem('token', refreshRes.data.token);
//           dispatch(login({
//             token: refreshRes.data.token,
//             user: refreshRes.data.user
//           }));
//         } catch (refreshError) {
//           localStorage.removeItem('token');
//           localStorage.removeItem('refreshToken');
//           router.push('/login');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     verifyAuth();

//     // Set up token refresh interval (every 15 minutes)
//     const interval = setInterval(() => {
//       const refreshToken = localStorage.getItem('refreshToken');
//       if (refreshToken) {
//         axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, { refreshToken }, {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           },
//         })
//           .then(res => {
//             localStorage.setItem('token', res.data.token);
//             dispatch(login({ token: res.data.token }));
//           })
//           .catch(() => {
//             localStorage.removeItem('token');
//             localStorage.removeItem('refreshToken');
//             router.push('/login');
//           });
//       }
//     }, 15 * 60 * 1000);

//     return () => clearInterval(interval);
//   }, [dispatch, router]);

//   if (loading) return <LoadingSpinner />;
//   if (!isAuthenticated) return null;

//   return <>{children}</>;
// }


// // function AuthWrapper({ children }: { children: React.ReactNode }) {
// //   const router = useRouter();
// //   const { isAuthenticated } = useSelector((state: RootState) => state.auth);

// //   useEffect(() => {
// //     if (!isAuthenticated) {
// //       router.push('/login');
// //     }
// //   }, [isAuthenticated, router]);

// //   if (!isAuthenticated) {
// //     return null; // or a loading spinner
// //   }

// //   return <>{children}</>;
// // }
// // // ***********************************************