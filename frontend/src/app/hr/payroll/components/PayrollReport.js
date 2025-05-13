'use client';
import React, { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { BlobProvider } from '@react-pdf/renderer';
import PayrollPDF from './PayrollPDF';
import { exportPayrollReport } from '../services/payrollService';

const PayrollReport = ({ payrollData, payrollRecords, users, onClose }) => {
  const [reportType, setReportType] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const filteredRecords = payrollRecords
    .map(record => ({
      ...record,
      user: users.find(u => u.id === record.userId)
    }))
    .filter(record => {
      if (reportType === 'monthly') {
        const [year, month] = record.period.split('-');
        return parseInt(month) === selectedMonth && parseInt(year) === selectedYear;
      }
      return true;
    });

  const handleExport = async (format) => {
    try {
      const params = {};
      if (reportType === 'monthly') {
        const paddedMonth = selectedMonth.toString().padStart(2, '0');
        // params.month = selectedMonth;
        params.month = paddedMonth;
        params.year = selectedYear;
      }
      await exportPayrollReport(format, params);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Generate Payroll Report</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
            </select>
          </div>
          
          {reportType === 'monthly' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="w-full p-2 border rounded"
                >
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = new Date(0, i).toLocaleString('default', { month: 'long' });
                    return <option key={i} value={i + 1}>{month}</option>;
                  })}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full p-2 border rounded"
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - 2 + i;
                    return <option key={i} value={year}>{year}</option>;
                  })}
                </select>
              </div>
            </>
          )}
        </div>
        
        {/* Report Preview */}
        <div className="border rounded p-4 mb-6">
          <h3 className="font-medium mb-2">Preview</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Employee</th>
                  <th className="py-2 px-4 border-b">Gross Salary</th>
                  <th className="py-2 px-4 border-b">Deductions</th>
                  <th className="py-2 px-4 border-b">Net Salary</th>
                  <th className="py-2 px-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record, i) => (
                    <tr key={i}>
                      <td className="py-2 px-4 border-b">{record.user?.username || 'Unknown'}</td>
                      <td className="py-2 px-4 border-b">{`${process.env.NEXT_PUBLIC_CURRENCY}`}{record.grossSalary.toLocaleString()}</td>
                      <td className="py-2 px-4 border-b">{`${process.env.NEXT_PUBLIC_CURRENCY}`}{record.deductions.toLocaleString()}</td>
                      <td className="py-2 px-4 border-b">{`${process.env.NEXT_PUBLIC_CURRENCY}`}{record.netSalary.toLocaleString()}</td>
                      <td className="py-2 px-4 border-b capitalize">{record.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-gray-500">
                      No records found for selected period
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Export Options */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('csv')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Export CSV
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Export Excel
            </button>
            {/* <PDFDownloadLink 
              document={<PayrollPDF records={filteredRecords} reportType={reportType} />}
              fileName={`payroll_report_${reportType}.pdf`}
            >
              {({ loading }) => (
                <button
                  className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 ${loading ? 'opacity-50' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Preparing PDF...' : 'Export PDF'}
                </button>
              )}
            </PDFDownloadLink> */}
            <BlobProvider document={<PayrollPDF records={filteredRecords} reportType={reportType} />}>
              {({ url, loading }) => (
                <a
                  href={url}
                  download={`payroll_report_${reportType}.pdf`}
                  className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 ${loading ? 'opacity-50' : ''}`}
                  onClick={(e) => loading && e.preventDefault()}
                >
                  {loading ? 'Preparing PDF...' : 'Export PDF'}
                </a>
              )}
            </BlobProvider>

          </div>
          
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayrollReport;