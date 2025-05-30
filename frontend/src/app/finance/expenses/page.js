'use client';
import React, { useState, useEffect } from 'react';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import { useSharedStyles } from '../../sharedStyles';
import FinanceTable from '../components/FinanceTable';
import FinanceForm from '../components/FinanceForm';
import FinanceChart from '../components/FinanceChart';
import { useSidebar } from '../../lib/SidebarContext';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ExpensesPage() {
  const { isSidebarVisible } = useSidebar();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const styles = useSharedStyles();
  const [showForm, setShowForm] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [timeRange, setTimeRange] = useState('monthly');
  const [chartData, setChartData] = useState([]);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/finance`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { type: 'expense' }
      });
      setExpenses(response.data);
      processChartData(response.data);
    } catch (error) {
      toast.error('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (data) => {
    // Group by category for pie chart
    const categoryMap = {};
    data.forEach(expense => {
      if (!categoryMap[expense.category]) {
        categoryMap[expense.category] = 0;
      }
      categoryMap[expense.category] += expense.amount;
    });
    
    const processed = Object.keys(categoryMap).map(category => ({
      name: category,
      value: categoryMap[category]
    }));
    
    setChartData(processed);
  };

  useEffect(() => {
    fetchExpenses();
  }, [timeRange]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/finance/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Expense deleted successfully');
      fetchExpenses();
    } catch (error) {
      toast.error('Failed to delete expense');
    }
  };

  const handleEdit = (record) => {
    setCurrentRecord(record);
    setShowForm(true);
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Expense Management</h1>
            <button
              onClick={() => {
                setCurrentRecord(null);
                setShowForm(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Expense
            </button>
          </div>
          
          {showForm ? (
            <FinanceForm 
              record={currentRecord}
              onSuccess={() => {
                setShowForm(false);
                fetchExpenses();
              }}
              onCancel={() => setShowForm(false)}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="col-span-2">
                  <FinanceChart 
                    data={chartData}
                    type="pie"
                    title="Expense Breakdown by Category"
                  />
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-lg font-semibold mb-4">Expense Summary</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-600">Total Expenses</p>
                      <p className="text-2xl font-bold text-red-600">
                        {expenses.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Average Expense</p>
                      <p className="text-xl">
                        {expenses.length > 0 
                          ? (expenses.reduce((sum, item) => sum + item.amount, 0) / expenses.length).toLocaleString(undefined, {
                              maximumFractionDigits: 2
                            })
                          : 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Categories</p>
                      <p className="text-xl">
                        {new Set(expenses.map(e => e.category)).size}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <FinanceTable 
                records={expenses} 
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}



// 'use client';
// import React, { useContext } from 'react';
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import Header from '../../components/header';
// import Sidebar from '../../components/sidebar';
// import { useSharedStyles } from '../../sharedStyles';
// import { usePathname } from 'next/navigation';
// import { MenuContext } from '../../lib/MenuContext';
// import { useSidebar } from '../../lib/SidebarContext';

// const expenseData = [
//   { name: 'Payroll', value: 45 },
//   { name: 'Office Supplies', value: 15 },
//   { name: 'Utilities', value: 12 },
//   { name: 'Marketing', value: 10 },
//   { name: 'Travel', value: 8 },
//   { name: 'Other', value: 10 },
// ];

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

// export default function ExpensesPage() {
//   const styles = useSharedStyles();
//   const pathname = usePathname();
//   const { menuItems } = useContext(MenuContext);
//   const { isSidebarVisible } = useSidebar();
//   const currentMenuItem = menuItems.find(item => item.link === pathname);
//   const pageTitle = currentMenuItem?.menu_item || 'Expenses';

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

//           {/* Expense Breakdown */}
//           <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//             <h2 className="text-xl font-semibold mb-4">Expense Breakdown</h2>
//             <div className="flex flex-col md:flex-row gap-6">
//               <div className="h-64 w-full md:w-1/2">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={expenseData}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       outerRadius={80}
//                       fill="#8884d8"
//                       dataKey="value"
//                       label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                     >
//                       {expenseData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//               <div className="w-full md:w-1/2">
//                 <h3 className="font-medium mb-2">Recent Expenses</h3>
//                 <div className="space-y-3">
//                   {[...Array(5)].map((_, i) => (
//                     <div key={i} className="flex justify-between border-b pb-2">
//                       <span>Expense {i + 1}</span>
//                       <span className="text-red-600">-${(Math.random() * 1000).toFixed(2)}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Department-wise Expenses */}
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-semibold mb-4">Department-wise Expenses</h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white">
//                 <thead>
//                   <tr>
//                     <th className="py-2 px-4 border-b">Department</th>
//                     <th className="py-2 px-4 border-b">Budget</th>
//                     <th className="py-2 px-4 border-b">Spent</th>
//                     <th className="py-2 px-4 border-b">Remaining</th>
//                     <th className="py-2 px-4 border-b">% Used</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {['HR', 'Engineering', 'Marketing', 'Sales', 'Operations'].map((dept, i) => {
//                     const budget = 50000 + Math.random() * 50000;
//                     const spent = budget * (0.3 + Math.random() * 0.5);
//                     return (
//                       <tr key={i}>
//                         <td className="py-2 px-4 border-b">{dept}</td>
//                         <td className="py-2 px-4 border-b">{`${process.env.NEXT_PUBLIC_CURRENCY}`}{budget.toFixed(2)}</td>
//                         <td className="py-2 px-4 border-b text-red-600">{`${process.env.NEXT_PUBLIC_CURRENCY}`}{spent.toFixed(2)}</td>
//                         <td className="py-2 px-4 border-b text-green-600">{`${process.env.NEXT_PUBLIC_CURRENCY}`}{(budget - spent).toFixed(2)}</td>
//                         <td className="py-2 px-4 border-b">{(spent/budget*100).toFixed(1)}%</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// // ****************************



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

// // const expensesPage = () => {
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

// // export default expensesPage;