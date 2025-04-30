'use client'; // Mark as a Client Component
import { useTranslation } from 'react-i18next';
import Sidebar  from "../components/sidebar";
import Navbar from "../components/navbar";
import Header from "../components/header";

import { useDispatch, useSelector } from 'react-redux';
import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '../lib/ThemeContext'; // Updated import
// import { ThemeContext } from '../lib/ThemeContext';
import { useSharedStyles } from '../sharedStyles';
import {
  FaSearch, FaCommentDots, FaBell, FaCog, FaUserCircle, FaHome, FaBox, FaList, FaStore, FaWallet, FaPlus, FaSignOutAlt,
  FaArrowRight
} from 'react-icons/fa'; // Icons from react-icons
import { usePathname } from 'next/navigation';
import { useSidebar } from '../lib/SidebarContext';
import { MenuContext } from '../lib/MenuContext';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const DashboardPage = () => {
  const { theme, toggleTheme, colors } = useTheme(); // Updated to useTheme()
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth); // Get authentication state from Redux
  const router = useRouter();
  const { isSidebarVisible, toggleSidebar } = useSidebar();
  const styles = useSharedStyles();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    router.push('/login');
  };
  // Data for the bar chart
  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: colors[theme].primary, // Purple bars
        borderRadius: 10, // Rounded corners
      },
    ],
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Sidebar */}
        <Sidebar/>

        {/* Scrollable Content */}
        {/*<div style={styles.content}>*/}
        <div style={{ 
          marginLeft: isSidebarVisible ? '250px' : '0',
          padding: '24px',
          width: isSidebarVisible ? 'calc(100% - 250px)' : '100%',
          transition: 'all 0.3s ease',
        }}>
          {/* Top Section: 5 Cards with Scroll Arrow */}
          <div style={styles.topSection}>
            <div style={styles.cardScrollContainer}>
              {[...Array(5)].map((_, index) => (
                <div key={index} style={styles.card}>
                  <div style={styles.cardNumber}>123</div>
                  <div style={styles.cardUnit}>Units</div>
                  <div style={styles.cardTitle}>Card Title</div>
                </div>
              ))}
            </div>
            <div style={styles.scrollArrow}>
              <FaArrowRight style={styles.arrowIcon} />
            </div>
          </div>

          {/* Bottom Section */}
          <div style={styles.bottomSection}>
            {/* First Row */}
            <div style={styles.bottomRow}>
              {/* Bar Chart Card */}
              <div style={styles.bottomCard}>
                <h3 style={styles.bottomCardTitle}>Sales Overview</h3>
                <div style={styles.chartContainer}>
                  <Bar data={barChartData} options={{ responsive: true }} />
                </div>
              </div>
              {/* 3x2 Small Cards */}
              <div style={styles.bottomCard}>
                <h3 style={styles.bottomCardTitle}>Quick Stats</h3>
                <div style={styles.smallCardGrid}>
                  {[...Array(6)].map((_, index) => (
                    <div key={index} style={styles.smallCard}>
                      <FaBox style={styles.smallCardIcon} />
                      <div style={styles.smallCardText}>Stat {index + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Second Row */}
            <div style={styles.bottomRow}>
              {/* Stock Number List */}
              <div style={styles.bottomCard}>
                <h3 style={styles.bottomCardTitle}>Stock Numbers</h3>
                <ul style={styles.stockList}>
                  <li>Low stock items: 12</li>
                  <li>Item categories: 6</li>
                  <li>Refunded items: 3</li>
                </ul>
              </div>
              {/* Store List */}
              <div style={styles.bottomCard}>
                <h3 style={styles.bottomCardTitle}>Store List</h3>
                <div style={styles.storeList}>
                  {[...Array(3)].map((_, index) => (
                    <div key={index} style={styles.storeItem}>
                      <div>Arusha</div>
                      <div>20 employees</div>
                      <div>100 items</div>
                      <div>2 orders</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;


// export default function Dashboard() {
//   const { t } = useTranslation();

//   return (
//     <div className="flex">
//       {/* <Header /> */}
//       <Sidebar />
//       <Navbar />
//       <div className="flex-1 p-6">
//         <h1 className="text-2xl font-bold mb-6">{t('dashboard')}</h1>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-semibold">Tasks</h2>
//             <p>View and manage tasks.</p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-semibold">Inventory</h2>
//             <p>Track inventory levels.</p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-semibold">Invoices</h2>
//             <p>Manage invoices.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }