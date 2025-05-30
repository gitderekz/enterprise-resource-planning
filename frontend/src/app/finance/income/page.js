'use client';
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import { useSharedStyles } from '../../sharedStyles';
import FinanceTable from '../components/FinanceTable';
import { useSidebar } from '../../lib/SidebarContext';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function IncomePage() {
  const { isSidebarVisible } = useSidebar();
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const styles = useSharedStyles();
  const [timeRange, setTimeRange] = useState('monthly');
  const [chartData, setChartData] = useState([]);

  const fetchIncomeData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/finance`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { type: 'income' }
      });
      setIncomeData(response.data);
      
      // Process data for chart
      const processedData = processChartData(response.data, timeRange);
      setChartData(processedData);
    } catch (error) {
      toast.error('Failed to fetch income data');
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (data, range) => {
    // Implement data processing based on time range
    // This is a simplified version - you'd want to group by month/week/day
    return data.slice(0, 6).map(item => ({
      date: new Date(item.date).toLocaleDateString(),
      amount: item.amount
    }));
  };

  useEffect(() => {
    fetchIncomeData();
  }, [timeRange]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/finance/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Income record deleted successfully');
      fetchIncomeData();
    } catch (error) {
      toast.error('Failed to delete income record');
    }
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
          <h1 className="text-2xl font-bold mb-6">Income Management</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Income Trends</h2>
                <select 
                  className="border rounded px-3 py-1"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <p className="text-gray-600">Total Income</p>
                  <p className="text-2xl font-bold text-green-600">
                    {incomeData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                  </p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-gray-600">Records Count</p>
                  <p className="text-2xl font-bold">{incomeData.length}</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-gray-600">Average Income</p>
                  <p className="text-2xl font-bold">
                    {incomeData.length > 0 
                      ? (incomeData.reduce((sum, item) => sum + item.amount, 0) / incomeData.length).toLocaleString(undefined, {
                          maximumFractionDigits: 2
                        })
                      : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <FinanceTable 
            records={incomeData} 
            onDelete={handleDelete}
            onEdit={(record) => {
              // Implement edit functionality
              console.log('Edit record:', record);
            }}
          />
        </div>
      </div>
    </div>
  );
}



// 'use client';
// import React, { useContext } from 'react';
// import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import Header from '../../components/header';
// import Sidebar from '../../components/sidebar';
// import { useSharedStyles } from '../../sharedStyles';
// import { usePathname } from 'next/navigation';
// import { MenuContext } from '../../lib/MenuContext';
// import { useSidebar } from '../../lib/SidebarContext';

// const incomeData = [
//   { month: 'Jan', revenue: 4000, profit: 2400 },
//   { month: 'Feb', revenue: 3000, profit: 1398 },
//   { month: 'Mar', revenue: 2000, profit: 9800 },
//   { month: 'Apr', revenue: 2780, profit: 3908 },
//   { month: 'May', revenue: 1890, profit: 4800 },
//   { month: 'Jun', revenue: 2390, profit: 3800 },
// ];

// const incomeSources = [
//   { source: 'Product Sales', percentage: 65, amount: 84500 },
//   { source: 'Services', percentage: 20, amount: 26000 },
//   { source: 'Subscriptions', percentage: 10, amount: 13000 },
//   { source: 'Other', percentage: 5, amount: 6500 },
// ];

// export default function IncomePage() {
//   const styles = useSharedStyles();
//   const pathname = usePathname();
//   const { menuItems } = useContext(MenuContext);
//   const { isSidebarVisible } = useSidebar();
//   const currentMenuItem = menuItems.find(item => item.link === pathname);
//   const pageTitle = currentMenuItem?.menu_item || 'Income';

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

//           {/* Income Trends */}
//           <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//             <h2 className="text-xl font-semibold mb-4">Monthly Income Trends</h2>
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={incomeData}>
//                   <XAxis dataKey="month" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" name="Revenue" />
//                   <Area type="monotone" dataKey="profit" stroke="#82ca9d" fill="#82ca9d" name="Profit" />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Income Sources */}
//           <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//             <h2 className="text-xl font-semibold mb-4">Income Sources</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <h3 className="font-medium mb-2">Source Breakdown</h3>
//                 <div className="space-y-3">
//                   {incomeSources.map((source, index) => (
//                     <div key={index} className="border-b pb-2">
//                       <div className="flex justify-between mb-1">
//                         <span>{source.source}</span>
//                         <span>{source.percentage}%</span>
//                       </div>
//                       <div className="w-full bg-gray-200 rounded-full h-2.5">
//                         <div 
//                           className="bg-blue-600 h-2.5 rounded-full" 
//                           style={{ width: `${source.percentage}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div>
//                 <h3 className="font-medium mb-2">Quarterly Comparison</h3>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full bg-white">
//                     <thead>
//                       <tr>
//                         <th className="py-2 px-4 border-b">Quarter</th>
//                         <th className="py-2 px-4 border-b">Revenue</th>
//                         <th className="py-2 px-4 border-b">Growth</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023'].map((quarter, i) => (
//                         <tr key={i}>
//                           <td className="py-2 px-4 border-b">{quarter}</td>
//                           <td className="py-2 px-4 border-b">{`${process.env.NEXT_PUBLIC_CURRENCY}`}{(50000 + Math.random() * 50000).toFixed(2)}</td>
//                           <td className="py-2 px-4 border-b text-green-600">+{(Math.random() * 20).toFixed(1)}%</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Top Performing Products */}
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-semibold mb-4">Top Performing Products</h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white">
//                 <thead>
//                   <tr>
//                     <th className="py-2 px-4 border-b">Product</th>
//                     <th className="py-2 px-4 border-b">Units Sold</th>
//                     <th className="py-2 px-4 border-b">Revenue</th>
//                     <th className="py-2 px-4 border-b">Profit Margin</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {[...Array(5)].map((_, i) => (
//                     <tr key={i}>
//                       <td className="py-2 px-4 border-b">Product {i + 1}</td>
//                       <td className="py-2 px-4 border-b">{Math.floor(Math.random() * 500) + 100}</td>
//                       <td className="py-2 px-4 border-b">{`${process.env.NEXT_PUBLIC_CURRENCY}`}{(Math.random() * 10000).toFixed(2)}</td>
//                       <td className="py-2 px-4 border-b text-green-600">{Math.floor(Math.random() * 30) + 10}%</td>
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
// ***************


// // 'use client'; 
// // import React, { useContext } from 'react';
// // import {
// //   FaSearch, FaCommentDots, FaBell, FaCog, FaUserCircle, FaHome, FaBox, FaList, FaStore, FaWallet, FaPlus, FaSignOutAlt,
// // } from 'react-icons/fa'; // Icons from react-icons
// // import { usePathname } from 'next/navigation';
// // import { useSidebar } from '../../lib/SidebarContext';
// // import { MenuContext } from '../../lib/MenuContext';
// // import Header from '../../components/header';
// // import Sidebar from '../../components/sidebar';
// // import { useSharedStyles } from '../../sharedStyles';

// // const incomePage = () => {
  
// //   const styles = useSharedStyles();
// //   const pathname = usePathname();
// //   const { menuItems } = useContext(MenuContext);
// //   const { isSidebarVisible, toggleSidebar } = useSidebar();

// //   // Find the matching menu item
// //   const currentMenuItem = menuItems.find(item => item.link === pathname);
// //   const pageTitle = currentMenuItem?.link || currentMenuItem?.menu_item || 'Untitled Page';

// //   return (
// //     <div style={styles.container}>
// //       {/* Header */}
// //       <Header />

// //       {/* Main Content */}
// //       <div style={styles.mainContent}>
// //         {/* Sidebar */}
// //         <Sidebar />

// //         {/* Scrollable Content */}
// //         {/* <div style={styles.content}> */}
// //         <div style={{ 
// //           marginLeft: isSidebarVisible ? '250px' : '0',
// //           padding: '24px',
// //           width: isSidebarVisible ? 'calc(100% - 250px)' : '100%',
// //           transition: 'all 0.3s ease',
// //         }}>
// //             <h1 style={styles.pageTitle}>{pageTitle}</h1>

// //             {/* TODO */}

// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default incomePage;