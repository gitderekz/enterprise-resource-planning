'use client';
import React, { useContext, useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import { useSharedStyles } from '../../sharedStyles';
import { usePathname } from 'next/navigation';
import { MenuContext } from '../../lib/MenuContext';
import { useSidebar } from '../../lib/SidebarContext';
import EmployeeTable from './components/employee-table';
import UserManagement from './components/user-management';
import ReportsSection from './components/reports-section';
import { FaUsers, FaUserClock, FaUserShield, FaUserEdit, FaUserPlus, FaFileExport } from 'react-icons/fa';
import { getEmployeeStats } from './services/employeeService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AdministrationPage() {
  const styles = useSharedStyles();
  const pathname = usePathname();
  const { menuItems } = useContext(MenuContext);
  const { isSidebarVisible } = useSidebar();
  const currentMenuItem = menuItems.find(item => item.link === pathname);
  const pageTitle = currentMenuItem?.menu_item || 'HR Administration';
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [employeeStats, setEmployeeStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
// Add to the existing state declarations
const [selectedUser, setSelectedUser] = useState(null);

// Create fetchEmployees function
const fetchEmployees = async () => {
  try {
    const stats = await getEmployeeStats();
    // const stats = await getEmployees();
    setEmployeeStats(stats);
  } catch (err) {
    setError(err.message);
  }
};
  // Stats cards data
  const statsCards = employeeStats ? [
    { title: 'Total Employees', value: employeeStats.total, icon: <FaUsers />, color: 'bg-blue-100 text-blue-600' },
    { title: 'Active Workers', value: employeeStats.active, icon: <FaUserClock />, color: 'bg-green-100 text-green-600' },
    { title: 'On Leave', value: employeeStats.onLeave, icon: <FaUserShield />, color: 'bg-yellow-100 text-yellow-600' },
    { title: 'With Permissions', value: employeeStats.withPermissions, icon: <FaUserEdit />, color: 'bg-purple-100 text-purple-600' },
  ] : [];

  useEffect(() => {
    const fetchEmployeeStats = async () => {
      try {
        setLoading(true);
        const stats = await getEmployeeStats();
        setEmployeeStats(stats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeStats();
  }, []);

  if (loading) {
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
            <div className="flex justify-center items-center h-64">
              <p>Loading employee data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'dashboard' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'employees' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('employees')}
            >
              Employees
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'management' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('management')}
            >
              User Management
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'reports' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('reports')}
            >
              Reports
            </button>
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && employeeStats && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsCards.map((card, index) => (
                  <div key={index} className={`p-4 rounded-lg shadow ${card.color}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{card.title}</p>
                        <p className="text-2xl font-bold">{card.value}</p>
                      </div>
                      <div className="text-2xl">
                        {card.icon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Employee Composition */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">Employee Composition</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={employeeStats.byType}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {employeeStats.byType.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Gender Distribution */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">Gender Distribution</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={employeeStats.byGender}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" name="Count" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Department Headcount */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Department Headcount</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b text-left">Department</th>
                        <th className="py-2 px-4 border-b text-center">Active</th>
                        <th className="py-2 px-4 border-b text-center">On Leave</th>
                        <th className="py-2 px-4 border-b text-center">With Permissions</th>
                        <th className="py-2 px-4 border-b text-center">Total</th>
                        <th className="py-2 px-4 border-b text-center">% of Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeeStats.byDepartment.map((dept, index) => (
                        <tr key={index}>
                          <td className="py-2 px-4 border-b">{dept.department}</td>
                          <td className="py-2 px-4 border-b text-center">{dept.active}</td>
                          <td className="py-2 px-4 border-b text-center">{dept.onLeave}</td>
                          <td className="py-2 px-4 border-b text-center">{dept.withPermissions}</td>
                          <td className="py-2 px-4 border-b text-center">{dept.active + dept.onLeave + dept.withPermissions}</td>
                          <td className="py-2 px-4 border-b text-center">
                            {((dept.active + dept.onLeave + dept.withPermissions) / employeeStats.total * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Employees Tab */}
          {activeTab === 'employees' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <EmployeeTable 
                onSelectEmployees={setSelectedEmployees}
                onEditUser={() => setActiveTab('management')}
              />
            </div>
          )}

          {/* User Management Tab */}
          {activeTab === 'management' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <UserManagement 
                selectedEmployees={selectedEmployees}
                refreshEmployees={fetchEmployees}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
              />
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <ReportsSection />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// ***********************************************




// 'use client';
// import React, { useContext, useState, useEffect } from 'react';
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
// import Header from '../../components/header';
// import Sidebar from '../../components/sidebar';
// import { useSharedStyles } from '../../sharedStyles';
// import { usePathname } from 'next/navigation';
// import { MenuContext } from '../../lib/MenuContext';
// import { useSidebar } from '../../lib/SidebarContext';
// import EmployeeTable from './components/employee-table';
// import UserManagement from './components/user-management';
// import ReportsSection from './components/reports-section';
// import { FaUsers, FaUserClock, FaUserShield, FaUserEdit, FaUserPlus, FaFileExport } from 'react-icons/fa';

// // Sample data - replace with API calls in a real implementation
// const employeeStats = {
//   total: 120,
//   active: 95,
//   onLeave: 15,
//   withPermissions: 10,
//   byDepartment: [
//     { name: 'Engineering', active: 35, onLeave: 5, withPermissions: 3 },
//     { name: 'Marketing', active: 15, onLeave: 2, withPermissions: 1 },
//     { name: 'Sales', active: 20, onLeave: 3, withPermissions: 2 },
//     { name: 'HR', active: 5, onLeave: 1, withPermissions: 1 },
//     { name: 'Operations', active: 15, onLeave: 2, withPermissions: 1 },
//     { name: 'Finance', active: 5, onLeave: 2, withPermissions: 2 },
//   ],
//   byGender: [
//     { name: 'Male', value: 65 },
//     { name: 'Female', value: 35 },
//   ],
//   byType: [
//     { name: 'Full-time', value: 75 },
//     { name: 'Part-time', value: 15 },
//     { name: 'Contract', value: 10 },
//     { name: 'Intern', value: 20 },
//   ]
// };

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// export default function AdministrationPage() {
//   const styles = useSharedStyles();
//   const pathname = usePathname();
//   const { menuItems } = useContext(MenuContext);
//   const { isSidebarVisible } = useSidebar();
//   const currentMenuItem = menuItems.find(item => item.link === pathname);
//   const pageTitle = currentMenuItem?.menu_item || 'HR Administration';
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [selectedEmployees, setSelectedEmployees] = useState([]);

//   // Stats cards data
//   const statsCards = [
//     { title: 'Total Employees', value: employeeStats.total, icon: <FaUsers />, color: 'bg-blue-100 text-blue-600' },
//     { title: 'Active Workers', value: employeeStats.active, icon: <FaUserClock />, color: 'bg-green-100 text-green-600' },
//     { title: 'On Leave', value: employeeStats.onLeave, icon: <FaUserShield />, color: 'bg-yellow-100 text-yellow-600' },
//     { title: 'With Permissions', value: employeeStats.withPermissions, icon: <FaUserEdit />, color: 'bg-purple-100 text-purple-600' },
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

//           {/* Tab Navigation */}
//           <div className="flex border-b border-gray-200 mb-6">
//             <button
//               className={`py-2 px-4 font-medium ${activeTab === 'dashboard' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
//               onClick={() => setActiveTab('dashboard')}
//             >
//               Dashboard
//             </button>
//             <button
//               className={`py-2 px-4 font-medium ${activeTab === 'employees' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
//               onClick={() => setActiveTab('employees')}
//             >
//               Employees
//             </button>
//             <button
//               className={`py-2 px-4 font-medium ${activeTab === 'management' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
//               onClick={() => setActiveTab('management')}
//             >
//               User Management
//             </button>
//             <button
//               className={`py-2 px-4 font-medium ${activeTab === 'reports' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
//               onClick={() => setActiveTab('reports')}
//             >
//               Reports
//             </button>
//           </div>

//           {/* Dashboard Tab */}
//           {activeTab === 'dashboard' && (
//             <div className="space-y-6">
//               {/* Stats Cards */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                 {statsCards.map((card, index) => (
//                   <div key={index} className={`p-4 rounded-lg shadow ${card.color}`}>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm font-medium">{card.title}</p>
//                         <p className="text-2xl font-bold">{card.value}</p>
//                       </div>
//                       <div className="text-2xl">
//                         {card.icon}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Charts Section */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Employee Composition */}
//                 <div className="bg-white p-6 rounded-lg shadow">
//                   <h2 className="text-xl font-semibold mb-4">Employee Composition</h2>
//                   <div className="h-64">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <Pie
//                           data={employeeStats.byType}
//                           cx="50%"
//                           cy="50%"
//                           labelLine={false}
//                           outerRadius={80}
//                           fill="#8884d8"
//                           dataKey="value"
//                           label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                         >
//                           {employeeStats.byType.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                           ))}
//                         </Pie>
//                         <Tooltip />
//                         <Legend />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>

//                 {/* Gender Distribution */}
//                 <div className="bg-white p-6 rounded-lg shadow">
//                   <h2 className="text-xl font-semibold mb-4">Gender Distribution</h2>
//                   <div className="h-64">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart
//                         data={employeeStats.byGender}
//                         margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                       >
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="name" />
//                         <YAxis />
//                         <Tooltip />
//                         <Legend />
//                         <Bar dataKey="value" fill="#8884d8" name="Count" />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>
//               </div>

//               {/* Department Headcount */}
//               <div className="bg-white p-6 rounded-lg shadow">
//                 <h2 className="text-xl font-semibold mb-4">Department Headcount</h2>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full bg-white">
//                     <thead>
//                       <tr>
//                         <th className="py-2 px-4 border-b text-left">Department</th>
//                         <th className="py-2 px-4 border-b text-center">Active</th>
//                         <th className="py-2 px-4 border-b text-center">On Leave</th>
//                         <th className="py-2 px-4 border-b text-center">With Permissions</th>
//                         <th className="py-2 px-4 border-b text-center">Total</th>
//                         <th className="py-2 px-4 border-b text-center">% of Total</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {employeeStats.byDepartment.map((dept, index) => (
//                         <tr key={index}>
//                           <td className="py-2 px-4 border-b">{dept.name}</td>
//                           <td className="py-2 px-4 border-b text-center">{dept.active}</td>
//                           <td className="py-2 px-4 border-b text-center">{dept.onLeave}</td>
//                           <td className="py-2 px-4 border-b text-center">{dept.withPermissions}</td>
//                           <td className="py-2 px-4 border-b text-center">{dept.active + dept.onLeave + dept.withPermissions}</td>
//                           <td className="py-2 px-4 border-b text-center">
//                             {((dept.active + dept.onLeave + dept.withPermissions) / employeeStats.total * 100).toFixed(1)}%
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Employees Tab */}
//           {activeTab === 'employees' && (
//             <div className="bg-white p-6 rounded-lg shadow">
//               <EmployeeTable 
//                 employeeStats={employeeStats} 
//                 onSelectEmployees={setSelectedEmployees} 
//               />
//             </div>
//           )}

//           {/* User Management Tab */}
//           {activeTab === 'management' && (
//             <div className="bg-white p-6 rounded-lg shadow">
//               <UserManagement selectedEmployees={selectedEmployees} />
//             </div>
//           )}

//           {/* Reports Tab */}
//           {activeTab === 'reports' && (
//             <div className="bg-white p-6 rounded-lg shadow">
//               <ReportsSection />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
// // ***********************************



// 'use client';
// import React, { useContext } from 'react';
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import Header from '../../components/header';
// import Sidebar from '../../components/sidebar';
// import { useSharedStyles } from '../../sharedStyles';
// import { usePathname } from 'next/navigation';
// import { MenuContext } from '../../lib/MenuContext';
// import { useSidebar } from '../../lib/SidebarContext';

// const employeeData = [
//   { name: 'Full-time', value: 75 },
//   { name: 'Part-time', value: 15 },
//   { name: 'Contract', value: 10 },
// ];

// const departmentData = [
//   { department: 'Engineering', headcount: 35 },
//   { department: 'Marketing', headcount: 15 },
//   { department: 'Sales', headcount: 20 },
//   { department: 'HR', headcount: 5 },
//   { department: 'Operations', headcount: 15 },
// ];

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

// export default function AdministrationPage() {
//   const styles = useSharedStyles();
//   const pathname = usePathname();
//   const { menuItems } = useContext(MenuContext);
//   const { isSidebarVisible } = useSidebar();
//   const currentMenuItem = menuItems.find(item => item.link === pathname);
//   const pageTitle = currentMenuItem?.menu_item || 'HR Administration';

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

//           {/* Employee Composition */}
//           <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//             <h2 className="text-xl font-semibold mb-4">Employee Composition</h2>
//             <div className="flex flex-col md:flex-row gap-6">
//               <div className="h-64 w-full md:w-1/2">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={employeeData}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       outerRadius={80}
//                       fill="#8884d8"
//                       dataKey="value"
//                       label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                     >
//                       {employeeData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//               <div className="w-full md:w-1/2">
//                 <h3 className="font-medium mb-2">Key Metrics</h3>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="border rounded-lg p-4">
//                     <div className="text-sm text-gray-600">Total Employees</div>
//                     <div className="text-2xl font-bold mt-1">100</div>
//                   </div>
//                   <div className="border rounded-lg p-4">
//                     <div className="text-sm text-gray-600">Avg Tenure</div>
//                     <div className="text-2xl font-bold mt-1">2.5 yrs</div>
//                   </div>
//                   <div className="border rounded-lg p-4">
//                     <div className="text-sm text-gray-600">Open Positions</div>
//                     <div className="text-2xl font-bold mt-1">12</div>
//                   </div>
//                   <div className="border rounded-lg p-4">
//                     <div className="text-sm text-gray-600">Turnover Rate</div>
//                     <div className="text-2xl font-bold mt-1">8%</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Department Headcount */}
//           <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//             <h2 className="text-xl font-semibold mb-4">Department Headcount</h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white">
//                 <thead>
//                   <tr>
//                     <th className="py-2 px-4 border-b">Department</th>
//                     <th className="py-2 px-4 border-b">Headcount</th>
//                     <th className="py-2 px-4 border-b">% of Total</th>
//                     <th className="py-2 px-4 border-b">Budget vs Actual</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {departmentData.map((dept, index) => (
//                     <tr key={index}>
//                       <td className="py-2 px-4 border-b">{dept.department}</td>
//                       <td className="py-2 px-4 border-b">{dept.headcount}</td>
//                       <td className="py-2 px-4 border-b">{(dept.headcount / 100 * 100).toFixed(1)}%</td>
//                       <td className="py-2 px-4 border-b">
//                         <div className="w-full bg-gray-200 rounded-full h-2.5">
//                           <div 
//                             className={`h-2.5 rounded-full ${
//                               dept.headcount > 30 ? 'bg-green-600' : 
//                               dept.headcount > 15 ? 'bg-blue-600' : 'bg-yellow-600'
//                             }`} 
//                             style={{ width: `${Math.min(dept.headcount * 3, 100)}%` }}
//                           ></div>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Recent Activity */}
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-semibold mb-4">Recent HR Activity</h2>
//             <div className="space-y-4">
//               {[
//                 'Updated employee handbook policy',
//                 'Processed 5 new hires',
//                 'Conducted quarterly benefits review',
//                 'Completed payroll for June',
//                 'Scheduled team building event'
//               ].map((activity, index) => (
//                 <div key={index} className="flex items-start">
//                   <div className="bg-blue-100 p-2 rounded-full mr-3">
//                     <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//                     </svg>
//                   </div>
//                   <div>
//                     <p className="text-gray-800">{activity}</p>
//                     <p className="text-sm text-gray-500">{index + 1} day ago</p>
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
// // **********************************



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