'use client';
import React, { useState } from 'react';

const DeductionForm = ({ employees, selectedEmployee, deduction, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    employeeId: selectedEmployee?.id || '',
    type: deduction?.type || 'insurance',
    amount: deduction?.amount || '',
    isPercentage: deduction?.isPercentage || false,
    description: deduction?.description || ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {selectedEmployee ? 'Edit Deduction' : 'Add New Deduction'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Employee</label>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
              disabled={!!selectedEmployee}
            >
              <option value="">Select Employee</option>
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>
                  {employee.username} - {employee.position??employee?.role?.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Deduction Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="insurance">Insurance</option>
              <option value="loan">Loan</option>
              <option value="tax">Tax</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              name="isPercentage"
              id="isPercentage"
              checked={formData.isPercentage}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="isPercentage" className="text-sm font-medium">
              Is Percentage of Salary
            </label>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
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
            >
              {selectedEmployee ? 'Update' : 'Add'} Deduction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeductionForm;