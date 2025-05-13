'use client';
import React, { useContext, useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import { usePathname } from 'next/navigation';
import { useSidebar } from '../../lib/SidebarContext';
import { MenuContext } from '../../lib/MenuContext';
import { useSharedStyles } from '../../sharedStyles';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function AssessmentPage() {
  const styles = useSharedStyles();
  const pathname = usePathname();
  const { menuItems } = useContext(MenuContext);
  const { isSidebarVisible } = useSidebar();
  const currentMenuItem = menuItems.find(item => item.link === pathname);
  const pageTitle = currentMenuItem?.menu_item || 'Financial Assessment';
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinancialData = async () => {
      // try {
      //   const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/finance/assessment');
      //   setFinancialData(response.data);
      // } catch (error) {
      //   toast.error('Failed to load financial data');
      //   console.error('Error fetching financial data:', error);
      // } finally {
        setLoading(false);
      // }
    };
    fetchFinancialData();
  }, []);

  // Sample data structure if API fails
  const netSalesData = financialData?.netSalesData || [
    { name: 'Feb 2022', value: 4103 },
    { name: 'Mar 2024', value: 4500 },
  ];

  const grossProfitData = financialData?.grossProfitData || [
    { name: 'Feb 2022', value: 3819 },
    { name: 'Mar 2024', value: 4000 },
  ];

  const marginData = financialData?.marginData || [
    { name: 'Feb 2022', value: 2500 },
    { name: 'Mar 2024', value: 2700 },
  ];

  const revenueBreakdownData = financialData?.revenueBreakdownData || [
    { name: 'Feb 2020', bottoms: 400, tshirt: 300, tops: 500, accessories: 200, jeans: 600 },
    { name: 'Feb 2021', bottoms: 400, tshirt: 300, tops: 500, accessories: 200, jeans: 600 },
    { name: 'Feb 2022', bottoms: 400, tshirt: 300, tops: 500, accessories: 200, jeans: 600 },
    { name: 'Feb 2023', bottoms: 400, tshirt: 300, tops: 500, accessories: 200, jeans: 600 },
    { name: 'Mar 2024', bottoms: 500, tshirt: 350, tops: 550, accessories: 250, jeans: 700 },
  ];

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

          {loading ? (
            <div className="text-center py-8">Loading financial data...</div>
          ) : (
            <>
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
                  <div style={styles.metricValue}>{`${process.env.NEXT_PUBLIC_CURRENCY}`}{financialData?.netSales || '4.103'} <span style={styles.metricChange}>+2.12%</span></div>
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
                  <div style={styles.metricValue}>{`${process.env.NEXT_PUBLIC_CURRENCY}`}{financialData?.grossProfit || '3.819'} <span style={styles.metricChange}>+1.40%</span></div>
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
                  <div style={styles.metricValue}>{`${process.env.NEXT_PUBLIC_CURRENCY}`}{financialData?.margin || '2.500'} <span style={styles.metricChange}>+1.20%</span></div>
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
                  <BarChart data={revenueBreakdownData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="bottoms" stackId="a" fill="#8884d8" radius={[0, 0, 10, 10]} barSize={20}  />
                    <Bar dataKey="tshirt" stackId="a" fill="#82ca9d" radius={[0, 0, 0, 0]} barSize={20}  />
                    <Bar dataKey="tops" stackId="a" fill="#ffc658" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="accessories" stackId="a" fill="#ff8042" radius={[0, 0, 0, 0]} barSize={20}  />
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}



// 'use client';
// import React, { useContext } from 'react';
// import {
//   FaSearch, FaCommentDots, FaBell, FaCog, FaUserCircle, FaHome, FaBox, FaList, FaStore, FaWallet, FaPlus, FaSignOutAlt,
// } from 'react-icons/fa';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
// import Sidebar from '../../components/sidebar';
// import Header from '../../components/header';
// import { usePathname } from 'next/navigation';
// import { useSidebar } from '../../lib/SidebarContext';
// import { MenuContext } from '../../lib/MenuContext';
// import { useSharedStyles } from '../../sharedStyles';

// const assessmentPage = () => {
//   const styles = useSharedStyles();
//   const pathname = usePathname();
//   const { menuItems } = useContext(MenuContext);
//   const { isSidebarVisible, toggleSidebar } = useSidebar();

//   // Find the matching menu item
//   const currentMenuItem = menuItems.find(item => item.link === pathname);
//   const pageTitle = currentMenuItem?.link || currentMenuItem?.menu_item || 'Untitled Page';

//   // Sample data for the charts
//   const netSalesData = [
//     { name: 'Feb 2022', value: 4103 },
//     { name: 'Mar 2024', value: 4500 },
//   ];

//   const grossProfitData = [
//     { name: 'Feb 2022', value: 3819 },
//     { name: 'Mar 2024', value: 4000 },
//   ];

//   const marginData = [
//     { name: 'Feb 2022', value: 2500 },
//     { name: 'Mar 2024', value: 2700 },
//   ];

//   const revenueBreakdownData = [
//     { name: 'Feb 2020', bottoms: 400, tshirt: 300, tops: 500, accessories: 200, jeans: 600 },
//     { name: 'Feb 2021', bottoms: 400, tshirt: 300, tops: 500, accessories: 200, jeans: 600 },
//     { name: 'Feb 2022', bottoms: 400, tshirt: 300, tops: 500, accessories: 200, jeans: 600 },
//     { name: 'Feb 2023', bottoms: 400, tshirt: 300, tops: 500, accessories: 200, jeans: 600 },
//     { name: 'Mar 2024', bottoms: 500, tshirt: 350, tops: 550, accessories: 250, jeans: 700 },
//   ];

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
//         <h1 style={styles.pageTitle}>{pageTitle}</h1>

//           {/* View Range Dropdown */}
//           <div style={styles.viewRange}>
//             <div style={styles.viewRangeLabel}>View range:</div>
//             <select style={styles.viewRangeDropdown}>
//               <option>February 2022 - March 2024</option>
//               <option>January 2022 - December 2023</option>
//             </select>
//           </div>

//           {/* Financial Metrics */}
//           <div style={styles.financialMetrics}>
//             <div style={styles.financialMetric}>
//               <div style={styles.metricTitle}>Net Sales</div>
//               <div style={styles.metricValue}>{`${process.env.NEXT_PUBLIC_CURRENCY}`}4.103 <span style={styles.metricChange}>+2.12%</span></div>
//               <ResponsiveContainer width="100%" height={100}>
//                 <BarChart data={netSalesData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="value" fill="#6A3CBC" radius={[10, 10, 0, 0]} barSize={20}  />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//             <div style={styles.financialMetric}>
//               <div style={styles.metricTitle}>Gross Profit</div>
//               <div style={styles.metricValue}>{`${process.env.NEXT_PUBLIC_CURRENCY}`}3.819 <span style={styles.metricChange}>+1.40%</span></div>
//               <ResponsiveContainer width="100%" height={100}>
//                 <BarChart data={grossProfitData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="value" fill="#6A3CBC" radius={[10, 10, 0, 0]} barSize={20}  />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//             <div style={styles.financialMetric}>
//               <div style={styles.metricTitle}>Margin</div>
//               <div style={styles.metricValue}>{`${process.env.NEXT_PUBLIC_CURRENCY}`}2.500 <span style={styles.metricChange}>+1.20%</span></div>
//               <ResponsiveContainer width="100%" height={100}>
//                 <BarChart data={marginData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="value" fill="#6A3CBC" radius={[10, 10, 0, 0]} barSize={20}  />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Revenue Breakdown */}
//           <div style={styles.revenueBreakdown}>
//             <h2 style={styles.sectionTitle}>Revenue Breakdown</h2>
//             <ResponsiveContainer width="100%" height={200}>
//               <BarChart 
//                 data={revenueBreakdownData} 
//                 // margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//                 >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 {/* Bottom bar (rounded top and bottom) */}
//                 <Bar dataKey="bottoms" stackId="a" fill="#8884d8" radius={[0, 0, 10, 10]} barSize={20}  />
//                 {/* Middle bars (no rounding) */}
//                 <Bar dataKey="tshirt" stackId="a" fill="#82ca9d" radius={[0, 0, 0, 0]} barSize={20}  />
//                 <Bar dataKey="tops" stackId="a" fill="#ffc658" radius={[0, 0, 0, 0]} />
//                 <Bar dataKey="accessories" stackId="a" fill="#ff8042" radius={[0, 0, 0, 0]} barSize={20}  />
//                 {/* Top bar (rounded top and bottom) */}
//                 <Bar dataKey="jeans" stackId="a" fill="#0088fe" radius={[10, 10, 0, 0]} barSize={20}  />
//               </BarChart>
//             </ResponsiveContainer>
//             <div style={styles.revenueCategories}>
//               <div style={styles.revenueCategory}>Bottoms</div>
//               <div style={styles.revenueCategory}>T-shirt</div>
//               <div style={styles.revenueCategory}>Tops</div>
//               <div style={styles.revenueCategory}>Accessories</div>
//               <div style={styles.revenueCategory}>Jeans</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// export default assessmentPage;