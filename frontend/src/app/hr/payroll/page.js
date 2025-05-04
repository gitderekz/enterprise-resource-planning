'use client';
import React, { useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import { useSharedStyles } from '../../sharedStyles';
import { usePathname } from 'next/navigation';
import { MenuContext } from '../../lib/MenuContext';
import { useSidebar } from '../../lib/SidebarContext';

const payrollData = [
  { name: 'Jan', amount: 125000, tax: 25000 },
  { name: 'Feb', amount: 132000, tax: 26400 },
  { name: 'Mar', amount: 141000, tax: 28200 },
  { name: 'Apr', amount: 128000, tax: 25600 },
  { name: 'May', amount: 135000, tax: 27000 },
];

const upcomingPayments = [
  { name: 'John Doe', position: 'Developer', amount: 4500, date: '2023-06-30' },
  { name: 'Jane Smith', position: 'Designer', amount: 3800, date: '2023-06-30' },
  { name: 'Robert Johnson', position: 'Manager', amount: 5200, date: '2023-06-30' },
];

export default function PayrollPage() {
  const styles = useSharedStyles();
  const pathname = usePathname();
  const { menuItems } = useContext(MenuContext);
  const { isSidebarVisible } = useSidebar();
  const currentMenuItem = menuItems.find(item => item.link === pathname);
  const pageTitle = currentMenuItem?.menu_item || 'Payroll';

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

          {/* Payroll Trends */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Payroll Trends</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={payrollData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#8884d8" name="Gross Payroll" />
                  <Line type="monotone" dataKey="tax" stroke="#82ca9d" name="Tax Deductions" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upcoming Payments */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Payments</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Employee</th>
                    <th className="py-2 px-4 border-b">Position</th>
                    <th className="py-2 px-4 border-b">Amount</th>
                    <th className="py-2 px-4 border-b">Payment Date</th>
                    <th className="py-2 px-4 border-b">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingPayments.map((payment, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{payment.name}</td>
                      <td className="py-2 px-4 border-b">{payment.position}</td>
                      <td className="py-2 px-4 border-b">${payment.amount}</td>
                      <td className="py-2 px-4 border-b">{payment.date}</td>
                      <td className="py-2 px-4 border-b">
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Pending</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payroll Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Payroll Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium">Total Monthly Payroll</h3>
                <p className="text-2xl mt-2">$135,000</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium">Average Salary</h3>
                <p className="text-2xl mt-2">$4,500</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium">Tax Deductions</h3>
                <p className="text-2xl mt-2">$27,000</p>
              </div>
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

// const payrollPage = () => {
  
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

// export default payrollPage;