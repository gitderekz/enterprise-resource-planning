'use client';
import React, { useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import { useSharedStyles } from '../../sharedStyles';
import { usePathname } from 'next/navigation';
import { MenuContext } from '../../lib/MenuContext';
import { useSidebar } from '../../lib/SidebarContext';

const attendanceData = [
  { name: 'Jan', present: 85, absent: 15 },
  { name: 'Feb', present: 78, absent: 22 },
  { name: 'Mar', present: 92, absent: 8 },
  { name: 'Apr', present: 88, absent: 12 },
  { name: 'May', present: 95, absent: 5 },
];

const lateArrivals = [
  { name: 'John Doe', lateDays: 3 },
  { name: 'Jane Smith', lateDays: 5 },
  { name: 'Robert Johnson', lateDays: 2 },
  { name: 'Emily Davis', lateDays: 1 },
];

export default function AttendancePage() {
  const styles = useSharedStyles();
  const pathname = usePathname();
  const { menuItems } = useContext(MenuContext);
  const { isSidebarVisible } = useSidebar();
  const currentMenuItem = menuItems.find(item => item.link === pathname);
  const pageTitle = currentMenuItem?.menu_item || 'Attendance';

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

          {/* Attendance Overview */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Monthly Attendance Rate</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="#4CAF50" name="Present (%)" />
                  <Bar dataKey="absent" fill="#F44336" name="Absent (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Late Arrivals */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Late Arrivals This Month</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Employee</th>
                    <th className="py-2 px-4 border-b">Late Days</th>
                    <th className="py-2 px-4 border-b">Average Delay</th>
                    <th className="py-2 px-4 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lateArrivals.map((employee, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{employee.name}</td>
                      <td className="py-2 px-4 border-b">{employee.lateDays}</td>
                      <td className="py-2 px-4 border-b">{Math.floor(Math.random() * 30) + 5} mins</td>
                      <td className="py-2 px-4 border-b">
                        <button className="text-blue-600 hover:underline">Send Reminder</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Department-wise Attendance */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Department-wise Attendance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['HR', 'Engineering', 'Marketing'].map((dept, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <h3 className="font-medium">{dept} Department</h3>
                  <div className="mt-4">
                    <div className="flex justify-between mb-1">
                      <span>Present:</span>
                      <span className="text-green-600">{85 + i * 5}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Absent:</span>
                      <span className="text-red-600">{15 - i * 5}%</span>
                    </div>
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

// const attendancePage = () => {
  
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

// export default attendancePage;