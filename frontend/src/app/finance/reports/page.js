'use client';
import React, { useState, useEffect } from 'react';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import { useSharedStyles } from '../../sharedStyles';
import FinanceChart from '../components/FinanceChart';
import { useSidebar } from '../../lib/SidebarContext';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function FinancialReportsPage() {
  const { isSidebarVisible } = useSidebar();
  const [reportType, setReportType] = useState('income-statement');
  const [timeRange, setTimeRange] = useState('monthly');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const styles = useSharedStyles();

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/finance/reports/${reportType}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { range: timeRange }
      });
      setReportData(response.data);
    } catch (error) {
      toast.error('Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [reportType, timeRange]);

  const handleExport = async (format) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/finance/reports/export/${reportType}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { range: timeRange, format },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}-report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error(`Failed to export report: ${error.message}`);
    }
  };

  const renderReportContent = () => {
    if (loading) return <div className="text-center py-8">Loading report data...</div>;
    if (!reportData) return null;

    switch (reportType) {
      case 'income-statement':
        return (
          <div className="space-y-6">
            <FinanceChart 
              data={[
                { name: 'Income', value: reportData.totalIncome },
                { name: 'Expenses', value: reportData.totalExpense },
                { name: 'Profit', value: reportData.netProfit }
              ]}
              type="bar"
              title="Income Statement Overview"
            />
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Detailed Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border">Category</th>
                      <th className="py-2 px-4 border">Amount</th>
                      <th className="py-2 px-4 border">% of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData?.categories?.map((category, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border capitalize">{category.name}</td>
                        <td className={`py-2 px-4 border ${
                          category.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {category.amount.toLocaleString(undefined, {
                            style: 'currency',
                            currency: 'TSH'
                          })}
                        </td>
                        <td className="py-2 px-4 border">
                          {((category.amount / (category.type === 'income' 
                            ? reportData.totalIncome 
                            : reportData.totalExpense)) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      
      case 'balance-sheet':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Assets</h3>
                <div className="space-y-3">
                  {reportData.assets?.items?.map((asset, index) => (
                    <div key={index} className="flex justify-between border-b pb-2">
                      <span>{asset.name??asset.category}</span>
                      <span className="text-green-600">
                        {asset.value?.toLocaleString(undefined, {
                          style: 'currency',
                          currency: 'TSH'
                        })}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold pt-2">
                    <span>Total Assets</span>
                    <span className="text-green-600">
                      {reportData.assets?.total?.toLocaleString(undefined, {
                        style: 'currency',
                        currency: 'TSH'
                      })}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Liabilities & Equity</h3>
                <div className="space-y-3">
                  {reportData.liabilities?.items?.map((liability, index) => (
                    <div key={index} className="flex justify-between border-b pb-2">
                      <span>{liability.category}</span>
                      <span className="text-red-600">
                        {liability.value?.toLocaleString(undefined, {
                          style: 'currency',
                          currency: 'TSH'
                        })}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between border-b pb-2">
                    <span>Equity</span>
                    <span className="text-blue-600">
                      {reportData.equity?.toLocaleString(undefined, {
                        style: 'currency',
                        currency: 'TSH'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold pt-2">
                    <span>Total Liabilities & Equity</span>
                    <span>
                      {reportData.totalLiabilitiesAndEquity?.toLocaleString(undefined, {
                        style: 'currency',
                        currency: 'TSH'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'cash-flow':
        return (
          <div className="space-y-6">
            <FinanceChart
              // data={reportData.cashFlow?.map(item => ({
              //   name: item.period,
              //   inflow: Number(item.inflow),
              //   outflow: Number(item.outflow)
              // }))}
              data={reportData.cashFlow?.flatMap(item => [
                { name: `${item.period} (Inflow)`, value: item.inflow, color: "#16a34a"},
                { name: `${item.period} (Outflow)`, value: item.outflow , color: "#dc2626"}
              ])}
              type="bar"
              title="Cash Flow Overview"
            />

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Cash Flow Details</h3>
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">Period</th>
                    <th className="py-2 px-4 border">Inflow</th>
                    <th className="py-2 px-4 border">Outflow</th>
                    <th className="py-2 px-4 border">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.cashFlow?.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border">{item.period}</td>
                      <td className="py-2 px-4 border text-green-600">
                        {item.inflow.toLocaleString(undefined, {
                          style: 'currency', currency: 'TSH'
                        })}
                      </td>
                      <td className="py-2 px-4 border text-red-600">
                        {item.outflow.toLocaleString(undefined, {
                          style: 'currency', currency: 'TSH'
                        })}
                      </td>
                      <td className="py-2 px-4 border font-medium">
                        {item.balance.toLocaleString(undefined, {
                          style: 'currency', currency: 'TSH'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 text-sm text-gray-500">
                Period: {new Date(reportData.period?.start).toLocaleDateString()} → {new Date(reportData.period?.end).toLocaleDateString()} <br />
                Closing Balance: {reportData.closingBalance?.toLocaleString(undefined, {
                  style: 'currency', currency: 'TSH'
                })}
              </div>
            </div>
          </div>
        );

      case 'budget-vs-actual':
        return (
          <div className="space-y-6">
            <FinanceChart
              // data={reportData.budgetVsActual?.map(item => ({
              //   name: item.category,
              //   value: item.actual
              // }))}
              data={reportData.budgetVsActual?.map(item => ({
                name: item.category,
                budget: item.budget,
                actual: item.actual
              }))}
              type="bar"
              title="Actual vs Budget by Category"
            />

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Budget vs Actual</h3>
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">Category</th>
                    <th className="py-2 px-4 border">Type</th>
                    <th className="py-2 px-4 border">Budget</th>
                    <th className="py-2 px-4 border">Actual</th>
                    <th className="py-2 px-4 border">Variance</th>
                    <th className="py-2 px-4 border">Variance %</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.budgetVsActual?.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border capitalize">{item.category}</td>
                      <td className="py-2 px-4 border capitalize">{item.type}</td>
                      <td className="py-2 px-4 border">
                        {item.budget.toLocaleString(undefined, { style: 'currency', currency: 'TSH' })}
                      </td>
                      <td className="py-2 px-4 border">
                        {item.actual.toLocaleString(undefined, { style: 'currency', currency: 'TSH' })}
                      </td>
                      <td className={`py-2 px-4 border ${item.variance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {item.variance?.toLocaleString(undefined, { style: 'currency', currency: 'TSH' })}
                      </td>
                      <td className="py-2 px-4 border">
                        {item.variancePercentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 text-sm text-gray-500">
                Total Budget: {reportData.totalBudget?.toLocaleString(undefined, {
                  style: 'currency', currency: 'TSH'
                })}<br />
                Total Actual: {(reportData.totalActual || 0).toLocaleString(undefined, {
                  style: 'currency', currency: 'TSH'
                })}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Report Data</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
              {JSON.stringify(reportData, null, 2)}
            </pre>
          </div>
        );
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold">Financial Reports</h1>
            
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="border rounded px-3 py-1"
              >
                <option value="income-statement">Income Statement</option>
                <option value="balance-sheet">Balance Sheet</option>
                <option value="cash-flow">Cash Flow</option>
                <option value="budget-vs-actual">Budget vs Actual</option>
              </select>
              
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border rounded px-3 py-1"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => handleExport('pdf')}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1"
                >
                  PDF
                </button>
                <button 
                  onClick={() => handleExport('excel')}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
                >
                  Excel
                </button>
                <button 
                  onClick={() => handleExport('csv')}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
                >
                  CSV
                </button>
              </div>
            </div>
          </div>
          
          {renderReportContent()}
        </div>
      </div>
    </div>
  );
}



// 'use client';
// import React, { useContext } from 'react';
// import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import Header from '../../components/header';
// import Sidebar from '../../components/sidebar';
// import { useSharedStyles } from '../../sharedStyles';
// import { usePathname } from 'next/navigation';
// import { MenuContext } from '../../lib/MenuContext';
// import { useSidebar } from '../../lib/SidebarContext';

// const reportData = [
//   { month: 'Jan', revenue: 4000, expenses: 2400, profit: 1600 },
//   { month: 'Feb', revenue: 3000, expenses: 1398, profit: 1602 },
//   { month: 'Mar', revenue: 9800, expenses: 2000, profit: 7800 },
//   { month: 'Apr', revenue: 3908, expenses: 2780, profit: 1128 },
//   { month: 'May', revenue: 4800, expenses: 1890, profit: 2910 },
//   { month: 'Jun', revenue: 3800, expenses: 2390, profit: 1410 },
// ];

// const kpiData = [
//   { name: 'Gross Margin', value: '42%', trend: 'up' },
//   { name: 'Operating Margin', value: '28%', trend: 'up' },
//   { name: 'Current Ratio', value: '1.8', trend: 'stable' },
//   { name: 'Quick Ratio', value: '1.2', trend: 'down' },
// ];

// export default function ReportPage() {
//   const styles = useSharedStyles();
//   const pathname = usePathname();
//   const { menuItems } = useContext(MenuContext);
//   const { isSidebarVisible } = useSidebar();
//   const currentMenuItem = menuItems.find(item => item.link === pathname);
//   const pageTitle = currentMenuItem?.menu_item || 'Financial Reports';

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

//           {/* Report Period Selector */}
//           <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex justify-between items-center">
//             <div>
//               <select className="border rounded px-3 py-2 mr-2">
//                 <option>Monthly</option>
//                 <option>Quarterly</option>
//                 <option>Annual</option>
//               </select>
//               <select className="border rounded px-3 py-2">
//                 <option>Last 6 Months</option>
//                 <option>Year to Date</option>
//                 <option>Last 12 Months</option>
//               </select>
//             </div>
//             <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center">
//               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
//               </svg>
//               Export Report
//             </button>
//           </div>

//           {/* Financial Performance */}
//           <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//             <h2 className="text-xl font-semibold mb-4">Financial Performance</h2>
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <ComposedChart data={reportData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="month" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
//                   <Bar dataKey="expenses" fill="#ff7300" name="Expenses" />
//                   <Line type="monotone" dataKey="profit" stroke="#ff7300" name="Profit" />
//                 </ComposedChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Key Financial Indicators */}
//           <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//             <h2 className="text-xl font-semibold mb-4">Key Financial Indicators</h2>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               {kpiData.map((kpi, index) => (
//                 <div key={index} className="border rounded-lg p-4">
//                   <div className="flex justify-between items-start">
//                     <h3 className="font-medium">{kpi.name}</h3>
//                     <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                       kpi.trend === 'up' ? 'bg-green-100 text-green-800' :
//                       kpi.trend === 'down' ? 'bg-red-100 text-red-800' :
//                       'bg-blue-100 text-blue-800'
//                     }`}>
//                       {kpi.trend === 'up' ? '↑' : kpi.trend === 'down' ? '↓' : '→'}
//                     </span>
//                   </div>
//                   <p className="text-2xl mt-2">{kpi.value}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Detailed Reports */}
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-semibold mb-4">Available Reports</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {[
//                 { name: 'Balance Sheet', icon: '📊', date: 'Jun 2023' },
//                 { name: 'Income Statement', icon: '📈', date: 'Jun 2023' },
//                 { name: 'Cash Flow', icon: '💵', date: 'Jun 2023' },
//                 { name: 'Budget vs Actual', icon: '📋', date: 'Q2 2023' },
//                 { name: 'Tax Report', icon: '🏛️', date: 'Q2 2023' },
//                 { name: 'Annual Report', icon: '📑', date: '2022' },
//               ].map((report, index) => (
//                 <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
//                   <div className="flex items-center">
//                     <span className="text-2xl mr-3">{report.icon}</span>
//                     <div>
//                       <h3 className="font-medium">{report.name}</h3>
//                       <p className="text-sm text-gray-600">{report.date}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
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
// // } from 'react-icons/fa'; // Icons from react-icons
// // import { usePathname } from 'next/navigation';
// // import { useSidebar } from '../../lib/SidebarContext';
// // import { MenuContext } from '../../lib/MenuContext';
// // import Header from '../../components/header';
// // import Sidebar from '../../components/sidebar';
// // import { useSharedStyles } from '../../sharedStyles';

// // const reportsPage = () => {
  
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

// // export default reportsPage;