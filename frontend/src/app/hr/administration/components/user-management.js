'use client';
import React, { useState, useEffect } from 'react';
import { FaUserEdit, FaUserPlus, FaSave, FaTimes, FaTrash, FaSpinner } from 'react-icons/fa';
import { updateEmployee, bulkUpdateEmployees, createEmployee } from '../services/employeeService';
import { getRoles } from '../services/roleService';
import { toast } from 'react-toastify';

const UserManagement = ({ selectedEmployees, refreshEmployees }) => {
  const [activeTab, setActiveTab] = useState('edit');
  const [editMode, setEditMode] = useState('single');
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    role_id: '',
    status: 'active',
    permissions: [],
    password: '',
    confirmPassword: ''
  });
  const [bulkEdit, setBulkEdit] = useState({
    field: 'role_id',
    value: '',
    percentage: false,
    amount: ''
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const permissions = ['read', 'write', 'delete', 'approve', 'admin'];

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await getRoles();
        setRoles(rolesData);
      } catch (error) {
        toast.error('Failed to fetch roles');
      }
    };

    fetchRoles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (permission) => {
    setUserData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleBulkEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBulkEdit(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (activeTab === 'create') {
        if (userData.password !== userData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        await createEmployee({
          username: userData.username,
          email: userData.email,
          role_id: userData.role_id,
          status: userData.status,
          permissions: userData.permissions,
          password: userData.password
        });
        toast.success('User created successfully');
      } else if (editMode === 'single' && selectedUser) {
        await updateEmployee(selectedUser.id, {
          username: userData.username,
          email: userData.email,
          role_id: userData.role_id,
          status: userData.status,
          permissions: userData.permissions
        });
        toast.success('User updated successfully');
      }
      
      refreshEmployees();
      resetForm();
    } catch (error) {
      toast.error(error.message || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (selectedEmployees.length === 0) {
      toast.warning('No employees selected');
      return;
    }

    setLoading(true);
    
    try {
      const updates = {};
      if (bulkEdit.field === 'role_id') updates.role_id = bulkEdit.value;
      if (bulkEdit.field === 'status') updates.status = bulkEdit.value;
      if (bulkEdit.field === 'permissions') updates.permissions = [bulkEdit.value];
      if (bulkEdit.field === 'salary') {
        updates.baseSalary = bulkEdit.percentage 
          ? { operation: 'percentage', value: parseFloat(bulkEdit.amount) }
          : { operation: 'fixed', value: parseFloat(bulkEdit.amount) };
      }

      await bulkUpdateEmployees(selectedEmployees, updates);
      toast.success(`Updated ${selectedEmployees.length} employees`);
      refreshEmployees();
      setBulkEdit({
        field: 'role_id',
        value: '',
        percentage: false,
        amount: ''
      });
    } catch (error) {
      toast.error(error.message || 'Failed to bulk update');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setUserData({
      username: '',
      email: '',
      role_id: '',
      status: 'active',
      permissions: [],
      password: '',
      confirmPassword: ''
    });
    setSelectedUser(null);
  };

  const loadUserData = (user) => {
    setSelectedUser(user);
    setUserData({
      username: user.username,
      email: user.email,
      role_id: user.role_id,
      status: user.status,
      permissions: user.permissions || [],
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">User Management</h2>
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-md ${activeTab === 'edit' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => {
              setActiveTab('edit');
              resetForm();
            }}
          >
            <FaUserEdit className="inline mr-2" />
            Edit Users
          </button>
          <button
            className={`px-4 py-2 rounded-md ${activeTab === 'create' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => {
              setActiveTab('create');
              resetForm();
            }}
          >
            <FaUserPlus className="inline mr-2" />
            Create User
          </button>
        </div>
      </div>

      {activeTab === 'edit' && (
        <div>
          <div className="mb-4">
            <label className="inline-flex items-center mr-4">
              <input
                type="radio"
                className="form-radio"
                name="editMode"
                checked={editMode === 'single'}
                onChange={() => setEditMode('single')}
              />
              <span className="ml-2">Single User Edit</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="editMode"
                checked={editMode === 'bulk'}
                onChange={() => setEditMode('bulk')}
              />
              <span className="ml-2">Bulk Edit ({selectedEmployees.length} selected)</span>
            </label>
          </div>

          {editMode === 'single' ? (
            <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-md">
              {!selectedUser && (
                <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded">
                  <p>Please select a user from the employee table to edit</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={userData.username}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={!selectedUser}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={!selectedUser}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    name="role_id"
                    value={userData.role_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={!selectedUser}
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={userData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    disabled={!selectedUser}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on_leave">On Leave</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                <div className="flex flex-wrap gap-2">
                  {permissions.map((permission) => (
                    <label key={permission} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={userData.permissions.includes(permission)}
                        onChange={() => handlePermissionChange(permission)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={!selectedUser}
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{permission}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={resetForm}
                  disabled={!selectedUser || loading}
                >
                  <FaTimes className="inline mr-2" />
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
                  disabled={!selectedUser || loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin inline mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="inline mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleBulkSubmit} className="bg-gray-50 p-4 rounded-md">
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-3">
                  You are editing {selectedEmployees.length} selected employees. Changes will be applied to all selected users.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Field to Edit</label>
                    <select
                      name="field"
                      value={bulkEdit.field}
                      onChange={handleBulkEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="role_id">Role</option>
                      <option value="status">Status</option>
                      <option value="permissions">Permissions</option>
                      <option value="salary">Salary</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Value</label>
                    {bulkEdit.field === 'role_id' && (
                      <select
                        name="value"
                        value={bulkEdit.value}
                        onChange={handleBulkEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Role</option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                      </select>
                    )}
                    {bulkEdit.field === 'status' && (
                      <select
                        name="value"
                        value={bulkEdit.value}
                        onChange={handleBulkEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="on_leave">On Leave</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    )}
                    {bulkEdit.field === 'permissions' && (
                      <select
                        name="value"
                        value={bulkEdit.value}
                        onChange={handleBulkEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Permission</option>
                        {permissions.map((permission) => (
                          <option key={permission} value={permission}>{permission}</option>
                        ))}
                      </select>
                    )}
                    {bulkEdit.field === 'salary' && (
                      <div className="flex">
                        <input
                          type="number"
                          name="amount"
                          value={bulkEdit.amount}
                          onChange={handleBulkEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Amount"
                        />
                        <div className="flex items-center px-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md">
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              name="percentage"
                              checked={bulkEdit.percentage}
                              onChange={handleBulkEditChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">%</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setBulkEdit({
                    field: 'role_id',
                    value: '',
                    percentage: false,
                    amount: ''
                  })}
                  disabled={loading}
                >
                  <FaTimes className="inline mr-2" />
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
                  disabled={loading || selectedEmployees.length === 0}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin inline mr-2" />
                      Applying...
                    </>
                  ) : (
                    <>
                      <FaSave className="inline mr-2" />
                      Apply to Selected
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {activeTab === 'create' && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={userData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                minLength="6"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={userData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                minLength="6"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                name="role_id"
                value={userData.role_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={userData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
            <div className="flex flex-wrap gap-2">
              {permissions.map((permission) => (
                <label key={permission} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={userData.permissions.includes(permission)}
                    onChange={() => handlePermissionChange(permission)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{permission}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={resetForm}
              disabled={loading}
            >
              <FaTrash className="inline mr-2" />
              Clear
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin inline mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <FaUserPlus className="inline mr-2" />
                  Create User
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserManagement;
// *************************************



// 'use client';
// import React, { useState } from 'react';
// import { FaUserEdit, FaUserPlus, FaSave, FaTimes, FaTrash } from 'react-icons/fa';

// const UserManagement = ({ selectedEmployees }) => {
//   const [activeTab, setActiveTab] = useState('edit');
//   const [editMode, setEditMode] = useState('single');
//   const [userData, setUserData] = useState({
//     username: '',
//     email: '',
//     role: '',
//     status: 'active',
//     permissions: []
//   });
//   const [bulkEdit, setBulkEdit] = useState({
//     field: 'role',
//     value: '',
//     percentage: false,
//     amount: ''
//   });

//   const roles = ['Admin', 'Manager', 'Employee', 'HR', 'Finance'];
//   const permissions = ['read', 'write', 'delete', 'approve', 'admin'];

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setUserData(prev => ({ ...prev, [name]: value }));
//   };

//   const handlePermissionChange = (permission) => {
//     setUserData(prev => ({
//       ...prev,
//       permissions: prev.permissions.includes(permission)
//         ? prev.permissions.filter(p => p !== permission)
//         : [...prev.permissions, permission]
//     }));
//   };

//   const handleBulkEditChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setBulkEdit(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle form submission - API call in real implementation
//     console.log('User data submitted:', userData);
//   };

//   const handleBulkSubmit = (e) => {
//     e.preventDefault();
//     // Handle bulk edit submission - API call in real implementation
//     console.log('Bulk edit submitted:', bulkEdit, 'for employees:', selectedEmployees);
//   };

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-semibold">User Management</h2>
//         <div className="flex space-x-2">
//           <button
//             className={`px-4 py-2 rounded-md ${activeTab === 'edit' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
//             onClick={() => setActiveTab('edit')}
//           >
//             <FaUserEdit className="inline mr-2" />
//             Edit Users
//           </button>
//           <button
//             className={`px-4 py-2 rounded-md ${activeTab === 'create' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
//             onClick={() => setActiveTab('create')}
//           >
//             <FaUserPlus className="inline mr-2" />
//             Create User
//           </button>
//         </div>
//       </div>

//       {activeTab === 'edit' && (
//         <div>
//           <div className="mb-4">
//             <label className="inline-flex items-center mr-4">
//               <input
//                 type="radio"
//                 className="form-radio"
//                 name="editMode"
//                 checked={editMode === 'single'}
//                 onChange={() => setEditMode('single')}
//               />
//               <span className="ml-2">Single User Edit</span>
//             </label>
//             <label className="inline-flex items-center">
//               <input
//                 type="radio"
//                 className="form-radio"
//                 name="editMode"
//                 checked={editMode === 'bulk'}
//                 onChange={() => setEditMode('bulk')}
//               />
//               <span className="ml-2">Bulk Edit ({selectedEmployees.length} selected)</span>
//             </label>
//           </div>

//           {editMode === 'single' ? (
//             <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-md">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
//                   <input
//                     type="text"
//                     name="username"
//                     value={userData.username}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={userData.email}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
//                   <select
//                     name="role"
//                     value={userData.role}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     required
//                   >
//                     <option value="">Select Role</option>
//                     {roles.map((role, index) => (
//                       <option key={index} value={role.toLowerCase()}>{role}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                   <select
//                     name="status"
//                     value={userData.status}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                     <option value="on_leave">On Leave</option>
//                     <option value="suspended">Suspended</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
//                 <div className="flex flex-wrap gap-2">
//                   {permissions.map((permission, index) => (
//                     <label key={index} className="inline-flex items-center">
//                       <input
//                         type="checkbox"
//                         checked={userData.permissions.includes(permission)}
//                         onChange={() => handlePermissionChange(permission)}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                       />
//                       <span className="ml-2 text-sm text-gray-700 capitalize">{permission}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               <div className="flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                   onClick={() => setUserData({
//                     username: '',
//                     email: '',
//                     role: '',
//                     status: 'active',
//                     permissions: []
//                   })}
//                 >
//                   <FaTimes className="inline mr-2" />
//                   Reset
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   <FaSave className="inline mr-2" />
//                   Save Changes
//                 </button>
//               </div>
//             </form>
//           ) : (
//             <form onSubmit={handleBulkSubmit} className="bg-gray-50 p-4 rounded-md">
//               <div className="mb-4">
//                 <p className="text-sm text-gray-500 mb-3">
//                   You are editing {selectedEmployees.length} selected employees. Changes will be applied to all selected users.
//                 </p>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Field to Edit</label>
//                     <select
//                       name="field"
//                       value={bulkEdit.field}
//                       onChange={handleBulkEditChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       <option value="role">Role</option>
//                       <option value="status">Status</option>
//                       <option value="permissions">Permissions</option>
//                       <option value="salary">Salary</option>
//                     </select>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">New Value</label>
//                     {bulkEdit.field === 'role' && (
//                       <select
//                         name="value"
//                         value={bulkEdit.value}
//                         onChange={handleBulkEditChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       >
//                         <option value="">Select Role</option>
//                         {roles.map((role, index) => (
//                           <option key={index} value={role.toLowerCase()}>{role}</option>
//                         ))}
//                       </select>
//                     )}
//                     {bulkEdit.field === 'status' && (
//                       <select
//                         name="value"
//                         value={bulkEdit.value}
//                         onChange={handleBulkEditChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       >
//                         <option value="active">Active</option>
//                         <option value="inactive">Inactive</option>
//                         <option value="on_leave">On Leave</option>
//                         <option value="suspended">Suspended</option>
//                       </select>
//                     )}
//                     {bulkEdit.field === 'permissions' && (
//                       <select
//                         name="value"
//                         value={bulkEdit.value}
//                         onChange={handleBulkEditChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       >
//                         <option value="">Select Permission</option>
//                         {permissions.map((permission, index) => (
//                           <option key={index} value={permission}>{permission}</option>
//                         ))}
//                       </select>
//                     )}
//                     {bulkEdit.field === 'salary' && (
//                       <div className="flex">
//                         <input
//                           type="number"
//                           name="amount"
//                           value={bulkEdit.amount}
//                           onChange={handleBulkEditChange}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                           placeholder="Amount"
//                         />
//                         <div className="flex items-center px-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md">
//                           <label className="inline-flex items-center">
//                             <input
//                               type="checkbox"
//                               name="percentage"
//                               checked={bulkEdit.percentage}
//                               onChange={handleBulkEditChange}
//                               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                             />
//                             <span className="ml-2 text-sm text-gray-700">%</span>
//                           </label>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                   onClick={() => setBulkEdit({
//                     field: 'role',
//                     value: '',
//                     percentage: false,
//                     amount: ''
//                   })}
//                 >
//                   <FaTimes className="inline mr-2" />
//                   Reset
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   <FaSave className="inline mr-2" />
//                   Apply to Selected
//                 </button>
//               </div>
//             </form>
//           )}
//         </div>
//       )}

//       {activeTab === 'create' && (
//         <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-md">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
//               <input
//                 type="text"
//                 name="username"
//                 value={userData.username}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={userData.email}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
//               <select
//                 name="role"
//                 value={userData.role}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 required
//               >
//                 <option value="">Select Role</option>
//                 {roles.map((role, index) => (
//                   <option key={index} value={role.toLowerCase()}>{role}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//               <select
//                 name="status"
//                 value={userData.status}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//             </div>
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
//             <div className="flex flex-wrap gap-2">
//               {permissions.map((permission, index) => (
//                 <label key={index} className="inline-flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={userData.permissions.includes(permission)}
//                     onChange={() => handlePermissionChange(permission)}
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                   />
//                   <span className="ml-2 text-sm text-gray-700 capitalize">{permission}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div className="flex justify-end space-x-3">
//             <button
//               type="button"
//               className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               onClick={() => setUserData({
//                 username: '',
//                 email: '',
//                 role: '',
//                 status: 'active',
//                 permissions: []
//               })}
//             >
//               <FaTrash className="inline mr-2" />
//               Clear
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//             >
//               <FaUserPlus className="inline mr-2" />
//               Create User
//             </button>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// };

// export default UserManagement;