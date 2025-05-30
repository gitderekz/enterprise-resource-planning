'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaFilePdf, FaFileExcel, FaFileCsv } from 'react-icons/fa';

const FinanceTable = ({ records, onDelete, onEdit }) => {
  const [filteredRecords, setFilteredRecords] = useState(records);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    let result = records;
    
    if (searchTerm) {
      result = result.filter(record => 
        record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.reference?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedType !== 'all') {
      result = result.filter(record => record.type === selectedType);
    }
    
    if (selectedStatus !== 'all') {
      result = result.filter(record => record.status === selectedStatus);
    }
    
    setFilteredRecords(result);
  }, [records, searchTerm, selectedType, selectedStatus]);

  const handleExport = async (type) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/finance/export/${type}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `finance_records.${type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error(`Failed to export ${type}: ${error.message}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search records..."
            className="w-full p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <select
            className="p-2 border rounded"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="invoice">Invoice</option>
            <option value="receipt">Receipt</option>
          </select>
          
          <select
            className="p-2 border rounded"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <div className="flex gap-2">
            <button 
              onClick={() => handleExport('pdf')}
              className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              <FaFilePdf />
            </button>
            <button 
              onClick={() => handleExport('excel')}
              className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <FaFileExcel />
            </button>
            <button 
              onClick={() => handleExport('csv')}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <FaFileCsv />
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Type</th>
              <th className="py-2 px-4 border">Description</th>
              <th className="py-2 px-4 border">Amount</th>
              <th className="py-2 px-4 border">Category</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{new Date(record.date).toLocaleDateString()}</td>
                <td className="py-2 px-4 border capitalize">{record.type}</td>
                <td className="py-2 px-4 border">{record.description}</td>
                <td className={`py-2 px-4 border ${
                  record.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {record.amount.toLocaleString()}
                </td>
                <td className="py-2 px-4 border capitalize">{record.category}</td>
                <td className="py-2 px-4 border capitalize">{record.status}</td>
                <td className="py-2 px-4 border">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onEdit(record)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => onDelete(record.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinanceTable;