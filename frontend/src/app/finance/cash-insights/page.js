'use client';
import React, { useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import { useSharedStyles } from '../../sharedStyles';
import { usePathname } from 'next/navigation';
import { MenuContext } from '../../lib/MenuContext';
import { useSidebar } from '../../lib/SidebarContext';

const cashData = [
  { name: 'Jan', inflow: 4000, outflow: 2400 },
  { name: 'Feb', inflow: 3000, outflow: 1398 },
  { name: 'Mar', inflow: 2000, outflow: 9800 },
  { name: 'Apr', inflow: 2780, outflow: 3908 },
  { name: 'May', inflow: 1890, outflow: 4800 },
];

const accountBalances = [
  { name: 'Operating Account', balance: 125000 },
  { name: 'Payroll Account', balance: 87500 },
  { name: 'Tax Account', balance: 42000 },
];

export default function CashInsightsPage() {
  const styles = useSharedStyles();
  const pathname = usePathname();
  const { menuItems } = useContext(MenuContext);
  const { isSidebarVisible } = useSidebar();
  const currentMenuItem = menuItems.find(item => item.link === pathname);
  const pageTitle = currentMenuItem?.menu_item || 'Cash Insights';

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

          {/* Cash Flow Overview */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Cash Flow Overview</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="inflow" fill="#4CAF50" name="Cash Inflow" />
                  <Bar dataKey="outflow" fill="#F44336" name="Cash Outflow" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Account Balances */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Account Balances</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {accountBalances.map((account, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-medium">{account.name}</h3>
                  <p className="text-2xl mt-2">{`${process.env.NEXT_PUBLIC_CURRENCY}`}{account.balance.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cash Projections */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">30-Day Cash Projection</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Date</th>
                    <th className="py-2 px-4 border-b">Expected Inflow</th>
                    <th className="py-2 px-4 border-b">Expected Outflow</th>
                    <th className="py-2 px-4 border-b">Projected Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td className="py-2 px-4 border-b">{new Date(Date.now() + i * 86400000).toLocaleDateString()}</td>
                      <td className="py-2 px-4 border-b text-green-600">{`${process.env.NEXT_PUBLIC_CURRENCY}`}{(Math.random() * 10000).toFixed(2)}</td>
                      <td className="py-2 px-4 border-b text-red-600">{`${process.env.NEXT_PUBLIC_CURRENCY}`}{(Math.random() * 8000).toFixed(2)}</td>
                      <td className="py-2 px-4 border-b">{`${process.env.NEXT_PUBLIC_CURRENCY}`}{(125000 + i * 2000).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

// const cashInsightsPage = () => {
  
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

// export default cashInsightsPage;