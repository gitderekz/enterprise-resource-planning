'use client';
import React, { useState, useEffect, useContext } from 'react';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import { useSharedStyles } from '../../sharedStyles';
import { usePathname } from 'next/navigation';
import { MenuContext } from '../../lib/MenuContext';
import { useSidebar } from '../../lib/SidebarContext';
import { useSelector } from 'react-redux';
import PerformanceMetrics from './components/PerformanceMetrics';
import TopPerformers from './components/TopPerformers';
import PerformanceReviews from './components/PerformanceReviews';
import PerformanceSettings from './components/PerformanceSettings';

import { 
  getPerformanceReviews, 
  getPerformanceMetrics,
  createPerformanceReview,
  updatePerformanceReview,
  deletePerformanceReview
} from './services/performanceService';

export default function PerformancePage() {
  const styles = useSharedStyles();
  const pathname = usePathname();
  const { menuItems } = useContext(MenuContext);
  const { isSidebarVisible } = useSidebar();
  const { token } = useSelector((state) => state.auth);
  const currentMenuItem = menuItems.find(item => item.link === pathname);
  const pageTitle = currentMenuItem?.menu_item || 'Performance Management';
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reviews, setReviews] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reviewsData, metricsData] = await Promise.all([
          getPerformanceReviews(token),
          getPerformanceMetrics(token)
        ]);
        setReviews(reviewsData);
        setMetrics(metricsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleCreateReview = async (reviewData) => {
    try {
      const newReview = await createPerformanceReview(reviewData, token);
      setReviews(prev => [...prev, newReview]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateReview = async (id, reviewData) => {
    try {
      const updatedReview = await updatePerformanceReview(id, reviewData, token);
      setReviews(reviews.map(review => review.id === id ? updatedReview : review));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      await deletePerformanceReview(id, token);
      setReviews(reviews.filter(review => review.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <Header />
        <div style={styles.mainContent}>
          <Sidebar />
          <div style={{ 
            marginLeft: isSidebarVisible ? '250px' : '0',
            padding: '24px',
            width: isSidebarVisible ? 'calc(100% - 250px)' : '100%',
            transition: 'all 0.3s ease',
          }}>
            <div className="flex justify-center items-center h-64">
              <p>Loading performance data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <Header />
        <div style={styles.mainContent}>
          <Sidebar />
          <div style={{ 
            marginLeft: isSidebarVisible ? '250px' : '0',
            padding: '24px',
            width: isSidebarVisible ? 'calc(100% - 250px)' : '100%',
            transition: 'all 0.3s ease',
          }}>
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.mainContent}>
        <Sidebar />
        <div style={{ 
          marginLeft: isSidebarVisible ? '250px' : '0',
          padding: '24px',
          width: isSidebarVisible ? 'calc(100% - 250px)' : '100%',
          transition: 'all 0.3s ease',
        }}>
          <h1 style={styles.pageTitle}>{pageTitle}</h1>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'dashboard' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'reviews' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('reviews')}
            >
              Performance Reviews
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'settings' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <PerformanceMetrics metrics={metrics?.metrics} />
              <TopPerformers performers={metrics?.topPerformers} />
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <PerformanceReviews 
              reviews={reviews} 
              onEdit={handleUpdateReview}
              onCreate={handleCreateReview}
              onDelete={handleDeleteReview}
            />
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <PerformanceSettings />
          )}
          
        </div>
      </div>
    </div>
  );
}
// **********************************



// 'use client';
// import React, { useContext } from 'react';
// import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
// // import { Legend } from 'chart.js';
// import Header from '../../components/header';
// import Sidebar from '../../components/sidebar';
// import { useSharedStyles } from '../../sharedStyles';
// import { usePathname } from 'next/navigation';
// import { MenuContext } from '../../lib/MenuContext';
// import { useSidebar } from '../../lib/SidebarContext';

// const performanceData = [
//   { subject: 'Quality', A: 85, B: 65 },
//   { subject: 'Productivity', A: 78, B: 72 },
//   { subject: 'Initiative', A: 92, B: 68 },
//   { subject: 'Teamwork', A: 88, B: 75 },
//   { subject: 'Communication', A: 79, B: 82 },
// ];

// const topPerformers = [
//   { name: 'John Doe', position: 'Developer', score: 92, improvement: '+8%' },
//   { name: 'Jane Smith', position: 'Designer', score: 88, improvement: '+5%' },
//   { name: 'Robert Johnson', position: 'Manager', score: 85, improvement: '+12%' },
// ];

// export default function PerformancePage() {
//   const styles = useSharedStyles();
//   const pathname = usePathname();
//   const { menuItems } = useContext(MenuContext);
//   const { isSidebarVisible } = useSidebar();
//   const currentMenuItem = menuItems.find(item => item.link === pathname);
//   const pageTitle = currentMenuItem?.menu_item || 'Performance Management';

//   return (
//     <div style={styles.container}>
//       <Header />
//       <div style={styles.mainContent}>
//         <Sidebar />
//         <div style={{ 
//           marginLeft: isSidebarVisible ? '250px' : '0',
//           padding: '24px',
//           width: isSidebarVisible ? 'calc(100% - 250px)' : '100%',
//           transition: 'all 0.3s ease',
//         }}>
//           <h1 style={styles.pageTitle}>{pageTitle}</h1>

//           {/* Performance Overview */}
//           <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//             <h2 className="text-xl font-semibold mb-4">Team Performance Overview</h2>
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
//                   <PolarGrid />
//                   <PolarAngleAxis dataKey="subject" />
//                   <PolarRadiusAxis angle={30} domain={[0, 100]} />
//                   <Radar name="Team Average" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
//                   <Radar name="Company Average" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
//                   <Legend />
//                 </RadarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Top Performers */}
//           <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//             <h2 className="text-xl font-semibold mb-4">Top Performers</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {topPerformers.map((employee, index) => (
//                 <div key={index} className="border rounded-lg p-4">
//                   <div className="flex items-center mb-3">
//                     <div className="bg-blue-100 p-3 rounded-full mr-3">
//                       <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
//                       </svg>
//                     </div>
//                     <div>
//                       <h3 className="font-medium">{employee.username}</h3>
//                       <p className="text-sm text-gray-600">{employee.position}</p>
//                     </div>
//                   </div>
//                   <div className="flex justify-between mt-2">
//                     <span>Score:</span>
//                     <span className="font-bold">{employee.score}/100</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Improvement:</span>
//                     <span className="text-green-600 font-bold">{employee.improvement}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Performance Reviews */}
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">Upcoming Reviews</h2>
//               <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//                 Schedule Review
//               </button>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white">
//                 <thead>
//                   <tr>
//                     <th className="py-2 px-4 border-b">Employee</th>
//                     <th className="py-2 px-4 border-b">Position</th>
//                     <th className="py-2 px-4 border-b">Last Review</th>
//                     <th className="py-2 px-4 border-b">Due Date</th>
//                     <th className="py-2 px-4 border-b">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {[...Array(5)].map((_, i) => (
//                     <tr key={i}>
//                       <td className="py-2 px-4 border-b">Employee {i + 1}</td>
//                       <td className="py-2 px-4 border-b">Position {i + 1}</td>
//                       <td className="py-2 px-4 border-b">{new Date(Date.now() - (i * 30 * 86400000)).toLocaleDateString()}</td>
//                       <td className="py-2 px-4 border-b">{new Date(Date.now() + (i * 7 * 86400000)).toLocaleDateString()}</td>
//                       <td className="py-2 px-4 border-b">
//                         <span className={`px-2 py-1 rounded text-xs ${
//                           i % 3 === 0 ? 'bg-green-100 text-green-800' :
//                           i % 3 === 1 ? 'bg-yellow-100 text-yellow-800' :
//                           'bg-red-100 text-red-800'
//                         }`}>
//                           {i % 3 === 0 ? 'Completed' : i % 3 === 1 ? 'Pending' : 'Overdue'}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// // ********************************************



// 'use client'; 
// import React, { useContext } from 'react';
// import {
//   FaSearch, FaCommentDots, FaBell, FaCog, FaUserCircle, FaHome, FaBox, FaList, FaStore, FaWallet, FaPlus, FaSignOutAlt,
// } from 'react-icons/fa'; // Icons from react-icons
// import { usePathname } from 'next/navigation';
// import { useSidebar } from '../../lib/SidebarContext';
// import { MenuContext } from '../../lib/MenuContext';
// import Header from '../../components/header';
// import Sidebar from '../../components/sidebar';
// import { useSharedStyles } from '../../sharedStyles';

// const performancePage = () => {
  
//   const styles = useSharedStyles();
//   const pathname = usePathname();
//   const { menuItems } = useContext(MenuContext);
//   const { isSidebarVisible, toggleSidebar } = useSidebar();

//   // Find the matching menu item
//   const currentMenuItem = menuItems.find(item => item.link === pathname);
//   const pageTitle = currentMenuItem?.link || currentMenuItem?.menu_item || 'Untitled Page';

//   return (
//     <div style={styles.container}>
//       {/* Header */}
//       <Header />

//       {/* Main Content */}
//       <div style={styles.mainContent}>
//         {/* Sidebar */}
//         <Sidebar />

//         {/* Scrollable Content */}
//         {/* <div style={styles.content}> */}
//         <div style={{ 
//           marginLeft: isSidebarVisible ? '250px' : '0',
//           padding: '24px',
//           width: isSidebarVisible ? 'calc(100% - 250px)' : '100%',
//           transition: 'all 0.3s ease',
//         }}>
//             <h1 style={styles.pageTitle}>{pageTitle}</h1>

//             {/* TODO */}

//         </div>
//       </div>
//     </div>
//   );
// };

// export default performancePage;