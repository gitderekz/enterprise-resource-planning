'use client';
import React, { useState } from 'react';
import { useSharedStyles } from '../../../sharedStyles';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PayslipPDF from './PayslipPDF';
import axios from 'axios';
import { toast } from 'react-toastify';

const PayrollTable = ({ records, users, onRunPayroll, refreshData }) => {
  const styles = useSharedStyles();
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);

  const handleStatusChange = async (recordId, newStatus) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/hr/payroll/${recordId}/status`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      toast.success('Status updated successfully');
      refreshData(); // Refresh the data after update
    } catch (error) {
      toast.error('Failed to update status');
      console.error('Error updating status:', error);
    } finally {
      setEditingStatus(null);
    }
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setShowDetails(true);
  };

  const getEmployeeName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.username : 'Unknown';
  };

  const getEmployeePosition = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.position??user.role?.name : 'N/A';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Payroll Records</h2>
        <button 
          className="bg-purple-600 text-white px-4 py-2 rounded"
          onClick={onRunPayroll}
        >
          Run Payroll
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Period</th>
              <th className="py-2 px-4 border-b">Employee</th>
              <th className="py-2 px-4 border-b">Position</th>
              <th className="py-2 px-4 border-b">Gross Salary</th>
              <th className="py-2 px-4 border-b">Deductions</th>
              <th className="py-2 px-4 border-b">Net Salary</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td className="py-2 px-4 border-b">{record.period}</td>
                <td className="py-2 px-4 border-b">{getEmployeeName(record.userId)}</td>
                <td className="py-2 px-4 border-b">{getEmployeePosition(record.userId)}</td>
                <td className="py-2 px-4 border-b">{`${process.env.NEXT_PUBLIC_CURRENCY}`}{Number(record.grossSalary || 0).toLocaleString()}</td>
                <td className="py-2 px-4 border-b">{`${process.env.NEXT_PUBLIC_CURRENCY}`}{Number(record.deductions || 0).toLocaleString()}</td>
                <td className="py-2 px-4 border-b">{`${process.env.NEXT_PUBLIC_CURRENCY}`}{Number(record.netSalary || 0).toLocaleString()}</td>
                <td className="py-2 px-4 border-b">
                {editingStatus === record.id ? (
                  <select
                    value={record.status}
                    onChange={(e) => handleStatusChange(record.id, e.target.value)}
                    className="p-1 border rounded"
                    onBlur={() => setEditingStatus(null)}
                    autoFocus
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                ) : (
                  <span 
                    className={`px-2 py-1 rounded text-xs cursor-pointer ${
                      record.status === 'paid' ? 'bg-green-100 text-green-800' :
                      record.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}
                    onClick={() => setEditingStatus(record.id)}
                  >
                    {record.status}
                  </span>
                )}
              </td>
                <td className="py-2 px-4 border-b">
                  <button 
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    onClick={() => handleViewDetails(record)}
                  >
                    View
                  </button>
                  <PDFDownloadLink 
                    document={<PayslipPDF record={record} user={users.find(u => u.id === record.userId)} />}
                    fileName={`payslip_${record.userId}_${record.period}.pdf`}
                  >
                    {({ loading }) => (
                      <button 
                        className={`text-purple-600 hover:text-purple-800 ${loading ? 'opacity-50' : ''}`}
                        disabled={loading}
                      >
                        {loading ? 'Generating...' : 'Payslip'}
                      </button>
                    )}
                  </PDFDownloadLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Record Details Modal */}
      {showDetails && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Payroll Details - {getEmployeeName(selectedRecord.userId)} ({selectedRecord.period})
              </h2>
              <button onClick={() => setShowDetails(false)} className="text-gray-500 hover:text-gray-700">
                &times;
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-medium mb-2">Salary Information</h3>
                <div className="space-y-1">
                  <div>Gross Salary: {`${process.env.NEXT_PUBLIC_CURRENCY}`}{Number(selectedRecord.grossSalary || 0).toFixed(2)}</div>
                  <div>Total Deductions: {`${process.env.NEXT_PUBLIC_CURRENCY}`}{Number(selectedRecord.deductions || 0).toFixed(2)}</div>
                  <div className="font-bold">Net Salary: {`${process.env.NEXT_PUBLIC_CURRENCY}`}{Number(selectedRecord.netSalary || 0).toFixed(2)}</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Status</h3>
                <div className={`inline-block px-3 py-1 rounded ${
                  selectedRecord.status === 'paid' ? 'bg-green-100 text-green-800' :
                  selectedRecord.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedRecord.status}
                </div>
              </div>
            </div>
            
            {selectedRecord.details && (
              <>
                <h3 className="font-medium mb-2">Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium mb-1">Earnings</h4>
                    <div className="space-y-1">
                      <div>Base Salary: {`${process.env.NEXT_PUBLIC_CURRENCY}`}{selectedRecord.details.baseSalary?.toFixed(2) || '0.00'}</div>
                      {selectedRecord.details.bonuses > 0 && (
                        <div>Bonuses: {`${process.env.NEXT_PUBLIC_CURRENCY}`}{selectedRecord.details.bonuses.toFixed(2)}</div>
                      )}
                      {selectedRecord.details.allowances > 0 && (
                        <div>Allowances: {`${process.env.NEXT_PUBLIC_CURRENCY}`}{selectedRecord.details.allowances.toFixed(2)}</div>
                      )}
                      {selectedRecord.details.overtime > 0 && (
                        <div>Overtime: {`${process.env.NEXT_PUBLIC_CURRENCY}`}{selectedRecord.details.overtime.toFixed(2)}</div>
                      )}
                    </div>
                  </div>
                  
                  {selectedRecord.details.deductionDetails?.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-1">Deductions</h4>
                      <div className="space-y-1">
                        {selectedRecord.details.deductionDetails.map((d, i) => (
                          <div key={i}>
                            {d.description}: {`${process.env.NEXT_PUBLIC_CURRENCY}`}{d.amount.toFixed(2)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollTable;



// 'use client';
// import React from 'react';

// const PayrollTable = ({ records, employees, onRunPayroll }) => {
//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">Payroll Records</h2>
//         <button 
//           className="bg-purple-600 text-white px-4 py-2 rounded"
//           onClick={onRunPayroll}
//         >
//           Run Payroll
//         </button>
//       </div>
      
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white">
//           <thead>
//             <tr>
//               <th className="py-2 px-4 border-b">Month</th>
//               <th className="py-2 px-4 border-b">Employee</th>
//               <th className="py-2 px-4 border-b">Gross Salary</th>
//               <th className="py-2 px-4 border-b">Deductions</th>
//               <th className="py-2 px-4 border-b">Net Salary</th>
//               <th className="py-2 px-4 border-b">Status</th>
//               <th className="py-2 px-4 border-b">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {records.map((record) => {
//               // const employee = employees.find(e => e.id === record.userId);
//               return (
//                 <tr key={record.id}>
//                   <td className="py-2 px-4 border-b">{record.period}</td>
//                   <td className="py-2 px-4 border-b">{/*{employee?.username || 'Unknown'}*/}{record.employee.username || 'Unknown'}</td>
//                   <td className="py-2 px-4 border-b">{`${process.env.NEXT_PUBLIC_CURRENCY}`}{record.grossSalary.toLocaleString()}</td>
//                   <td className="py-2 px-4 border-b">{`${process.env.NEXT_PUBLIC_CURRENCY}`}{record.deductions.toLocaleString()}</td>
//                   <td className="py-2 px-4 border-b">{`${process.env.NEXT_PUBLIC_CURRENCY}`}{record.netSalary.toLocaleString()}</td>
//                   <td className="py-2 px-4 border-b">
//                     <span className={`px-2 py-1 rounded text-xs ${
//                       record.status === 'paid' ? 'bg-green-100 text-green-800' :
//                       record.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                       'bg-red-100 text-red-800'
//                     }`}>
//                       {record.status}
//                     </span>
//                   </td>
//                   <td className="py-2 px-4 border-b">
//                     <button className="text-blue-600 hover:text-blue-800 mr-2">
//                       View
//                     </button>
//                     <button className="text-purple-600 hover:text-purple-800">
//                       Payslip
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default PayrollTable;