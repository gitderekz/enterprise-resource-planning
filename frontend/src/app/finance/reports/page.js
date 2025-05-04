'use client';
import React, { useContext } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import { useSharedStyles } from '../../sharedStyles';
import { usePathname } from 'next/navigation';
import { MenuContext } from '../../lib/MenuContext';
import { useSidebar } from '../../lib/SidebarContext';

const reportData = [
  { month: 'Jan', revenue: 4000, expenses: 2400, profit: 1600 },
  { month: 'Feb', revenue: 3000, expenses: 1398, profit: 1602 },
  { month: 'Mar', revenue: 9800, expenses: 2000, profit: 7800 },
  { month: 'Apr', revenue: 3908, expenses: 2780, profit: 1128 },
  { month: 'May', revenue: 4800, expenses: 1890, profit: 2910 },
  { month: 'Jun', revenue: 3800, expenses: 2390, profit: 1410 },
];

const kpiData = [
  { name: 'Gross Margin', value: '42%', trend: 'up' },
  { name: 'Operating Margin', value: '28%', trend: 'up' },
  { name: 'Current Ratio', value: '1.8', trend: 'stable' },
  { name: 'Quick Ratio', value: '1.2', trend: 'down' },
];

export default function ReportPage() {
  const styles = useSharedStyles();
  const pathname = usePathname();
  const { menuItems } = useContext(MenuContext);
  const { isSidebarVisible } = useSidebar();
  const currentMenuItem = menuItems.find(item => item.link === pathname);
  const pageTitle = currentMenuItem?.menu_item || 'Financial Reports';

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

          {/* Report Period Selector */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex justify-between items-center">
            <div>
              <select className="border rounded px-3 py-2 mr-2">
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Annual</option>
              </select>
              <select className="border rounded px-3 py-2">
                <option>Last 6 Months</option>
                <option>Year to Date</option>
                <option>Last 12 Months</option>
              </select>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Export Report
            </button>
          </div>

          {/* Financial Performance */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Financial Performance</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={reportData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                  <Bar dataKey="expenses" fill="#ff7300" name="Expenses" />
                  <Line type="monotone" dataKey="profit" stroke="#ff7300" name="Profit" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Financial Indicators */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Key Financial Indicators</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {kpiData.map((kpi, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{kpi.name}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      kpi.trend === 'up' ? 'bg-green-100 text-green-800' :
                      kpi.trend === 'down' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {kpi.trend === 'up' ? '↑' : kpi.trend === 'down' ? '↓' : '→'}
                    </span>
                  </div>
                  <p className="text-2xl mt-2">{kpi.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Reports */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Available Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Balance Sheet', icon: '📊', date: 'Jun 2023' },
                { name: 'Income Statement', icon: '📈', date: 'Jun 2023' },
                { name: 'Cash Flow', icon: '💵', date: 'Jun 2023' },
                { name: 'Budget vs Actual', icon: '📋', date: 'Q2 2023' },
                { name: 'Tax Report', icon: '🏛️', date: 'Q2 2023' },
                { name: 'Annual Report', icon: '📑', date: '2022' },
              ].map((report, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{report.icon}</span>
                    <div>
                      <h3 className="font-medium">{report.name}</h3>
                      <p className="text-sm text-gray-600">{report.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



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

// const reportsPage = () => {
  
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

// export default reportsPage;