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

export default function ReceiptsPage() {
  const { isSidebarVisible } = useSidebar();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const styles = useSharedStyles();
  const [showForm, setShowForm] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [timeRange, setTimeRange] = useState('monthly');

  const fetchReceipts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/finance`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { type: 'receipt' }
      });
      setReceipts(response.data);
    } catch (error) {
      toast.error('Failed to fetch receipts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, [timeRange]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/finance/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Receipt deleted successfully');
      fetchReceipts();
    } catch (error) {
      toast.error('Failed to delete receipt');
    }
  };

  const handleUpload = async (file) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);
      
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/finance/upload`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Receipt uploaded successfully');
      fetchReceipts();
    } catch (error) {
      toast.error('Failed to upload receipt');
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Receipt Management</h1>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setCurrentRecord(null);
                  setShowForm(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Receipt
              </button>
            </div>
          </div>
          
          {showForm ? (
            <FinanceForm 
              record={currentRecord}
              onSuccess={() => {
                setShowForm(false);
                fetchReceipts();
              }}
              onCancel={() => setShowForm(false)}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <FinanceChart 
                  data={receipts
                    .filter(r => r.category)
                    .reduce((acc, receipt) => {
                      const existing = acc.find(item => item.name === receipt.category);
                      if (existing) {
                        existing.value += receipt.amount;
                      } else {
                        acc.push({ name: receipt.category, value: receipt.amount });
                      }
                      return acc;
                    }, [])}
                  type="bar"
                  title="Receipts by Category"
                />
                <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-lg font-semibold mb-4">Upload Receipt</h2>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files.length > 0) {
                          handleUpload(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                      id="receipt-upload"
                      accept="image/*,.pdf"
                    />
                    <label htmlFor="receipt-upload" className="cursor-pointer">
                      <div className="mx-auto h-12 w-12 text-gray-400 mb-2">
                        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                      </div>
                      <p className="text-gray-600">Drag and drop receipt images here, or</p>
                      <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Browse Files
                      </button>
                      <p className="mt-2 text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
                    </label>
                  </div>
                </div>
              </div>
              
              <FinanceTable 
                records={receipts} 
                onDelete={handleDelete}
                onEdit={(record) => {
                  setCurrentRecord(record);
                  setShowForm(true);
                }}
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
// import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
// import Header from '../../components/header';
// import Sidebar from '../../components/sidebar';
// import { useSharedStyles } from '../../sharedStyles';
// import { usePathname } from 'next/navigation';
// import { MenuContext } from '../../lib/MenuContext';
// import { useSidebar } from '../../lib/SidebarContext';

// const receiptData = [
//   { date: '2023-06-01', amount: 120, category: 'Office Supplies', vendor: 'SupplyCo' },
//   { date: '2023-06-05', amount: 85, category: 'Meals', vendor: 'Restaurant' },
//   { date: '2023-06-08', amount: 450, category: 'Equipment', vendor: 'TechGadgets' },
//   { date: '2023-06-12', amount: 65, category: 'Office Supplies', vendor: 'SupplyCo' },
//   { date: '2023-06-15', amount: 1200, category: 'Software', vendor: 'CloudSoft' },
//   { date: '2023-06-20', amount: 320, category: 'Travel', vendor: 'HotelChain' },
//   { date: '2023-06-25', amount: 75, category: 'Meals', vendor: 'Cafe' },
// ];

// const categorySpending = [
//   { category: 'Office Supplies', amount: 185, count: 2 },
//   { category: 'Meals', amount: 160, count: 2 },
//   { category: 'Equipment', amount: 450, count: 1 },
//   { category: 'Software', amount: 1200, count: 1 },
//   { category: 'Travel', amount: 320, count: 1 },
// ];

// export default function ReceiptsPage() {
//   const styles = useSharedStyles();
//   const pathname = usePathname();
//   const { menuItems } = useContext(MenuContext);
//   const { isSidebarVisible } = useSidebar();
//   const currentMenuItem = menuItems.find(item => item.link === pathname);
//   const pageTitle = currentMenuItem?.menu_item || 'Receipts';

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

//           {/* Receipts Overview */}
//           <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//             <h2 className="text-xl font-semibold mb-4">Receipts Analysis</h2>
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <ScatterChart
//                   margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
//                 >
//                   <CartesianGrid />
//                   <XAxis dataKey="date" name="Date" />
//                   <YAxis dataKey="amount" name="Amount ({`${process.env.NEXT_PUBLIC_CURRENCY}`})" />
//                   <ZAxis dataKey="category" name="Category" range={[50, 300]} />
//                   <Tooltip cursor={{ strokeDasharray: '3 3' }} />
//                   <Legend />
//                   <Scatter name="Receipts" data={receiptData} fill="#8884d8" />
//                 </ScatterChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Category Breakdown */}
//           <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//             <h2 className="text-xl font-semibold mb-4">Spending by Category</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <div className="space-y-4">
//                   {categorySpending.map((category, index) => (
//                     <div key={index} className="border-b pb-2">
//                       <div className="flex justify-between mb-1">
//                         <span>{category.category}</span>
//                         <span>{`${process.env.NEXT_PUBLIC_CURRENCY}`}{category.amount}</span>
//                       </div>
//                       <div className="w-full bg-gray-200 rounded-full h-2.5">
//                         <div 
//                           className="h-2.5 rounded-full bg-blue-600" 
//                           style={{ width: `${(category.amount / 2500) * 100}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div>
//                 <h3 className="font-medium mb-2">Recent Receipts</h3>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full bg-white">
//                     <thead>
//                       <tr>
//                         <th className="py-2 px-4 border-b">Date</th>
//                         <th className="py-2 px-4 border-b">Vendor</th>
//                         <th className="py-2 px-4 border-b">Amount</th>
//                         <th className="py-2 px-4 border-b">Status</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {receiptData.slice().reverse().map((receipt, index) => (
//                         <tr key={index}>
//                           <td className="py-2 px-4 border-b">{receipt.date}</td>
//                           <td className="py-2 px-4 border-b">{receipt.vendor}</td>
//                           <td className="py-2 px-4 border-b">{`${process.env.NEXT_PUBLIC_CURRENCY}`}{receipt.amount}</td>
//                           <td className="py-2 px-4 border-b">
//                             <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
//                               Processed
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Receipt Upload */}
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-semibold mb-4">Upload New Receipt</h2>
//             <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
//               </svg>
//               <div className="mt-4">
//                 <p className="text-gray-600">Drag and drop receipt images here, or</p>
//                 <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//                   Browse Files
//                 </button>
//               </div>
//               <p className="mt-2 text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// // ***********************



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

// // const receiptsPage = () => {
  
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

// // export default receiptsPage;