'use client';
import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaUserEdit, FaUserTimes, FaUserCheck } from 'react-icons/fa';
import { getEmployees } from '../services/employeeService';

const EmployeeTable = ({ onSelectEmployees }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    department: 'all',
    gender: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const data = await getEmployees();
        setEmployees(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(employee => {
    // Search filter
    const matchesSearch = 
      employee.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.position||employee.role)?.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = 
      filters.status === 'all' || 
      employee.status === filters.status;

    // Department filter
    const matchesDepartment = 
      filters.department === 'all' || 
      employee.department.toLowerCase() === filters.department.toLowerCase();

    // Gender filter
    const matchesGender = 
      filters.gender === 'all' || 
      employee.gender.toLowerCase() === filters.gender.toLowerCase();

    return matchesSearch && matchesStatus && matchesDepartment && matchesGender;
  });

  const handleSelectEmployee = (id, isSelected) => {
    if (isSelected) {
      onSelectEmployees(prev => [...prev, id]);
    } else {
      onSelectEmployees(prev => prev.filter(employeeId => employeeId !== id));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      onSelectEmployees(filteredEmployees.map(employee => employee.id));
    } else {
      onSelectEmployees([]);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading employees...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold">Employee List</h2>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-grow md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button onClick={() => setShowFilters(prev => !prev)} className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <FaFilter className="mr-2" />
              Filters
            </button>
            {showFilters && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1 px-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md mb-2"
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on_leave">On Leave</option>
                    <option value="suspended">Suspended</option>
                    </select>

                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md mb-2"
                    value={filters.department}
                    onChange={(e) => setFilters({...filters, department: e.target.value})}
                    >
                    <option value="all">All Departments</option>
                    {[...new Set(employees.map(e => e.department))].map((dept, index) => (
                        <option key={index} value={dept}>{dept}</option>
                    ))}
                    </select>

                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={filters.gender}
                    onChange={(e) => setFilters({...filters, gender: e.target.value})}
                    >
                    <option value="all">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    </select>
                </div>
                </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gender
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hire Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={onSelectEmployees && Array.isArray(onSelectEmployees) && onSelectEmployees.includes(employee.id)}
                      onChange={(e) => handleSelectEmployee(employee.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {employee.username.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{employee.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.position??employee.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      employee.status === 'active' ? 'bg-green-100 text-green-800' :
                      employee.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {employee.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {employee.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <FaUserEdit />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <FaUserTimes />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                  No employees found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of <span className="font-medium">{filteredEmployees.length}</span> results
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTable;
// ***************************************



// 'use client';
// import React, { useState } from 'react';
// import { FaSearch, FaFilter, FaUserEdit, FaUserTimes, FaUserCheck } from 'react-icons/fa';

// const EmployeeTable = ({ employeeStats, onSelectEmployees }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filters, setFilters] = useState({
//     status: 'all',
//     department: 'all',
//     gender: 'all'
//   });

//   // Sample employee data - replace with API call in real implementation
//   const employees = [
//     { id: 1, name: 'John Doe', email: 'john@example.com', department: 'Engineering', position: 'Software Engineer', status: 'active', gender: 'Male', hireDate: '2020-01-15' },
//     { id: 2, name: 'Jane Smith', email: 'jane@example.com', department: 'Marketing', position: 'Marketing Manager', status: 'active', gender: 'Female', hireDate: '2019-05-20' },
//     { id: 3, name: 'Mike Johnson', email: 'mike@example.com', department: 'Sales', position: 'Sales Representative', status: 'on_leave', gender: 'Male', hireDate: '2021-03-10' },
//     { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', department: 'HR', position: 'HR Specialist', status: 'active', gender: 'Female', hireDate: '2020-11-05' },
//     { id: 5, name: 'David Brown', email: 'david@example.com', department: 'Operations', position: 'Operations Manager', status: 'with_permissions', gender: 'Male', hireDate: '2018-07-15' },
//     { id: 6, name: 'Emily Davis', email: 'emily@example.com', department: 'Finance', position: 'Financial Analyst', status: 'active', gender: 'Female', hireDate: '2022-02-28' },
//   ];

//   const filteredEmployees = employees.filter(employee => {
//     // Search filter
//     const matchesSearch = 
//       employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       employee.position.toLowerCase().includes(searchTerm.toLowerCase());

//     // Status filter
//     const matchesStatus = 
//       filters.status === 'all' || 
//       (filters.status === 'active' && employee.status === 'active') ||
//       (filters.status === 'on_leave' && employee.status === 'on_leave') ||
//       (filters.status === 'with_permissions' && employee.status === 'with_permissions');

//     // Department filter
//     const matchesDepartment = 
//       filters.department === 'all' || 
//       employee.department.toLowerCase() === filters.department.toLowerCase();

//     // Gender filter
//     const matchesGender = 
//       filters.gender === 'all' || 
//       employee.gender.toLowerCase() === filters.gender.toLowerCase();

//     return matchesSearch && matchesStatus && matchesDepartment && matchesGender;
//   });

//   const handleSelectEmployee = (id, isSelected) => {
//     if (isSelected) {
//       onSelectEmployees(prev => [...prev, id]);
//     } else {
//       onSelectEmployees(prev => prev.filter(employeeId => employeeId !== id));
//     }
//   };

//   const handleSelectAll = (isSelected) => {
//     if (isSelected) {
//       onSelectEmployees(filteredEmployees.map(employee => employee.id));
//     } else {
//       onSelectEmployees([]);
//     }
//   };

//   return (
//     <div>
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
//         <h2 className="text-xl font-semibold">Employee List</h2>
        
//         <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
//           {/* Search Input */}
//           <div className="relative flex-grow md:w-64">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaSearch className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               placeholder="Search employees..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           {/* Filter Dropdown */}
//           <div className="relative">
//             <button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//               <FaFilter className="mr-2" />
//               Filters
//             </button>
//             <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
//               <div className="py-1 px-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                 <select
//                   className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md mb-2"
//                   value={filters.status}
//                   onChange={(e) => setFilters({...filters, status: e.target.value})}
//                 >
//                   <option value="all">All Statuses</option>
//                   <option value="active">Active</option>
//                   <option value="on_leave">On Leave</option>
//                   <option value="with_permissions">With Permissions</option>
//                 </select>

//                 <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
//                 <select
//                   className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md mb-2"
//                   value={filters.department}
//                   onChange={(e) => setFilters({...filters, department: e.target.value})}
//                 >
//                   <option value="all">All Departments</option>
//                   {employeeStats.byDepartment.map((dept, index) => (
//                     <option key={index} value={dept.name}>{dept.name}</option>
//                   ))}
//                 </select>

//                 <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
//                 <select
//                   className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//                   value={filters.gender}
//                   onChange={(e) => setFilters({...filters, gender: e.target.value})}
//                 >
//                   <option value="all">All Genders</option>
//                   <option value="male">Male</option>
//                   <option value="female">Female</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 <input
//                   type="checkbox"
//                   onChange={(e) => handleSelectAll(e.target.checked)}
//                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                 />
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Name
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Email
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Department
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Position
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Gender
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Hire Date
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {filteredEmployees.length > 0 ? (
//               filteredEmployees.map((employee) => (
//                 <tr key={employee.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <input
//                       type="checkbox"
//                     //   checked={onSelectEmployees.includes(employee.id)}
//                       checked={onSelectEmployees && Array.isArray(onSelectEmployees) && onSelectEmployees.includes(employee.id)}
//                       onChange={(e) => handleSelectEmployee(employee.id, e.target.checked)}
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                     />
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
//                         {employee.name.charAt(0)}
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">{employee.name}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {employee.email}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {employee.department}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {employee.position}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                       employee.status === 'active' ? 'bg-green-100 text-green-800' :
//                       employee.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' :
//                       'bg-purple-100 text-purple-800'
//                     }`}>
//                       {employee.status.replace('_', ' ')}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {employee.gender}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(employee.hireDate).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <button className="text-blue-600 hover:text-blue-900 mr-3">
//                       <FaUserEdit />
//                     </button>
//                     <button className="text-red-600 hover:text-red-900">
//                       <FaUserTimes />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
//                   No employees found matching your criteria
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="flex items-center justify-between mt-4">
//         <div className="text-sm text-gray-500">
//           Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of <span className="font-medium">{filteredEmployees.length}</span> results
//         </div>
//         <div className="flex space-x-2">
//           <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
//             Previous
//           </button>
//           <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeTable;