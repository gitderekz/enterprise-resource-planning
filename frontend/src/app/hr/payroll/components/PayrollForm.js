'use client';
import React, { useState, useEffect, useContext } from 'react';
import { useSharedStyles } from '../../../sharedStyles';
import { useSelector } from 'react-redux';

const PayrollForm = ({ users, deductions, onClose, onSubmit }) => {
  const styles = useSharedStyles();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    selectionType: 'single', // 'single', 'multiple', 'all'
    selectedEmployee: '',
    selectedEmployees: [],
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    period: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
    bonuses: 0,
    allowances: 0,
    overtime: 0,
    status: 'pending' // Added status field
  });

  // Check if user can select any month
  const canSelectAnyMonth = [1, 2, 3, 4].includes(currentUser?.role_id);

  // Generate period string (YYYY-MM)
  const period = canSelectAnyMonth?`${formData.year}-${String(formData.month).padStart(2, '0')}`:formData.period;

  const [employeeDeductions, setEmployeeDeductions] = useState([]);
  const [employeeSummaries, setEmployeeSummaries] = useState([]);

  useEffect(() => {
    if (formData.selectionType === 'single' && formData.selectedEmployee) {
      const employee = users.find(e => e.id === parseInt(formData.selectedEmployee));
      if (employee) {
        const empDeductions = deductions.filter(d => d.userId === parseInt(formData.selectedEmployee) && d.isActive);
        setEmployeeDeductions(empDeductions);
        
        // Calculate for single employee
        calculateEmployeeSummary(employee, empDeductions);
      }
    } else if (formData.selectionType === 'multiple' && formData.selectedEmployees.length > 0) {
      // Calculate for multiple selected employees
      const summaries = formData.selectedEmployees.map(empId => {
        const employee = users.find(e => e.id === empId);
        const empDeductions = deductions.filter(d => d.userId === empId && d.isActive);
        return calculateEmployeeSummary(employee, empDeductions, false);
      });
      setEmployeeSummaries(summaries);
    } else if (formData.selectionType === 'all') {
      // Calculate for all employees
      const summaries = users.map(employee => {
        const empDeductions = deductions.filter(d => d.userId === employee.id && d.isActive);
        return calculateEmployeeSummary(employee, empDeductions, false);
      });
      setEmployeeSummaries(summaries);
    }
  }, [formData, users, deductions]);

  const calculateEmployeeSummary = (employee, empDeductions, updateState = true) => {
    const baseSalary = Number(employee.baseSalary) || 0;
    const bonuses = parseFloat(formData.bonuses) || 0;
    const allowances = parseFloat(formData.allowances) || 0;
    const overtime = parseFloat(formData.overtime) || 0;
    
    const grossSalary = baseSalary + bonuses + allowances + overtime;
    
    let totalDeductions = 0;
    const deductionDetails = empDeductions.map(d => {
      const amount = d.isPercentage ? (grossSalary * (Number(d.amount) / 100)) : Number(d.amount);
      totalDeductions += amount;
      console.log("Amount",amount);
      console.log("totalDeductions",totalDeductions);
      
      return {
        id: d.id,
        type: d.type,
        amount,
        description: d.description,
        isPercentage: d.isPercentage
      };
    });
    
    const netSalary = grossSalary - totalDeductions;
    
    const summary = {
      employeeId: employee.id,
      employeeName: employee.username,
      position: employee.position,
      baseSalary,
      bonuses,
      allowances,
      overtime,
      grossSalary,
      deductions: totalDeductions,
      deductionDetails,
      netSalary
    };
    
    if (updateState) {
      setEmployeeSummaries([summary]);
    }
    
    return summary;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEmployeeSelect = (e) => {
    const { value, checked } = e.target;
    const empId = parseInt(value);
    
    setFormData(prev => {
      let newSelected = [...prev.selectedEmployees];
      if (checked) {
        newSelected.push(empId);
      } else {
        newSelected = newSelected.filter(id => id !== empId);
      }
      return { ...prev, selectedEmployees: newSelected };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const payrollData = {
      // period: formData.period,
      period,
      status: formData.status, // Include status in submission
      employeeData: employeeSummaries.map(summary => ({
        userId: summary.employeeId,
        grossSalary: summary.grossSalary,
        deductions: summary.deductions,
        netSalary: summary.netSalary,
        details: {
          baseSalary: summary.baseSalary,
          bonuses: summary.bonuses,
          allowances: summary.allowances,
          overtime: summary.overtime,
          deductionDetails: summary.deductionDetails
        }
      }))
    };
    
    onSubmit(payrollData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Run Payroll</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Selection Type</label>
              <select
                name="selectionType"
                value={formData.selectionType}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="single">Single Employee</option>
                <option value="multiple">Multiple Employees</option>
                <option value="all">All Employees</option>
              </select>
            </div>
            
            
            {!canSelectAnyMonth?(
              <div>
              <label className="block text-sm font-medium mb-1">Payroll Period (YYYY-MM)</label>
              <input
                type="text"
                name="period"
                value={formData.period}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                pattern="\d{4}-\d{2}"
                required
              />
            </div>
            ):(
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
              {/* <div>
                <label className="block text-sm font-medium mb-1">Month</label>
                <select
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Month</option>
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = new Date(0, i).toLocaleString('default', { month: 'long' });
                    return <option key={i} value={i + 1}>{month}</option>;
                  })}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div> */}
              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - 2 + i;
                    return <option key={i} value={year}>{year}</option>;
                  })}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Month</label>
                <select
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                  disabled={!canSelectAnyMonth && formData.year === new Date().getFullYear() && formData.month === new Date().getMonth() + 1}
                >
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = new Date(0, i).toLocaleString('default', { month: 'long' });
                    return <option key={i} value={i + 1}>{month}</option>;
                  })}
                </select>
                {!canSelectAnyMonth && (
                  <p className="text-xs text-gray-500 mt-1">Only current month allowed for your role</p>
                )}
              </div>
            </div>
            )}
          </div>
          
          {formData.selectionType === 'single' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Employee</label>
                <select
                  name="selectedEmployee"
                  value={formData.selectedEmployee}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Employee</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.username} - {user.position??user?.role?.name} ({`${process.env.NEXT_PUBLIC_CURRENCY}`}{user.baseSalary})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>
          )}
          
          {formData.selectionType === 'multiple' && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Select Employees</label>
              <div className="max-h-48 overflow-y-auto border rounded p-2">
                {users.map(user => (
                  <div key={user.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`emp-${user.id}`}
                      value={user.id}
                      checked={formData.selectedEmployees.includes(user.id)}
                      onChange={handleEmployeeSelect}
                      className="mr-2"
                    />
                    <label htmlFor={`emp-${user.id}`}>
                      {user.username} - {user.position??user?.role?.name} ({`${process.env.NEXT_PUBLIC_CURRENCY}`}{user.baseSalary})
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Bonuses ({`${process.env.NEXT_PUBLIC_CURRENCY}`})</label>
              <input
                type="number"
                name="bonuses"
                value={formData.bonuses}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Allowances ({`${process.env.NEXT_PUBLIC_CURRENCY}`})</label>
              <input
                type="number"
                name="allowances"
                value={formData.allowances}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Overtime ({`${process.env.NEXT_PUBLIC_CURRENCY}`})</label>
              <input
                type="number"
                name="overtime"
                value={formData.overtime}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          {/* Employee Summaries */}
          <div className="mb-4">
            <h3 className="font-medium mb-2">Payroll Summary</h3>
            <div className="border rounded">
              {employeeSummaries.length > 0 ? (
                employeeSummaries.map((summary, index) => (
                  <div key={index} className="p-3 border-b last:border-b-0">
                    <div className="font-medium mb-1">
                      {summary.employeeName} - {summary.position}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div>Base Salary: ${Number(summary.baseSalary || 0).toFixed(2)}</div>
                      <div>Bonuses: ${Number(summary.bonuses || 0).toFixed(2)}</div>
                      <div>Allowances: ${Number(summary.allowances || 0).toFixed(2)}</div>
                      <div>Overtime: ${Number(summary.overtime || 0).toFixed(2)}</div>
                      <div>Gross: ${Number(summary.grossSalary || 0).toFixed(2)}</div>
                      <div>Deductions: ${Number(summary.deductions || 0).toFixed(2)}</div>
                      <div className="md:col-span-3 font-bold">
                        Net Salary: ${Number(summary.netSalary || 0).toFixed(2)}
                      </div>
                    </div>
                    
                    {summary.deductionDetails.length > 0 && (
                      <div className="mt-2 text-sm">
                        <div className="font-medium">Deductions:</div>
                        {summary.deductionDetails.map((d, i) => (
                          <div key={i} className="ml-2">
                            - {d.description}: ${Number(d.amount || 0).toFixed(2)} {d.isPercentage ? `(${process.env.NEXT_PUBLIC_CURRENCY}{d.amount/summary.grossSalary*100}%)` : ''}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-3 text-gray-500">No employees selected</div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              disabled={employeeSummaries.length === 0}
            >
              Process Payroll
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PayrollForm;
// ******************************



// 'use client';
// import React, { useState, useEffect } from 'react';

// const PayrollForm = ({ employees, deductions, onClose, onSubmit }) => {
//   const [formData, setFormData] = useState({
//     employeeId: '',
//     month: '',
//     year: new Date().getFullYear(),
//     bonuses: 0,
//     allowances: 0,
//     overtime: 0,
//   });

//   const [employeeDeductions, setEmployeeDeductions] = useState([]);
//   const [grossSalary, setGrossSalary] = useState(0);
//   const [totalDeductions, setTotalDeductions] = useState(0);
//   const [netSalary, setNetSalary] = useState(0);

//   useEffect(() => {
//     if (formData.employeeId) {
//       const employee = employees.find(e => e.id === parseInt(formData.employeeId));
//       if (employee) {
//         const empDeductions = deductions.filter(d => d.employeeId === parseInt(formData.employeeId));
//         setEmployeeDeductions(empDeductions);
        
//         // Calculate salary components
//         const baseSalary = employee.baseSalary || 0;
//         const calculatedGross = baseSalary + (formData.bonuses || 0) + (formData.allowances || 0) + (formData.overtime || 0);
//         setGrossSalary(calculatedGross);
        
//         // Calculate deductions
//         let calculatedDeductions = 0;
//         empDeductions.forEach(d => {
//           if (d.isPercentage) {
//             calculatedDeductions += (calculatedGross * d.amount / 100);
//           } else {
//             calculatedDeductions += d.amount;
//           }
//         });
//         setTotalDeductions(calculatedDeductions);
//         setNetSalary(calculatedGross - calculatedDeductions);
//       }
//     }
//   }, [formData, employees, deductions]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit({
//       ...formData,
//       grossSalary,
//       deductions: totalDeductions,
//       netSalary,
//       status: 'pending'
//     });
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Run Payroll</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             &times;
//           </button>
//         </div>
        
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Employee</label>
//               <select
//                 name="employeeId"
//                 value={formData.employeeId}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//                 required
//               >
//                 <option value="">Select Employee</option>
//                 {employees.map(employee => (
//                   <option key={employee.id} value={employee.id}>
//                     {employee.username} - {employee.position??employee.role?.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium mb-1">Month</label>
//               <select
//                 name="month"
//                 value={formData.month}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//                 required
//               >
//                 <option value="">Select Month</option>
//                 {Array.from({ length: 12 }, (_, i) => {
//                   const month = new Date(0, i).toLocaleString('default', { month: 'long' });
//                   return <option key={i} value={i + 1}>{month}</option>;
//                 })}
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium mb-1">Year</label>
//               <input
//                 type="number"
//                 name="year"
//                 value={formData.year}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Bonuses ({`${process.env.NEXT_PUBLIC_CURRENCY}`})</label>
//               <input
//                 type="number"
//                 name="bonuses"
//                 value={formData.bonuses}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//                 min="0"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium mb-1">Allowances ({`${process.env.NEXT_PUBLIC_CURRENCY}`})</label>
//               <input
//                 type="number"
//                 name="allowances"
//                 value={formData.allowances}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//                 min="0"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium mb-1">Overtime ({`${process.env.NEXT_PUBLIC_CURRENCY}`})</label>
//               <input
//                 type="number"
//                 name="overtime"
//                 value={formData.overtime}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//                 min="0"
//               />
//             </div>
//           </div>
          
//           {/* Deductions Preview */}
//           {employeeDeductions.length > 0 && (
//             <div className="mb-4">
//               <h3 className="font-medium mb-2">Applicable Deductions</h3>
//               <div className="border rounded p-2">
//                 {employeeDeductions.map((d, i) => (
//                   <div key={i} className="flex justify-between py-1">
//                     <span>{d.description} ({d.type})</span>
//                     <span>{d.isPercentage ? `${d.amount}%` : `${process.env.NEXT_PUBLIC_CURRENCY}${d.amount}`}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
          
//           {/* Salary Summary */}
//           <div className="border-t pt-4 mb-4">
//             <div className="flex justify-between mb-2">
//               <span className="font-medium">Gross Salary:</span>
//               <span>{`${process.env.NEXT_PUBLIC_CURRENCY}`}{grossSalary.toLocaleString()}</span>
//             </div>
//             <div className="flex justify-between mb-2">
//               <span className="font-medium">Total Deductions:</span>
//               <span>{`${process.env.NEXT_PUBLIC_CURRENCY}`}{totalDeductions.toLocaleString()}</span>
//             </div>
//             <div className="flex justify-between font-bold text-lg">
//               <span>Net Salary:</span>
//               <span>{`${process.env.NEXT_PUBLIC_CURRENCY}`}{netSalary.toLocaleString()}</span>
//             </div>
//           </div>
          
//           <div className="flex justify-end gap-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 border rounded hover:bg-gray-100"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
//             >
//               Process Payroll
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PayrollForm;