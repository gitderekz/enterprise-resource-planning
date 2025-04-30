'use client'; // Make sure you're marking the page as client-side in Next.js 13+
// import React, { useContext } from 'react';
// import {
//   FaSearch, FaCommentDots, FaBell, FaCog, FaUserCircle, FaHome, FaBox, FaList, FaStore, FaWallet, FaPlus, FaSignOutAlt,
// } from 'react-icons/fa'; // Icons from react-icons
import { usePathname } from 'next/navigation';
import { useSidebar } from '../../lib/SidebarContext';
import { MenuContext } from '../../lib/MenuContext';

// const FinancesPage = () => {
//   return (
//     <div style={styles.container}>
//       {/* Header */}
//       <div style={styles.header}>
//         {/* Left Side: Logo and Search Bar */}
//         <div style={styles.headerLeft}>
//           <div style={styles.logo}>inventor.io</div>
//           <div style={styles.searchBar}>
//             <FaSearch style={styles.searchIcon} />
//             <input
//               type="text"
//               placeholder="Search..."
//               style={styles.searchInput}
//             />
//           </div>
//         </div>
//         {/* Right Side: Icons */}
//         <div style={styles.headerRight}>
//           <FaCommentDots style={styles.icon} />
//           <FaBell style={styles.icon} />
//           <FaCog style={styles.icon} />
//           <FaUserCircle style={styles.icon} />
//         </div>
//       </div>

//       {/* Main Content */}
//       <div style={styles.mainContent}>
//         {/* Sidebar */}
//         <div style={styles.sidebar}>
//           <h2 style={styles.sidebarTitle}>Menu</h2>
//           <ul style={styles.sidebarList}>
//             <li style={styles.sidebarItem}>
//               <FaHome style={styles.menuIcon} /> Home
//             </li>
//             <li style={styles.sidebarItem}>
//               <FaBox style={styles.menuIcon} /> Products
//             </li>
//             <li style={styles.sidebarItem}>
//               <FaList style={styles.menuIcon} /> Categories
//             </li>
//             <li style={styles.sidebarItem}>
//               <FaStore style={styles.menuIcon} /> Stores
//             </li>
//             <li style={styles.sidebarItem}>
//               <FaWallet style={styles.menuIcon} /> Finances
//             </li>
//             <li style={styles.sidebarItem}>
//               <FaCog style={styles.menuIcon} /> Settings
//             </li>
//           </ul>
//           <div style={styles.sidebarFooter}>
//             <button style={styles.textButton}>
//               <FaPlus style={styles.menuIcon} /> Add product
//             </button>
//             <button style={styles.textButton}>
//               <FaSignOutAlt style={styles.menuIcon} /> Log out
//             </button>
//           </div>
//         </div>

//         {/* Scrollable Content */}
//         {/* <div style={styles.content}> */}
        <div style={{ 
          marginLeft: isSidebarVisible ? '250px' : '0',
          padding: '24px',
          width: isSidebarVisible ? 'calc(100% - 250px)' : '100%',
          transition: 'all 0.3s ease',
        }}>
//             <h1 style={styles.pageTitle}>Finances</h1>

//             {/* View Range Dropdown */}
//             <div style={styles.viewRange}>
//             <div style={styles.viewRangeLabel}>View range:</div>
//             <select style={styles.viewRangeDropdown}>
//                 <option>February 2022 - March 2024</option>
//                 <option>January 2022 - December 2023</option>
//             </select>
//             </div>

//             {/* Financial Metrics */}
//             <div style={styles.financialMetrics}>
//             <div style={styles.financialMetric}>
//                 <div style={styles.metricTitle}>Net Sales</div>
//                 <div style={styles.metricValue}>$4.103 <span style={styles.metricChange}>+2.12%</span></div>
//                 {/* Bar chart placeholder */}
//                 <div style={styles.barChart}></div>
//             </div>
//             <div style={styles.financialMetric}>
//                 <div style={styles.metricTitle}>Gross Profit</div>
//                 <div style={styles.metricValue}>$3.819 <span style={styles.metricChange}>+1.40%</span></div>
//                 {/* Bar chart placeholder */}
//                 <div style={styles.barChart}></div>
//             </div>
//             <div style={styles.financialMetric}>
//                 <div style={styles.metricTitle}>Margin</div>
//                 <div style={styles.metricValue}>$2.500 <span style={styles.metricChange}>+1.20%</span></div>
//                 {/* Bar chart placeholder */}
//                 <div style={styles.barChart}></div>
//             </div>
//             </div>

