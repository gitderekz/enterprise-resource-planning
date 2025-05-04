'use client';
import React, { useContext } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import { useSharedStyles } from '../../sharedStyles';
import { usePathname } from 'next/navigation';
import { MenuContext } from '../../lib/MenuContext';
import { useSidebar } from '../../lib/SidebarContext';

const employeeData = [
  { name: 'Full-time', value: 75 },
  { name: 'Part-time', value: 15 },
  { name: 'Contract', value: 10 },
];

const departmentData = [
  { department: 'Engineering', headcount: 35 },
  { department: 'Marketing', headcount: 15 },
  { department: 'Sales', headcount: 20 },
  { department: 'HR', headcount: 5 },
  { department: 'Operations', headcount: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function AdministrationPage() {
  const styles = useSharedStyles();
  const pathname = usePathname();
  const { menuItems } = useContext(MenuContext);
  const { isSidebarVisible } = useSidebar();
  const currentMenuItem = menuItems.find(item => item.link === pathname);
  const pageTitle = currentMenuItem?.menu_item || 'HR Administration';

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

          {/* Employee Composition */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Employee Composition</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="h-64 w-full md:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={employeeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {employeeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="font-medium mb-2">Key Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="text-sm text-gray-600">Total Employees</div>
                    <div className="text-2xl font-bold mt-1">100</div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-sm text-gray-600">Avg Tenure</div>
                    <div className="text-2xl font-bold mt-1">2.5 yrs</div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-sm text-gray-600">Open Positions</div>
                    <div className="text-2xl font-bold mt-1">12</div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-sm text-gray-600">Turnover Rate</div>
                    <div className="text-2xl font-bold mt-1">8%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Department Headcount */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Department Headcount</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Department</th>
                    <th className="py-2 px-4 border-b">Headcount</th>
                    <th className="py-2 px-4 border-b">% of Total</th>
                    <th className="py-2 px-4 border-b">Budget vs Actual</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentData.map((dept, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{dept.department}</td>
                      <td className="py-2 px-4 border-b">{dept.headcount}</td>
                      <td className="py-2 px-4 border-b">{(dept.headcount / 100 * 100).toFixed(1)}%</td>
                      <td className="py-2 px-4 border-b">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              dept.headcount > 30 ? 'bg-green-600' : 
                              dept.headcount > 15 ? 'bg-blue-600' : 'bg-yellow-600'
                            }`} 
                            style={{ width: `${Math.min(dept.headcount * 3, 100)}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent HR Activity</h2>
            <div className="space-y-4">
              {[
                'Updated employee handbook policy',
                'Processed 5 new hires',
                'Conducted quarterly benefits review',
                'Completed payroll for June',
                'Scheduled team building event'
              ].map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-800">{activity}</p>
                    <p className="text-sm text-gray-500">{index + 1} day ago</p>
                  </div>
                </div>
              ))}
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

// const administrationPage = () => {
  
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

// export default administrationPage;