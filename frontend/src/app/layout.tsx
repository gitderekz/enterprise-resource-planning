'use client'; // Mark as a Client Component
import { Provider } from 'react-redux';
import store from './lib/store';  // Import the Redux store
import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from './lib/ThemeContext';
import { MenuProvider } from './lib/MenuContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './lib/i18n';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WebSocketContext, WebSocketProvider } from './lib/WebSocketContext';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Provider store={store}>
        <WebSocketProvider>
          <I18nextProvider i18n={i18n}>
            <ThemeProvider>
              <MenuProvider>
                {children}
                <ToastContainer />
              </MenuProvider>
            </ThemeProvider>
          </I18nextProvider>
        </WebSocketProvider>
        </Provider>
      </body>
    </html>
  );
}

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