//             {/* Revenue Breakdown */}
//             <div style={styles.revenueBreakdown}>
//             <h2 style={styles.sectionTitle}>Revenue Breakdown</h2>
//             {/* Bar chart placeholder */}
//             <div style={styles.revenueBarChart}></div>
//             <div style={styles.revenueCategories}>
//                 <div style={styles.revenueCategory}>Bottoms</div>
//                 <div style={styles.revenueCategory}>T-shirt</div>
//                 <div style={styles.revenueCategory}>Tops</div>
//                 <div style={styles.revenueCategory}>Accessories</div>
//                 <div style={styles.revenueCategory}>Jeans</div>
//             </div>
//             </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     display: 'flex',
//     flexDirection: 'column',
//     fontFamily: 'Inter, sans-serif',
//     backgroundColor: '#f5f6fa', // Light gray background
//     minHeight: '100vh',
//   },
//   header: {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     right: 0,
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#ffffff', // White header
//     padding: '16px 24px',
//     boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
//     zIndex: 1000,
//   },
//   headerLeft: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '24px',
//   },
//   logo: {
//     fontSize: '20px',
//     fontWeight: '600',
//     color: '#6A3CBC', // Purple logo
//   },
//   searchBar: {
//     display: 'flex',
//     alignItems: 'center',
//     backgroundColor: '#f5f6fa',
//     borderRadius: '8px',
//     padding: '8px 12px',
//     width: '300px',
//     border: '1px solid #6A3CBC', // Purple border
//   },
//   searchIcon: {
//     color: '#6A3CBC', // Purple icon
//     marginRight: '8px',
//   },
//   searchInput: {
//     border: 'none',
//     outline: 'none',
//     backgroundColor: 'transparent',
//     fontSize: '14px',
//     color: '#6A3CBC', // Purple text
//     width: '100%',
//   },
//   headerRight: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '20px',
//   },
//   icon: {
//     color: '#6A3CBC', // Purple icons
//     fontSize: '20px',
//     cursor: 'pointer',
//   },
//   mainContent: {
//     display: 'flex',
//     marginTop: '80px',
//   },
//   sidebar: {
//     position: 'fixed',
//     top: '80px',
//     left: 0,
//     width: '250px',
//     height: 'calc(100vh - 80px)',
//     backgroundColor: '#8253D7', // Purple sidebar
//     padding: '24px',
//     boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
//     overflowY: 'auto',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'space-between',
//     borderRadius: '0 12px 12px 0', // Rounded corners on the right side
//   },
//   sidebarTitle: {
//     fontSize: '18px',
//     fontWeight: '600',
//     color: '#ffffff', // White text
//     marginBottom: '24px',
//   },
//   sidebarList: {
//     listStyle: 'none',
//     padding: '0',
//   },
//   sidebarItem: {
//     fontSize: '14px',
//     color: '#ffffff', // White text
//     marginBottom: '16px',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px',
//     padding: '8px',
//     borderRadius: '8px',
//     transition: 'background-color 0.3s',
//   },
//   sidebarItemHover: {
//     backgroundColor: '#461B93', // Dark purple on hover
//   },
//   menuIcon: {
//     color: '#ffffff', // White icons
//     fontSize: '16px',
//   },
//   sidebarFooter: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '12px',
//   },
//   textButton: {
//     backgroundColor: 'transparent',
//     border: 'none',
//     color: '#ffffff', // White text
//     fontSize: '14px',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px',
//     padding: '8px 0',
//   },
//   container: {
//     display: 'flex',
//     flexDirection: 'column',
//     fontFamily: 'Inter, sans-serif',
//     backgroundColor: '#f5f6fa', // Light gray background
//     minHeight: '100vh',
//   },
//   content: {
//     marginLeft: '250px',
//     padding: '24px',
//     width: 'calc(100% - 250px)',
//     overflowY: 'auto',
//     height: 'calc(100vh - 80px)',
//     backgroundColor: '#ffffff', // White background
//   },
//   pageTitle: {
//     fontSize: '24px',
//     fontWeight: '600',
//     color: '#2d3436', // Dark gray text
//     marginBottom: '24px',
//   },
//   viewRange: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//     marginBottom: '24px',
//   },
//   viewRangeLabel: {
//     fontSize: '14px',
//     color: '#636e72', // Medium gray text
//   },
//   viewRangeDropdown: {
//     padding: '8px',
//     borderRadius: '8px',
//     border: '1px solid #6A3CBC', // Purple border
//     fontSize: '14px',
//     color: '#2d3436', // Dark gray text
//     outline: 'none',
//   },
//   financialMetrics: {
//     display: 'flex',
//     gap: '24px',
//     marginBottom: '24px',
//   },
//   financialMetric: {
//     flex: 1,
//     backgroundColor: '#f5f6fa', // Light gray background
//     borderRadius: '8px',
//     padding: '16px',
//     boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
//   },
//   metricTitle: {
//     fontSize: '16px',
//     fontWeight: '600',
//     color: '#2d3436', // Dark gray text
//     marginBottom: '8px',
//   },
//   metricValue: {
//     fontSize: '20px',
//     fontWeight: '600',
//     color: '#2d3436', // Dark gray text
//   },
//   metricChange: {
//     fontSize: '14px',
//     color: '#00b894', // Green text
//   },
//   barChart: {
//     height: '100px',
//     backgroundColor: '#6A3CBC', // Purple background
//     borderRadius: '8px',
//     marginTop: '16px',
//   },
//   revenueBreakdown: {
//     backgroundColor: '#f5f6fa', // Light gray background
//     borderRadius: '8px',
//     padding: '24px',
//     boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
//   },
//   sectionTitle: {
//     fontSize: '20px',
//     fontWeight: '600',
//     color: '#2d3436', // Dark gray text
//     marginBottom: '16px',
//   },
//   revenueBarChart: {
//     height: '200px',
//     backgroundColor: '#6A3CBC', // Purple background
//     borderRadius: '8px',
//     marginBottom: '16px',
//   },
//   revenueCategories: {
//     display: 'flex',
//     gap: '16px',
//   },
//   revenueCategory: {
//     fontSize: '14px',
//     color: '#2d3436', // Dark gray text
//   },
// };

