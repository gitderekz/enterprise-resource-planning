'use client';
import React, { useState, useEffect, useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useSharedStyles } from '../../sharedStyles';
import { usePathname } from 'next/navigation';
import { MenuContext } from '../../lib/MenuContext';
import { useSidebar } from '../../lib/SidebarContext';
import PayrollTable from './components/PayrollTable';
import PayrollForm from './components/PayrollForm';
import DeductionForm from './components/DeductionForm';
import PayrollReport from './components/PayrollReport';
import { getPayrollRecords, getPayrollSummary, runPayroll } from './services/payrollService';
import { getEmployeeDeductions, addDeduction, updateDeduction, deleteDeduction } from './services/deductionService';

const PayrollPage = () => {
  const styles = useSharedStyles();
  const pathname = usePathname();
  const { menuItems } = useContext(MenuContext);
  const { isSidebarVisible } = useSidebar();
  const currentMenuItem = menuItems.find(item => item.link === pathname);
  const pageTitle = currentMenuItem?.menu_item || 'Payroll';
  const { user: currentUser } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeductionForm, setShowDeductionForm] = useState(false);
  const [showPayrollForm, setShowPayrollForm] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [users, setUsers] = useState([]);
  const [payrollData, setPayrollData] = useState([]);
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [deductions, setDeductions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = async () => {
    try {
      setIsLoading(true);
      const recordsResponse = await getPayrollRecords();
      setPayrollRecords(recordsResponse);

      const summaryResponse = await getPayrollSummary();
      setPayrollData(summaryResponse);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all necessary data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch users with baseSalary (employees)
        const usersResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          params: { hasSalary: true }
        });
        setUsers(usersResponse.data);

        // Fetch payroll records
        const recordsResponse = await getPayrollRecords();
        setPayrollRecords(recordsResponse);

        // Fetch payroll summary for chart
        const summaryResponse = await getPayrollSummary(/*'annualy'*/);
        console.log('summaryResponse',summaryResponse);
        
        setPayrollData(summaryResponse);

        // Fetch deductions
        const deductionsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr/payroll/deductions`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setDeductions(deductionsResponse.data);
      } catch (error) {
        console.error('Error fetching payroll data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddDeduction = async (deduction) => {
    try {
      const newDeduction = await addDeduction(deduction);
      setDeductions([...deductions, newDeduction]);
      setShowDeductionForm(false);
    } catch (error) {
      console.error('Error adding deduction:', error);
    }
  };

  const handleUpdateDeduction = async (deductionId, deductionData) => {
    try {
      const updatedDeduction = await updateDeduction(deductionId, deductionData);
      setDeductions(deductions.map(d => d.id === deductionId ? updatedDeduction : d));
      setShowDeductionForm(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating deduction:', error);
    }
  };

  const handleDeleteDeduction = async (deductionId) => {
    try {
      await deleteDeduction(deductionId);
      setDeductions(deductions.filter(d => d.id !== deductionId));
    } catch (error) {
      console.error('Error deleting deduction:', error);
    }
  };

  const handleRunPayroll = async (payrollData) => {
    try {
      const newPayroll = await runPayroll(payrollData);
      setPayrollRecords([...payrollRecords, newPayroll]);
      setShowPayrollForm(false);
      
      // Refresh summary data
      const summaryResponse = await getPayrollSummary();
      setPayrollData(summaryResponse);
    } catch (error) {
      console.error('Error running payroll:', error);
    }
  };

  if (isLoading) {
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
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
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
          <div className="flex border-b mb-6">
            <button
              className={`py-2 px-4 ${activeTab === 'dashboard' ? 'border-b-2 border-purple-600' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'payroll' ? 'border-b-2 border-purple-600' : ''}`}
              onClick={() => setActiveTab('payroll')}
            >
              Payroll Records
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'deductions' ? 'border-b-2 border-purple-600' : ''}`}
              onClick={() => setActiveTab('deductions')}
            >
              Deductions
            </button>
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <>
              <div className="flex justify-between mb-6">
                <button 
                  className="bg-purple-600 text-white px-4 py-2 rounded"
                  onClick={() => setShowPayrollForm(true)}
                >
                  Run Payroll
                </button>
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={() => setShowReport(true)}
                >
                  Generate Report
                </button>
              </div>

              {/* Payroll Trends */}
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4">Payroll Trends</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={payrollData}>
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="totalGross" stroke="#8884d8" name="Gross Payroll" />
                      <Line type="monotone" dataKey="totalDeductions" stroke="#ffc658" name="Deductions" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Payroll Summary */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Payroll Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium">Total Monthly Payroll</h3>
                    <p className="text-2xl mt-2">
                      {`${process.env.NEXT_PUBLIC_CURRENCY}`} {payrollData.reduce(
                        (sum, item) => sum + (isNaN(Number(item.totalGross)) ? 0 : Number(item.totalGross)),
                        0
                      ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium">Total Deductions</h3>
                    <p className="text-2xl mt-2">
                      {`${process.env.NEXT_PUBLIC_CURRENCY}`} {payrollData.reduce(
                        (sum, item) => sum + (isNaN(Number(item.totalDeductions)) ? 0 : Number(item.totalDeductions)),
                        0
                      ).toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium">Net Payroll</h3>
                    <p className="text-2xl mt-2">
                      {`${process.env.NEXT_PUBLIC_CURRENCY}`} {payrollData.reduce(
                        (sum, item) => sum + (isNaN(Number(item.totalNet)) ? 0 : Number(item.totalNet)),
                        0
                      ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium">Average Salary</h3>
                    <p className="text-2xl mt-2">
                      {`${process.env.NEXT_PUBLIC_CURRENCY}`} {users.length > 0
                        ? (
                            users.reduce(
                              (sum, user) =>
                                sum + (isNaN(Number(user.baseSalary)) ? 0 : Number(user.baseSalary)),
                              0
                            ) / users.length
                          ).toLocaleString(undefined, { maximumFractionDigits: 2 })
                        : '0'}
                    </p>
                  </div>

                </div>
              </div>
            </>
          )}

          {/* Payroll Records Tab */}
          {activeTab === 'payroll' && (
            <PayrollTable 
              records={payrollRecords} 
              users={users}
              onRunPayroll={() => setShowPayrollForm(true)}
              refreshData={refreshData}
            />
          )}

          {/* Deductions Tab */}
          {activeTab === 'deductions' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Employee Deductions</h2>
                <button 
                  className="bg-purple-600 text-white px-4 py-2 rounded"
                  onClick={() => setShowDeductionForm(true)}
                >
                  Add Deduction
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Employee</th>
                      <th className="py-2 px-4 border-b">Type</th>
                      <th className="py-2 px-4 border-b">Amount</th>
                      <th className="py-2 px-4 border-b">Description</th>
                      <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deductions.map((deduction) => {
                      const user = users.find(u => u.id === deduction.userId);
                      return (
                        <tr key={deduction.id}>
                          <td className="py-2 px-4 border-b">{user?.username || 'Unknown'}</td>
                          <td className="py-2 px-4 border-b capitalize">{deduction.type}</td>
                          <td className="py-2 px-4 border-b">
                            {deduction.isPercentage ? `${deduction.amount}%` : `${process.env.NEXT_PUBLIC_CURRENCY}${deduction.amount}`}
                          </td>
                          <td className="py-2 px-4 border-b">{deduction.description}</td>
                          <td className="py-2 px-4 border-b">
                            <button 
                              className="text-blue-600 hover:text-blue-800 mr-2"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowDeductionForm(deduction);
                              }}
                            >
                              Edit
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleDeleteDeduction(deduction.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showDeductionForm && (
        <DeductionForm 
          // users={users}
          employees={users}
          // selectedUser={selectedUser}
          selectedEmployee={selectedUser}
          deduction={typeof showDeductionForm === 'object' ? showDeductionForm : null}
          onClose={() => {
            setShowDeductionForm(false);
            setSelectedUser(null);
          }}
          onSubmit={typeof showDeductionForm === 'object' ? 
            (data) => handleUpdateDeduction(showDeductionForm.id, data) : 
            handleAddDeduction}
        />
      )}

      {showPayrollForm && (
        <PayrollForm 
          users={users}
          deductions={deductions}
          onClose={() => setShowPayrollForm(false)}
          onSubmit={handleRunPayroll}
        />
      )}

      {showReport && (
        <PayrollReport 
          payrollData={payrollData}
          payrollRecords={payrollRecords}
          users={users}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
};

export default PayrollPage;
// ***************************



// 'use client';
// import React, { useContext } from 'react';
// import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import Header from '../../components/header';
// import Sidebar from '../../components/sidebar';
// import { useSharedStyles } from '../../sharedStyles';
// import { usePathname } from 'next/navigation';
// import { MenuContext } from '../../lib/MenuContext';
// import { useSidebar } from '../../lib/SidebarContext';

// const payrollData = [
//   { name: 'Jan', amount: 125000, tax: 25000 },
//   { name: 'Feb', amount: 132000, tax: 26400 },
//   { name: 'Mar', amount: 141000, tax: 28200 },
//   { name: 'Apr', amount: 128000, tax: 25600 },
//   { name: 'May', amount: 135000, tax: 27000 },
// ];

// const upcomingPayments = [
//   { name: 'John Doe', position: 'Developer', amount: 4500, date: '2023-06-30' },
//   { name: 'Jane Smith', position: 'Designer', amount: 3800, date: '2023-06-30' },
//   { name: 'Robert Johnson', position: 'Manager', amount: 5200, date: '2023-06-30' },
// ];

// export default function PayrollPage() {
//   const styles = useSharedStyles();
//   const pathname = usePathname();
//   const { menuItems } = useContext(MenuContext);
//   const { isSidebarVisible } = useSidebar();
//   const currentMenuItem = menuItems.find(item => item.link === pathname);
//   const pageTitle = currentMenuItem?.menu_item || 'Payroll';

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

//           {/* Payroll Trends */}
//           <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//             <h2 className="text-xl font-semibold mb-4">Payroll Trends</h2>
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={payrollData}>
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Line type="monotone" dataKey="amount" stroke="#8884d8" name="Gross Payroll" />
//                   <Line type="monotone" dataKey="tax" stroke="#82ca9d" name="Tax Deductions" />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Upcoming Payments */}
//           <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//             <h2 className="text-xl font-semibold mb-4">Upcoming Payments</h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white">
//                 <thead>
//                   <tr>
//                     <th className="py-2 px-4 border-b">Employee</th>
//                     <th className="py-2 px-4 border-b">Position</th>
//                     <th className="py-2 px-4 border-b">Amount</th>
//                     <th className="py-2 px-4 border-b">Payment Date</th>
//                     <th className="py-2 px-4 border-b">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {upcomingPayments.map((payment, index) => (
//                     <tr key={index}>
//                       <td className="py-2 px-4 border-b">{payment.name}</td>
//                       <td className="py-2 px-4 border-b">{payment.position}</td>
//                       <td className="py-2 px-4 border-b">{`${process.env.NEXT_PUBLIC_CURRENCY}`}{payment.amount}</td>
//                       <td className="py-2 px-4 border-b">{payment.date}</td>
//                       <td className="py-2 px-4 border-b">
//                         <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Pending</span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Payroll Summary */}
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-semibold mb-4">Payroll Summary</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="border rounded-lg p-4">
//                 <h3 className="font-medium">Total Monthly Payroll</h3>
//                 <p className="text-2xl mt-2">{`${process.env.NEXT_PUBLIC_CURRENCY}`}135,000</p>
//               </div>
//               <div className="border rounded-lg p-4">
//                 <h3 className="font-medium">Average Salary</h3>
//                 <p className="text-2xl mt-2">{`${process.env.NEXT_PUBLIC_CURRENCY}`}4,500</p>
//               </div>
//               <div className="border rounded-lg p-4">
//                 <h3 className="font-medium">Tax Deductions</h3>
//                 <p className="text-2xl mt-2">{`${process.env.NEXT_PUBLIC_CURRENCY}`}27,000</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// // ***************************************


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