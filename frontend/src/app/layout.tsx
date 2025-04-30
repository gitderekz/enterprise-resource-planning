'use client';
import { Provider } from 'react-redux';
import store from './lib/store';
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
import { useSidebar } from '../../lib/SidebarContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import type { RootState } from './lib/store'; // adjust path as needed
import { SidebarProvider } from './lib/SidebarContext';

import { useSharedStyles } from './sharedStyles';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if current route is auth route
  const isAuthRoute = pathname === '/login';

  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <WebSocketProvider>
            <I18nextProvider i18n={i18n}>
              <ThemeProvider>
                <MenuProvider>
                  <SidebarProvider>
                    {isAuthRoute ? (
                      children
                    ) : (
                      <AuthWrapper>{children}</AuthWrapper>
                    )}
                    <ToastContainer />
                  </SidebarProvider>
                </MenuProvider>
              </ThemeProvider>
            </I18nextProvider>
          </WebSocketProvider>
        </Provider>
      </body>
    </html>
  );
}

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}
// 'use client';
// import { usePathname } from 'next/navigation';
import { useSidebar } from '../../lib/SidebarContext';
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
