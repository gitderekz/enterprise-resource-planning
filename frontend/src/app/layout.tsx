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
import store from './lib/store'; // Correct path import for store
import type { RootState } from './lib/store'; // For type support
import { SidebarProvider } from './lib/SidebarContext';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { login } from './lib/authSlice'; // adjust to your actual path
import LoadingSpinner from './components/LoadingSpinner'; // adjust to your actual path
import { ReactNode } from 'react';

// Functional component should call useSelector inside it
const inter = Inter({ subsets: ['latin'] });


export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const authRoutes = ['/login', '/register', '/forgot-password'];
  // const isAuthRoute = authRoutes.some(route => pathname?.startsWith(route));
  const isAuthRoute = authRoutes.includes(pathname); // Use `includes`, not `startsWith`

  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <ThemeProvider>
              <ToastContainer />
              {isAuthRoute ? (
                children // Just render login/register/forgot
              ) : (
                <AuthWrapper>{children}</AuthWrapper> // Auth-protected routes
              )}
            </ThemeProvider>
          </I18nextProvider>
        </Provider>
      </body>
    </html>
  );
}

function AuthWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!token && pathname !== '/login') {
        if (!hasRedirectedRef.current) {
          hasRedirectedRef.current = true;
          router.push('/login');
        }
        setLoading(false);
        return;
      }

      try {
        const verifyRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        dispatch(login({ token, user: verifyRes.data.user }));
      } catch {
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
      if (!refreshToken || !token) return;

      axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        { refreshToken },
        { headers: { Authorization: `Bearer ${token}` } }
      )
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
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch, router, pathname]);

  if (loading) return <LoadingSpinner />;

  return (
    <WebSocketProvider>
      <MenuProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </MenuProvider>
    </WebSocketProvider>
  );
}
// ***********************************************


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
//   const isAuthRoute = authRoutes.some(route => pathname?.startsWith(route));  

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

// function AuthWrapper({ children }: { children: ReactNode }) {
//   const pathname = usePathname();
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const { isAuthenticated } = useSelector((state: RootState) => state.auth); // Correct placement
//   const [loading, setLoading] = useState(true);
//   const hasRedirectedRef = useRef(false);

//   useEffect(() => { 
//     console.log('1');
//     const verifyAuth = async () => {
//       const token = localStorage.getItem('token');
//       const refreshToken = localStorage.getItem('refreshToken');

//       // if (!token && pathname !== '/login') {
//       if (!isAuthenticated && pathname !== '/login') {
//         console.log('2');
//         setLoading(false);
//         if (!hasRedirectedRef.current) {
//           console.log('Redirecting to login due to missing token');
//           hasRedirectedRef.current = true;
//           router.push('/login');
//         }
//         return;
//       }

//       try {
//         console.log('3');
//         const verifyRes = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         dispatch(login({ token, user: verifyRes.data.user }));
//       } catch (error) {
//         console.log('4');
//         try {
//           const refreshRes = await axios.post(
//             `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
//             { refreshToken },
//             { headers: { Authorization: `Bearer ${token}` } }
//           );

//           console.log('5');
//           localStorage.setItem('token', refreshRes.data.token);
//           dispatch(login({ token: refreshRes.data.token, user: refreshRes.data.user }));
//         } catch (refreshError) {
//           console.log('6');
//           console.log('Redirecting to login due to failed refresh');
//           localStorage.removeItem('token');
//           localStorage.removeItem('refreshToken');
//           if (!hasRedirectedRef.current) {
//             console.log('7');
//             hasRedirectedRef.current = true;
//             setLoading(false);
//             router.push('/login');
//           }
//         }
//       } finally {
//         console.log('8');
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

//   console.log('MWISHO');
//   if (loading) return <LoadingSpinner />;
//   if (!isAuthenticated && pathname !== '/login') return <p>Redirecting to login...</p>;

//   return <>{children}</>;
// }
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
