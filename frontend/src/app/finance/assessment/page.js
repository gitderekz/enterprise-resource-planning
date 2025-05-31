'use client';
import React, { useState, useEffect } from 'react';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import { useSharedStyles } from '../../sharedStyles';
import FinanceChart from '../components/FinanceChart';
import { useSidebar } from '../../lib/SidebarContext';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function FinancialAssessmentPage() {
  const { isSidebarVisible } = useSidebar();
  const [timeRange, setTimeRange] = useState('quarterly');
  const [loading, setLoading] = useState(true);
  const [comparisonData, setComparisonData] = useState([]);
  const styles = useSharedStyles();

  const fetchComparisonData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/finance/comparison`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { periods: 4, interval: timeRange }
        }
      );
      setComparisonData(response.data);
    } catch (error) {
      toast.error('Failed to fetch comparison data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparisonData();
  }, [timeRange]);

  const renderMetricCard = (title, value, isPositive = true) => (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-medium text-gray-600">{title}</h3>
      <p className={`text-2xl mt-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {typeof value === 'number' 
          ? value.toLocaleString('en-US', {
              style: 'currency',
              currency: 'TSH'
            })
          : value}
      </p>
    </div>
  );

  // Calculate totals from comparison data
  const totals = comparisonData.reduce((acc, curr) => ({
    income: acc.income + curr.income,
    expense: acc.expense + curr.expense,
    profit: acc.profit + curr.profit
  }), { income: 0, expense: 0, profit: 0 });

  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.mainContent}>
        <Sidebar/>
        <div style={{ 
          marginLeft: isSidebarVisible ? '250px' : '0',
          padding: '24px',
          width: isSidebarVisible ? 'calc(100% - 250px)' : '100%',
          transition: 'all 0.3s ease',
        }}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Financial Assessment</h1>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border rounded px-3 py-1"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          
          {loading ? (
            <div className="text-center py-8">Loading financial data...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {renderMetricCard('Total Revenue', totals.income)}
                {renderMetricCard('Total Expenses', totals.expense, false)}
                {renderMetricCard('Net Profit', totals.profit, totals.profit >= 0)}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* <FinanceChart 
                  data={comparisonData}
                  type="bar"
                  title={`${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Financial Comparison`}
                  height={300}
                  keys={['income', 'expense']}
                />
                
                <FinanceChart 
                  data={comparisonData}
                  type="line"
                  title="Profit Trend"
                  height={300}
                  keys={['profit']}
                /> */}
                <FinanceChart 
                  data={comparisonData.map(item => ({ ...item, name: item.period }))}
                  type="bar"
                  title={`${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Financial Comparison`}
                  height={300}
                  keys={['income', 'expense']}
                />
                                
                <FinanceChart 
                  data={comparisonData.map(item => ({ ...item, name: item.period }))}
                  type="line"
                  title="Profit Trend"
                  height={300}
                  keys={['profit']}
                />

              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Period Breakdown</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Income</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {comparisonData.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">{item.period}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.income.toLocaleString('en-US', { style: 'currency', currency: 'TSH' })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.expense.toLocaleString('en-US', { style: 'currency', currency: 'TSH' })}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap ${
                            item.profit >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {item.profit.toLocaleString('en-US', { style: 'currency', currency: 'TSH' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
// ******************************************



// 'use client';
// import React, { useState, useEffect } from 'react';
// import Header from '../../components/header';
// import Sidebar from '../../components/sidebar';
// import { useSharedStyles } from '../../sharedStyles';
// import FinanceChart from '../components/FinanceChart';
// import { useSidebar } from '../../lib/SidebarContext';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// export default function FinancialAssessmentPage() {
//   const { isSidebarVisible } = useSidebar();
//   const [metrics, setMetrics] = useState({});
//   const [timeRange, setTimeRange] = useState('quarterly');
//   const [loading, setLoading] = useState(true);
//   const styles = useSharedStyles();
//   const [comparisonData, setComparisonData] = useState([]);

//   const fetchAssessmentData = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const [metricsResponse, comparisonResponse] = await Promise.all([
//         axios.get(`${process.env.NEXT_PUBLIC_API_URL}/finance/reports/summary`, {
//           headers: { Authorization: `Bearer ${token}` },
//           params: { range: timeRange }
//         }),
//         axios.get(`${process.env.NEXT_PUBLIC_API_URL}/finance/comparison`, {
//           headers: { Authorization: `Bearer ${token}` },
//           params: { periods: 4, interval: timeRange }
//         })
//       ]);
      
//       setMetrics(metricsResponse.data);
//       setComparisonData(comparisonResponse.data);
//     } catch (error) {
//       toast.error('Failed to fetch assessment data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAssessmentData();
//   }, [timeRange]);

//   const renderMetricCard = (title, value, isPositive = true) => (
//     <div className="bg-white rounded-lg shadow p-4">
//       <h3 className="font-medium text-gray-600">{title}</h3>
//       <p className={`text-2xl mt-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
//         {typeof value === 'number' 
//           ? value.toLocaleString(undefined, {
//               style: 'currency',
//               currency: 'TSH'
//             })
//           : value}
//       </p>
//     </div>
//   );

//   return (
//     <div style={styles.container}>
//       {/* Header */}
//       <Header />

//       {/* Main Content */}
//       <div style={styles.mainContent}>
//         {/* Sidebar */}
//         <Sidebar/>

//         {/* Scrollable Content */}
//         {/*<div style={styles.content}>*/}
//         <div style={{ 
//           marginLeft: isSidebarVisible ? '250px' : '0',
//           padding: '24px',
//           width: isSidebarVisible ? 'calc(100% - 250px)' : '100%',
//           transition: 'all 0.3s ease',
//         }}>
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-2xl font-bold">Financial Assessment</h1>
//             <select
//               value={timeRange}
//               onChange={(e) => setTimeRange(e.target.value)}
//               className="border rounded px-3 py-1"
//             >
//               <option value="monthly">Monthly</option>
//               <option value="quarterly">Quarterly</option>
//               <option value="yearly">Yearly</option>
//             </select>
//           </div>
          
//           {loading ? (
//             <div className="text-center py-8">Loading financial data...</div>
//           ) : (
//             <>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                 {renderMetricCard('Total Revenue', metrics.totalIncome)}
//                 {renderMetricCard('Total Expenses', metrics.totalExpense, false)}
//                 {renderMetricCard('Net Profit', metrics.netProfit, metrics.netProfit >= 0)}
//               </div>
              
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//                 <FinanceChart 
//                   data={comparisonData.map(item => ({
//                     name: item.period,
//                     income: item.income,
//                     expense: item.expense
//                   }))}
//                   type="bar"
//                   title={`${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Comparison`}
//                   height={300}
//                 />
                
//                 <div className="bg-white rounded-lg shadow p-4">
//                   <h2 className="text-lg font-semibold mb-4">Key Ratios</h2>
//                   <div className="space-y-4">
//                     <div>
//                       <p className="text-gray-600">Gross Margin</p>
//                       <p className="text-xl">
//                         {metrics.totalIncome > 0 
//                           ? `${((metrics.totalIncome - metrics.totalExpense) / metrics.totalIncome * 100).toFixed(1)}%`
//                           : 'N/A'}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-gray-600">Expense Ratio</p>
//                       <p className="text-xl">
//                         {metrics.totalIncome > 0 
//                           ? `${(metrics.totalExpense / metrics.totalIncome * 100).toFixed(1)}%`
//                           : 'N/A'}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-gray-600">Profit Margin</p>
//                       <p className="text-xl">
//                         {metrics.totalIncome > 0 
//                           ? `${(metrics.netProfit / metrics.totalIncome * 100).toFixed(1)}%`
//                           : 'N/A'}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="bg-white rounded-lg shadow p-6">
//                 <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
//                 <div className="space-y-3">
//                   {metrics.netProfit < 0 && (
//                     <div className="p-3 bg-red-50 rounded">
//                       <h3 className="font-medium text-red-800">Cost Reduction Needed</h3>
//                       <p className="text-sm text-red-600">
//                         Your expenses are exceeding your income. Consider reducing costs in high-expense categories.
//                       </p>
//                     </div>
//                   )}
                  
//                   {metrics.totalExpense / metrics.totalIncome > 0.7 && (
//                     <div className="p-3 bg-yellow-50 rounded">
//                       <h3 className="font-medium text-yellow-800">High Expense Ratio</h3>
//                       <p className="text-sm text-yellow-600">
//                         Your expense ratio is high. Review discretionary spending and look for optimization opportunities.
//                       </p>
//                     </div>
//                   )}
                  
//                   <div className="p-3 bg-blue-50 rounded">
//                     <h3 className="font-medium text-blue-800">Next Steps</h3>
//                     <p className="text-sm text-blue-600">
//                       {metrics.netProfit >= 0 
//                         ? 'Consider reinvesting profits or building reserves.'
//                         : 'Develop a plan to reduce expenses and increase revenue streams.'}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
// // ******************************************



// 'use client';
// import React, { useContext, useEffect, useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
// import Header from '../../components/header';
// import Sidebar from '../../components/sidebar';
// import { usePathname } from 'next/navigation';
// import { useSidebar } from '../../lib/SidebarContext';
// import { MenuContext } from '../../lib/MenuContext';
// import { useSharedStyles } from '../../sharedStyles';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// export default function AssessmentPage() {
//   const styles = useSharedStyles();
//   const pathname = usePathname();
//   const { menuItems } = useContext(MenuContext);
//   const { isSidebarVisible } = useSidebar();
//   const currentMenuItem = menuItems.find(item => item.link === pathname);
//   const pageTitle = currentMenuItem?.menu_item || 'Financial Assessment';
//   const [financialData, setFinancialData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchFinancialData = async () => {
//       // try {
//       //   const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/finance/assessment');
//       //   setFinancialData(response.data);
//       // } catch (error) {
//       //   toast.error('Failed to load financial data');
//       //   console.error('Error fetching financial data:', error);
//       // } finally {
//         setLoading(false);
//       // }
//     };
//     fetchFinancialData();
//   }, []);

//   // Sample data structure if API fails
//   const netSalesData = financialData?.netSalesData || [
//     { name: 'Feb 2022', value: 4103 },
//     { name: 'Mar 2024', value: 4500 },
//   ];

//   const grossProfitData = financialData?.grossProfitData || [
//     { name: 'Feb 2022', value: 3819 },
//     { name: 'Mar 2024', value: 4000 },
//   ];

//   const marginData = financialData?.marginData || [
//     { name: 'Feb 2022', value: 2500 },
//     { name: 'Mar 2024', value: 2700 },
//   ];

//   const revenueBreakdownData = financialData?.revenueBreakdownData || [
//     { name: 'Feb 2020', bottoms: 400, tshirt: 300, tops: 500, accessories: 200, jeans: 600 },
//     { name: 'Feb 2021', bottoms: 400, tshirt: 300, tops: 500, accessories: 200, jeans: 600 },
//     { name: 'Feb 2022', bottoms: 400, tshirt: 300, tops: 500, accessories: 200, jeans: 600 },
//     { name: 'Feb 2023', bottoms: 400, tshirt: 300, tops: 500, accessories: 200, jeans: 600 },
//     { name: 'Mar 2024', bottoms: 500, tshirt: 350, tops: 550, accessories: 250, jeans: 700 },
//   ];

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

//           {loading ? (
//             <div className="text-center py-8">Loading financial data...</div>
//           ) : (
//             <>
//               {/* View Range Dropdown */}
//               <div style={styles.viewRange}>
//                 <div style={styles.viewRangeLabel}>View range:</div>
//                 <select style={styles.viewRangeDropdown}>
//                   <option>February 2022 - March 2024</option>
//                   <option>January 2022 - December 2023</option>
//                 </select>
//               </div>

//               {/* Financial Metrics */}
//               <div style={styles.financialMetrics}>
//                 <div style={styles.financialMetric}>
//                   <div style={styles.metricTitle}>Net Sales</div>
//                   <div style={styles.metricValue}>{`${process.env.NEXT_PUBLIC_CURRENCY}`}{financialData?.netSales || '4.103'} <span style={styles.metricChange}>+2.12%</span></div>
//                   <ResponsiveContainer width="100%" height={100}>
//                     <BarChart data={netSalesData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="name" />
//                       <YAxis />
//                       <Tooltip />
//                       <Bar dataKey="value" fill="#6A3CBC" radius={[10, 10, 0, 0]} barSize={20}  />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//                 <div style={styles.financialMetric}>
//                   <div style={styles.metricTitle}>Gross Profit</div>
//                   <div style={styles.metricValue}>{`${process.env.NEXT_PUBLIC_CURRENCY}`}{financialData?.grossProfit || '3.819'} <span style={styles.metricChange}>+1.40%</span></div>
//                   <ResponsiveContainer width="100%" height={100}>
//                     <BarChart data={grossProfitData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="name" />
//                       <YAxis />
//                       <Tooltip />
//                       <Bar dataKey="value" fill="#6A3CBC" radius={[10, 10, 0, 0]} barSize={20}  />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//                 <div style={styles.financialMetric}>
//                   <div style={styles.metricTitle}>Margin</div>
//                   <div style={styles.metricValue}>{`${process.env.NEXT_PUBLIC_CURRENCY}`}{financialData?.margin || '2.500'} <span style={styles.metricChange}>+1.20%</span></div>
//                   <ResponsiveContainer width="100%" height={100}>
//                     <BarChart data={marginData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="name" />
//                       <YAxis />
//                       <Tooltip />
//                       <Bar dataKey="value" fill="#6A3CBC" radius={[10, 10, 0, 0]} barSize={20}  />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>

//               {/* Revenue Breakdown */}
//               <div style={styles.revenueBreakdown}>
//                 <h2 style={styles.sectionTitle}>Revenue Breakdown</h2>
//                 <ResponsiveContainer width="100%" height={200}>
//                   <BarChart data={revenueBreakdownData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="bottoms" stackId="a" fill="#8884d8" radius={[0, 0, 10, 10]} barSize={20}  />
//                     <Bar dataKey="tshirt" stackId="a" fill="#82ca9d" radius={[0, 0, 0, 0]} barSize={20}  />
//                     <Bar dataKey="tops" stackId="a" fill="#ffc658" radius={[0, 0, 0, 0]} />
//                     <Bar dataKey="accessories" stackId="a" fill="#ff8042" radius={[0, 0, 0, 0]} barSize={20}  />
//                     <Bar dataKey="jeans" stackId="a" fill="#0088fe" radius={[10, 10, 0, 0]} barSize={20}  />
//                   </BarChart>
//                 </ResponsiveContainer>
//                 <div style={styles.revenueCategories}>
//                   <div style={styles.revenueCategory}>Bottoms</div>
//                   <div style={styles.revenueCategory}>T-shirt</div>
//                   <div style={styles.revenueCategory}>Tops</div>
//                   <div style={styles.revenueCategory}>Accessories</div>
//                   <div style={styles.revenueCategory}>Jeans</div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
// // *****************************



// // 'use client';
// // import React, { useContext } from 'react';
// // import {
// //   FaSearch, FaCommentDots, FaBell, FaCog, FaUserCircle, FaHome, FaBox, FaList, FaStore, FaWallet, FaPlus, FaSignOutAlt,
// // } from 'react-icons/fa';
// // import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
// // import Sidebar from '../../components/sidebar';
// // import Header from '../../components/header';
// // import { usePathname } from 'next/navigation';
// // import { useSidebar } from '../../lib/SidebarContext';
// // import { MenuContext } from '../../lib/MenuContext';
// // import { useSharedStyles } from '../../sharedStyles';

// // const assessmentPage = () => {
// //   const styles = useSharedStyles();
// //   const pathname = usePathname();
// //   const { menuItems } = useContext(MenuContext);
// //   const { isSidebarVisible, toggleSidebar } = useSidebar();

// //   // Find the matching menu item
// //   const currentMenuItem = menuItems.find(item => item.link === pathname);
// //   const pageTitle = currentMenuItem?.link || currentMenuItem?.menu_item || 'Untitled Page';

// //   // Sample data for the charts
// //   const netSalesData = [
// //     { name: 'Feb 2022', value: 4103 },
// //     { name: 'Mar 2024', value: 4500 },
// //   ];

// //   const grossProfitData = [
// //     { name: 'Feb 2022', value: 3819 },
// //     { name: 'Mar 2024', value: 4000 },
// //   ];

// //   const marginData = [
// //     { name: 'Feb 2022', value: 2500 },
// //     { name: 'Mar 2024', value: 2700 },
// //   ];

// //   const revenueBreakdownData = [
// //     { name: 'Feb 2020', bottoms: 400, tshirt: 300, tops: 500, accessories: 200, jeans: 600 },
// //     { name: 'Feb 2021', bottoms: 400, tshirt: 300, tops: 500, accessories: 200, jeans: 600 },
// //     { name: 'Feb 2022', bottoms: 400, tshirt: 300, tops: 500, accessories: 200, jeans: 600 },
// //     { name: 'Feb 2023', bottoms: 400, tshirt: 300, tops: 500, accessories: 200, jeans: 600 },
// //     { name: 'Mar 2024', bottoms: 500, tshirt: 350, tops: 550, accessories: 250, jeans: 700 },
// //   ];

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
// //         <h1 style={styles.pageTitle}>{pageTitle}</h1>

// //           {/* View Range Dropdown */}
// //           <div style={styles.viewRange}>
// //             <div style={styles.viewRangeLabel}>View range:</div>
// //             <select style={styles.viewRangeDropdown}>
// //               <option>February 2022 - March 2024</option>
// //               <option>January 2022 - December 2023</option>
// //             </select>
// //           </div>

// //           {/* Financial Metrics */}
// //           <div style={styles.financialMetrics}>
// //             <div style={styles.financialMetric}>
// //               <div style={styles.metricTitle}>Net Sales</div>
// //               <div style={styles.metricValue}>{`${process.env.NEXT_PUBLIC_CURRENCY}`}4.103 <span style={styles.metricChange}>+2.12%</span></div>
// //               <ResponsiveContainer width="100%" height={100}>
// //                 <BarChart data={netSalesData}>
// //                   <CartesianGrid strokeDasharray="3 3" />
// //                   <XAxis dataKey="name" />
// //                   <YAxis />
// //                   <Tooltip />
// //                   <Bar dataKey="value" fill="#6A3CBC" radius={[10, 10, 0, 0]} barSize={20}  />
// //                 </BarChart>
// //               </ResponsiveContainer>
// //             </div>
// //             <div style={styles.financialMetric}>
// //               <div style={styles.metricTitle}>Gross Profit</div>
// //               <div style={styles.metricValue}>{`${process.env.NEXT_PUBLIC_CURRENCY}`}3.819 <span style={styles.metricChange}>+1.40%</span></div>
// //               <ResponsiveContainer width="100%" height={100}>
// //                 <BarChart data={grossProfitData}>
// //                   <CartesianGrid strokeDasharray="3 3" />
// //                   <XAxis dataKey="name" />
// //                   <YAxis />
// //                   <Tooltip />
// //                   <Bar dataKey="value" fill="#6A3CBC" radius={[10, 10, 0, 0]} barSize={20}  />
// //                 </BarChart>
// //               </ResponsiveContainer>
// //             </div>
// //             <div style={styles.financialMetric}>
// //               <div style={styles.metricTitle}>Margin</div>
// //               <div style={styles.metricValue}>{`${process.env.NEXT_PUBLIC_CURRENCY}`}2.500 <span style={styles.metricChange}>+1.20%</span></div>
// //               <ResponsiveContainer width="100%" height={100}>
// //                 <BarChart data={marginData}>
// //                   <CartesianGrid strokeDasharray="3 3" />
// //                   <XAxis dataKey="name" />
// //                   <YAxis />
// //                   <Tooltip />
// //                   <Bar dataKey="value" fill="#6A3CBC" radius={[10, 10, 0, 0]} barSize={20}  />
// //                 </BarChart>
// //               </ResponsiveContainer>
// //             </div>
// //           </div>

// //           {/* Revenue Breakdown */}
// //           <div style={styles.revenueBreakdown}>
// //             <h2 style={styles.sectionTitle}>Revenue Breakdown</h2>
// //             <ResponsiveContainer width="100%" height={200}>
// //               <BarChart 
// //                 data={revenueBreakdownData} 
// //                 // margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
// //                 >
// //                 <CartesianGrid strokeDasharray="3 3" />
// //                 <XAxis dataKey="name" />
// //                 <YAxis />
// //                 <Tooltip />
// //                 <Legend />
// //                 {/* Bottom bar (rounded top and bottom) */}
// //                 <Bar dataKey="bottoms" stackId="a" fill="#8884d8" radius={[0, 0, 10, 10]} barSize={20}  />
// //                 {/* Middle bars (no rounding) */}
// //                 <Bar dataKey="tshirt" stackId="a" fill="#82ca9d" radius={[0, 0, 0, 0]} barSize={20}  />
// //                 <Bar dataKey="tops" stackId="a" fill="#ffc658" radius={[0, 0, 0, 0]} />
// //                 <Bar dataKey="accessories" stackId="a" fill="#ff8042" radius={[0, 0, 0, 0]} barSize={20}  />
// //                 {/* Top bar (rounded top and bottom) */}
// //                 <Bar dataKey="jeans" stackId="a" fill="#0088fe" radius={[10, 10, 0, 0]} barSize={20}  />
// //               </BarChart>
// //             </ResponsiveContainer>
// //             <div style={styles.revenueCategories}>
// //               <div style={styles.revenueCategory}>Bottoms</div>
// //               <div style={styles.revenueCategory}>T-shirt</div>
// //               <div style={styles.revenueCategory}>Tops</div>
// //               <div style={styles.revenueCategory}>Accessories</div>
// //               <div style={styles.revenueCategory}>Jeans</div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };


// // export default assessmentPage;