// export default FinancesPage;


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
import React, { useContext } from 'react';
import {
  FaSearch, FaCommentDots, FaBell, FaCog, FaUserCircle, FaHome, FaBox, FaList, FaStore, FaWallet, FaPlus, FaSignOutAlt,
} from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import { useSharedStyles } from '../sharedStyles';

const FinancesPage = () => {
  const styles = useSharedStyles();
  // Sample data for the charts
  const netSalesData = [
    { name: 'Feb 2022', value: 4103 },
    { name: 'Mar 2024', value: 4500 },
  ];

  const grossProfitData = [
    { name: 'Feb 2022', value: 3819 },
    { name: 'Mar 2024', value: 4000 },
  ];

  const marginData = [
    { name: 'Feb 2022', value: 2500 },
    { name: 'Mar 2024', value: 2700 },
  ];

  const revenueBreakdownData = [
    { name: 'Feb 2020', bottoms: 400, tshirt: 300, tops: 500, accessories: 200, jeans: 600 },
    { name: 'Feb 2021', bottoms: 400, tshirt: 300, tops: 500, accessories: 200, jeans: 600 },
    { name: 'Feb 2022', bottoms: 400, tshirt: 300, tops: 500, accessories: 200, jeans: 600 },
    { name: 'Feb 2023', bottoms: 400, tshirt: 300, tops: 500, accessories: 200, jeans: 600 },
    { name: 'Mar 2024', bottoms: 500, tshirt: 350, tops: 550, accessories: 250, jeans: 700 },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Sidebar */}
        <Sidebar />

        {/* Scrollable Content */}
        {/* <div style={styles.content}> */}
        <div style={{ 
          marginLeft: isSidebarVisible ? '250px' : '0',
          padding: '24px',
          width: isSidebarVisible ? 'calc(100% - 250px)' : '100%',
          transition: 'all 0.3s ease',
        }}>
          <h1 style={styles.pageTitle}>Finances</h1>

          {/* View Range Dropdown */}
          <div style={styles.viewRange}>
            <div style={styles.viewRangeLabel}>View range:</div>
            <select style={styles.viewRangeDropdown}>
              <option>February 2022 - March 2024</option>
              <option>January 2022 - December 2023</option>
            </select>
          </div>

          {/* Financial Metrics */}
          <div style={styles.financialMetrics}>
            <div style={styles.financialMetric}>
              <div style={styles.metricTitle}>Net Sales</div>
              <div style={styles.metricValue}>$4.103 <span style={styles.metricChange}>+2.12%</span></div>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={netSalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6A3CBC" radius={[10, 10, 0, 0]} barSize={20}  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={styles.financialMetric}>
              <div style={styles.metricTitle}>Gross Profit</div>
              <div style={styles.metricValue}>$3.819 <span style={styles.metricChange}>+1.40%</span></div>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={grossProfitData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6A3CBC" radius={[10, 10, 0, 0]} barSize={20}  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={styles.financialMetric}>
              <div style={styles.metricTitle}>Margin</div>
              <div style={styles.metricValue}>$2.500 <span style={styles.metricChange}>+1.20%</span></div>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={marginData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6A3CBC" radius={[10, 10, 0, 0]} barSize={20}  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div style={styles.revenueBreakdown}>
            <h2 style={styles.sectionTitle}>Revenue Breakdown</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart 
                data={revenueBreakdownData} 
                // margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {/* Bottom bar (rounded top and bottom) */}
                <Bar dataKey="bottoms" stackId="a" fill="#8884d8" radius={[0, 0, 10, 10]} barSize={20}  />
                {/* Middle bars (no rounding) */}
                <Bar dataKey="tshirt" stackId="a" fill="#82ca9d" radius={[0, 0, 0, 0]} barSize={20}  />
                <Bar dataKey="tops" stackId="a" fill="#ffc658" radius={[0, 0, 0, 0]} />
                <Bar dataKey="accessories" stackId="a" fill="#ff8042" radius={[0, 0, 0, 0]} barSize={20}  />
                {/* Top bar (rounded top and bottom) */}
                <Bar dataKey="jeans" stackId="a" fill="#0088fe" radius={[10, 10, 0, 0]} barSize={20}  />
              </BarChart>
            </ResponsiveContainer>
            <div style={styles.revenueCategories}>
              <div style={styles.revenueCategory}>Bottoms</div>
              <div style={styles.revenueCategory}>T-shirt</div>
              <div style={styles.revenueCategory}>Tops</div>
              <div style={styles.revenueCategory}>Accessories</div>
              <div style={styles.revenueCategory}>Jeans</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default FinancesPage;
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!





// import React, { useContext } from 'react';
// import { FaSearch, FaCommentDots, FaBell, FaCog, FaUserCircle, FaHome, FaBox, FaList, FaStore, FaWallet, FaPlus, FaSignOutAlt } from 'react-icons/fa'; // Icons from react-icons
import { usePathname } from 'next/navigation';
import { useSidebar } from '../../lib/SidebarContext';
import { MenuContext } from '../../lib/MenuContext';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// const FinancesPage = () => {
//   // Sample data for financial metrics
//   const data = [
//     {
//       name: 'Jan',
//       netSales: 4000,
//       grossProfit: 3800,
//       margin: 2500,
//     },
//     {
//       name: 'Feb',
//       netSales: 4500,
//       grossProfit: 4200,
//       margin: 2700,
//     },
//     {
//       name: 'Mar',
//       netSales: 4800,
//       grossProfit: 4500,
//       margin: 3000,
//     },
//   ];

//   // Sample data for Revenue Breakdown
//   const revenueData = [
//     { category: 'Bottoms', value: 1200 },
//     { category: 'T-shirt', value: 1000 },
//     { category: 'Tops', value: 900 },
//     { category: 'Accessories', value: 800 },
//     { category: 'Jeans', value: 1100 },
//   ];

//   return (
//     <div style={styles.container}>
//       {/* Header */}
//       <div style={styles.header}>
//         {/* Left Side: Logo and Search Bar */}
//         <div style={styles.headerLeft}>
//           <div style={styles.logo}>inventor.io</div>
//           <div style={styles.searchBar}>
//             <FaSearch style={styles.searchIcon} />
//             <input
//               type="text"
//               placeholder="Search..."
//               style={styles.searchInput}
//             />
//           </div>
//         </div>
//         {/* Right Side: Icons */}
//         <div style={styles.headerRight}>
//           <FaCommentDots style={styles.icon} />
//           <FaBell style={styles.icon} />
//           <FaCog style={styles.icon} />
//           <FaUserCircle style={styles.icon} />
//         </div>
//       </div>

//       {/* Main Content */}
//       <div style={styles.mainContent}>
//         {/* Sidebar */}
//         <div style={styles.sidebar}>
//           <h2 style={styles.sidebarTitle}>Menu</h2>
//           <ul style={styles.sidebarList}>
//             <li style={styles.sidebarItem}>
//               <FaHome style={styles.menuIcon} /> Home
//             </li>
//             <li style={styles.sidebarItem}>
//               <FaBox style={styles.menuIcon} /> Products
//             </li>
//             <li style={styles.sidebarItem}>
//               <FaList style={styles.menuIcon} /> Categories
//             </li>
//             <li style={styles.sidebarItem}>
//               <FaStore style={styles.menuIcon} /> Stores
//             </li>
//             <li style={styles.sidebarItem}>
//               <FaWallet style={styles.menuIcon} /> Finances
//             </li>
//             <li style={styles.sidebarItem}>
//               <FaCog style={styles.menuIcon} /> Settings
//             </li>
//           </ul>
//           <div style={styles.sidebarFooter}>
//             <button style={styles.textButton}>
//               <FaPlus style={styles.menuIcon} /> Add product
//             </button>
//             <button style={styles.textButton}>
//               <FaSignOutAlt style={styles.menuIcon} /> Log out
//             </button>
//           </div>
//         </div>

//         {/* Scrollable Content */}
//         {/* <div style={styles.content}> */}
        <div style={{ 
          marginLeft: isSidebarVisible ? '250px' : '0',
          padding: '24px',
          width: isSidebarVisible ? 'calc(100% - 250px)' : '100%',
          transition: 'all 0.3s ease',
        }}>
//           <h1 style={styles.pageTitle}>Finances</h1>

//           {/* Financial Metrics */}
//           <div style={styles.financialMetrics}>
//             <div style={styles.financialMetric}>
//               <div style={styles.metricTitle}>Net Sales</div>
//               <div style={styles.metricValue}>$4.103 <span style={styles.metricChange}>+2.12%</span></div>
//               {/* Net Sales Bar chart */}
//               <ResponsiveContainer width="100%" height={100}>
//                 <BarChart data={data}>
//                   <Bar dataKey="netSales" fill="#6A3CBC" radius={[10, 10, 10, 10]} />
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>

//             <div style={styles.financialMetric}>
//               <div style={styles.metricTitle}>Gross Profit</div>
//               <div style={styles.metricValue}>$3.819 <span style={styles.metricChange}>+1.40%</span></div>
//               {/* Gross Profit Bar chart */}
//               <ResponsiveContainer width="100%" height={100}>
//                 <BarChart data={data}>
//                   <Bar dataKey="grossProfit" fill="#6A3CBC" radius={[10, 10, 10, 10]} />
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>

//             <div style={styles.financialMetric}>
//               <div style={styles.metricTitle}>Margin</div>
//               <div style={styles.metricValue}>$2.500 <span style={styles.metricChange}>+1.20%</span></div>
//               {/* Margin Bar chart */}
//               <ResponsiveContainer width="100%" height={100}>
//                 <BarChart data={data}>
//                   <Bar dataKey="margin" fill="#6A3CBC" radius={[10, 10, 10, 10]} />
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Revenue Breakdown */}
//           <div style={styles.revenueBreakdown}>
//             <h2 style={styles.sectionTitle}>Revenue Breakdown</h2>
//             {/* Revenue Breakdown Bar chart */}
//             <ResponsiveContainer width="100%" height={200}>
//               <BarChart data={revenueData}>
//                 <Bar dataKey="value" fill="#6A3CBC" radius={[10, 10, 10, 10]}>
//                   {revenueData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#FF7F50" : "#87CEFA"} />
//                   ))}
//                 </Bar>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="category" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     display: 'flex',
//     flexDirection: 'column',
//     fontFamily: 'Inter, sans-serif',
//     backgroundColor: '#f5f6fa', // Light gray background
//     minHeight: '100vh',
//   },
//   header: {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     right: 0,
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#ffffff', // White header
//     padding: '16px 24px',
//     boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
//     zIndex: 1000,
//   },
//   headerLeft: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '24px',
//   },
//   logo: {
//     fontSize: '20px',
//     fontWeight: '600',
//     color: '#6A3CBC', // Purple logo
//   },
//   searchBar: {
//     display: 'flex',
//     alignItems: 'center',
//     backgroundColor: '#f5f6fa',
//     borderRadius: '8px',
//     padding: '8px 12px',
//     width: '300px',
//     border: '1px solid #6A3CBC', // Purple border
//   },
//   searchIcon: {
//     color: '#6A3CBC', // Purple icon
//     marginRight: '8px',
//   },
//   searchInput: {
//     border: 'none',
//     outline: 'none',
//     backgroundColor: 'transparent',
//     fontSize: '14px',
//     color: '#6A3CBC', // Purple text
//     width: '100%',
//   },
//   headerRight: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '20px',
//   },
//   icon: {
//     color: '#6A3CBC', // Purple icons
//     fontSize: '20px',
//     cursor: 'pointer',
//   },
//   mainContent: {
//     display: 'flex',
//     marginTop: '80px',
//   },
//   sidebar: {
//     position: 'fixed',
//     top: '80px',
//     left: 0,
//     width: '250px',
//     height: 'calc(100vh - 80px)',
//     backgroundColor: '#8253D7', // Purple sidebar
//     padding: '24px',
//     boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
//     overflowY: 'auto',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'space-between',
//     borderRadius: '0 12px 12px 0', // Rounded corners on the right side
//   },
//   sidebarTitle: {
//     fontSize: '18px',
//     fontWeight: '600',
//     color: '#ffffff', // White text
//     marginBottom: '24px',
//   },
//   sidebarList: {
//     listStyle: 'none',
//     padding: '0',
//   },
//   sidebarItem: {
//     fontSize: '14px',
//     color: '#ffffff', // White text
//     marginBottom: '16px',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px',
//     padding: '8px',
//     borderRadius: '8px',
//     transition: 'background-color 0.3s',
//   },
//   sidebarItemHover: {
//     backgroundColor: '#461B93', // Dark purple on hover
//   },
//   menuIcon: {
//     color: '#ffffff', // White icons
//     fontSize: '16px',
//   },
//   sidebarFooter: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '12px',
//   },
//   textButton: {
//     backgroundColor: 'transparent',
//     border: 'none',
//     color: '#ffffff', // White text
//     fontSize: '14px',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px',
//     padding: '8px 0',
//   },
//   container: {
//     display: 'flex',
//     flexDirection: 'column',
//     fontFamily: 'Inter, sans-serif',
//     backgroundColor: '#f5f6fa', // Light gray background
//     minHeight: '100vh',
//   },
//   content: {
//     marginLeft: '250px',
//     padding: '24px',
//     width: 'calc(100% - 250px)',
//     overflowY: 'auto',
//     height: 'calc(100vh - 80px)',
//     backgroundColor: '#ffffff', // White background
//   },
//   pageTitle: {
//     fontSize: '24px',
//     fontWeight: '600',
//     color: '#2d3436', // Dark gray text
//     marginBottom: '24px',
//   },
//   viewRange: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//     marginBottom: '24px',
//   },
//   viewRangeLabel: {
//     fontSize: '14px',
//     color: '#636e72', // Medium gray text
//   },
//   viewRangeDropdown: {
//     padding: '8px',
//     borderRadius: '8px',
//     border: '1px solid #6A3CBC', // Purple border
//     fontSize: '14px',
//     color: '#2d3436', // Dark gray text
//     outline: 'none',
//   },
//   financialMetrics: {
//     display: 'flex',
//     gap: '24px',
//     marginBottom: '24px',
//   },
//   financialMetric: {
//     flex: 1,
//     backgroundColor: '#f5f6fa', // Light gray background
//     borderRadius: '8px',
//     padding: '16px',
//     boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
//   },
//   metricTitle: {
//     fontSize: '16px',
//     fontWeight: '600',
//     color: '#2d3436', // Dark gray text
//     marginBottom: '8px',
//   },
//   metricValue: {
//     fontSize: '20px',
//     fontWeight: '600',
//     color: '#2d3436', // Dark gray text
//   },
//   metricChange: {
//     fontSize: '14px',
//     color: '#00b894', // Green text
//   },
//   barChart: {
//     height: '100px',
//     backgroundColor: '#6A3CBC', // Purple background
//     borderRadius: '8px',
//     marginTop: '16px',
//   },
//   revenueBreakdown: {
//     backgroundColor: '#f5f6fa', // Light gray background
//     borderRadius: '8px',
//     padding: '24px',
//     boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
//   },
//   sectionTitle: {
//     fontSize: '20px',
//     fontWeight: '600',
//     color: '#2d3436', // Dark gray text
//     marginBottom: '16px',
//   },
//   revenueBarChart: {
//     height: '200px',
//     backgroundColor: '#6A3CBC', // Purple background
//     borderRadius: '8px',
//     marginBottom: '16px',
//   },
//   revenueCategories: {
//     display: 'flex',
//     gap: '16px',
//   },
//   revenueCategory: {
//     fontSize: '14px',
//     color: '#2d3436', // Dark gray text
//   },
// };

// export default FinancesPage;
