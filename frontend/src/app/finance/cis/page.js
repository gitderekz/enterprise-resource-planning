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

export default function CustomerInfoPage() {
  const { isSidebarVisible } = useSidebar();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const styles = useSharedStyles();
  const [showForm, setShowForm] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/customers`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: searchTerm }
      });
      setCustomers(response.data);
    } catch (error) {
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [searchTerm]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Customer deleted successfully');
      fetchCustomers();
    } catch (error) {
      toast.error('Failed to delete customer');
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
            <h1 className="text-2xl font-bold">Customer Information System</h1>
            <button
              onClick={() => {
                setCurrentCustomer(null);
                setShowForm(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Customer
            </button>
          </div>
          
          {showForm ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                {currentCustomer ? 'Edit' : 'Add New'} Customer
              </h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                // Implement customer form submission
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      defaultValue={currentCustomer?.name || ''}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full p-2 border rounded"
                      defaultValue={currentCustomer?.email || ''}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="tel"
                      className="w-full p-2 border rounded"
                      defaultValue={currentCustomer?.phone || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      className="w-full p-2 border rounded"
                      defaultValue={currentCustomer?.status || 'active'}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <textarea
                    className="w-full p-2 border rounded"
                    rows="3"
                    defaultValue={currentCustomer?.address || ''}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="w-full p-2 border rounded md:w-1/3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <FinanceChart 
                  data={[
                    { name: 'Active', value: customers.filter(c => c.status === 'active').length },
                    { name: 'Inactive', value: customers.filter(c => c.status === 'inactive').length }
                  ]}
                  type="pie"
                  title="Customer Status"
                />
                <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-lg font-semibold mb-4">Customer Summary</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-600">Total Customers</p>
                      <p className="text-2xl font-bold">{customers.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Active Customers</p>
                      <p className="text-xl text-green-600">
                        {customers.filter(c => c.status === 'active').length}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">New This Month</p>
                      <p className="text-xl">
                        {customers.filter(c => {
                          const created = new Date(c.createdAt);
                          const now = new Date();
                          return created.getMonth() === now.getMonth() && 
                                 created.getFullYear() === now.getFullYear();
                        }).length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow">
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-4 border">Name</th>
                        <th className="py-2 px-4 border">Email</th>
                        <th className="py-2 px-4 border">Phone</th>
                        <th className="py-2 px-4 border">Status</th>
                        <th className="py-2 px-4 border">Last Purchase</th>
                        <th className="py-2 px-4 border">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="6" className="py-4 text-center">Loading customers...</td>
                        </tr>
                      ) : customers.length > 0 ? (
                        customers.map((customer) => (
                          <tr key={customer.id} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border">{customer.name}</td>
                            <td className="py-2 px-4 border">{customer.email}</td>
                            <td className="py-2 px-4 border">{customer.phone}</td>
                            <td className="py-2 px-4 border">
                              <span className={`px-2 py-1 rounded text-xs ${
                                customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {customer.status}
                              </span>
                            </td>
                            <td className="py-2 px-4 border">
                              {customer.lastPurchase 
                                ? new Date(customer.lastPurchase).toLocaleDateString() 
                                : 'Never'}
                            </td>
                            <td className="py-2 px-4 border">
                              <button 
                                onClick={() => {
                                  setCurrentCustomer(customer);
                                  setShowForm(true);
                                }}
                                className="text-blue-500 hover:text-blue-700 mr-2"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDelete(customer.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="py-4 text-center text-gray-500">No customers found</td>
                        </tr>
                      )}
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



// 'use client';
// import React, { useContext } from 'react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import Header from '../../components/header';
// import Sidebar from '../../components/sidebar';
// import { useSharedStyles } from '../../sharedStyles';
// import { usePathname } from 'next/navigation';
// import { MenuContext } from '../../lib/MenuContext';
// import { useSidebar } from '../../lib/SidebarContext';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { useEffect, useState } from 'react';

// const customerData = [
//   { name: 'Jan', new: 12, returning: 8, churned: 2 },
//   { name: 'Feb', new: 15, returning: 10, churned: 1 },
//   { name: 'Mar', new: 8, returning: 12, churned: 3 },
//   { name: 'Apr', new: 20, returning: 15, churned: 2 },
//   { name: 'May', new: 18, returning: 18, churned: 1 },
// ];

// export default function CustomerInfoPage() {
//   const styles = useSharedStyles();
//   const pathname = usePathname();
//   const { menuItems } = useContext(MenuContext);
//   const { isSidebarVisible } = useSidebar();
//   const currentMenuItem = menuItems.find(item => item.link === pathname);
//   const pageTitle = currentMenuItem?.menu_item || 'Customer Information';
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // useEffect(() => {
//   //   const fetchCustomers = async () => {
//   //     try {
//   //       const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/customers');
//   //       setCustomers(response.data);
//   //     } catch (error) {
//   //       toast.error('Failed to fetch customers');
//   //       console.error('Error fetching customers:', error);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };
//   //   fetchCustomers();
//   // }, []);

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

//           {/* Customer Trends */}
//           <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//             <h2 className="text-xl font-semibold mb-4">Customer Trends</h2>
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={customerData}>
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="new" fill="#4CAF50" name="New Customers" />
//                   <Bar dataKey="returning" fill="#2196F3" name="Returning Customers" />
//                   <Bar dataKey="churned" fill="#F44336" name="Churned Customers" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Customer List */}
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">Customer List</h2>
//               <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//                 Add Customer
//               </button>
//             </div>
//             {loading ? (
//               <div className="text-center py-8">Loading customers...</div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full bg-white">
//                   <thead>
//                     <tr>
//                       <th className="py-2 px-4 border-b">Name</th>
//                       <th className="py-2 px-4 border-b">Email</th>
//                       <th className="py-2 px-4 border-b">Phone</th>
//                       <th className="py-2 px-4 border-b">Status</th>
//                       <th className="py-2 px-4 border-b">Last Purchase</th>
//                       <th className="py-2 px-4 border-b">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {customers.length > 0 ? (
//                       customers.map((customer) => (
//                         <tr key={customer.id}>
//                           <td className="py-2 px-4 border-b">{customer.name}</td>
//                           <td className="py-2 px-4 border-b">{customer.email}</td>
//                           <td className="py-2 px-4 border-b">{customer.phone}</td>
//                           <td className="py-2 px-4 border-b">
//                             <span className={`px-2 py-1 rounded text-xs ${
//                               customer.status === 'active' ? 'bg-green-100 text-green-800' :
//                               customer.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
//                               'bg-red-100 text-red-800'
//                             }`}>
//                               {customer.status}
//                             </span>
//                           </td>
//                           <td className="py-2 px-4 border-b">{customer.lastPurchase || 'N/A'}</td>
//                           <td className="py-2 px-4 border-b">
//                             <button className="text-blue-600 hover:underline mr-2">View</button>
//                             <button className="text-gray-600 hover:underline">Edit</button>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="6" className="py-4 text-center text-gray-500">No customers found</td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             )}
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

// // const cisPage = () => {
  
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

// // export default cisPage;