'use client';
import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaFileExcel, FaFileCsv, FaDownload, FaCalendarAlt, FaTrash, FaSpinner } from 'react-icons/fa';
import { generateReport, getRecentReports, deleteReport } from '../services/reportService';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';

const ReportsSection = () => {
  const [reportType, setReportType] = useState('employee_list');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [format, setFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recentReports, setRecentReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);

  const reportTypes = [
    { value: 'employee_list', label: 'Employee List' },
    { value: 'attendance', label: 'Attendance Report' },
    { value: 'leave', label: 'Leave Report' },
    { value: 'payroll', label: 'Payroll Summary' },
    { value: 'performance', label: 'Performance Review' },
    { value: 'turnover', label: 'Turnover Analysis' },
  ];

  useEffect(() => {
    const fetchRecentReports = async () => {
      try {
        setLoadingReports(true);
        const reports = await getRecentReports();
        setRecentReports(reports);
      } catch (error) {
        toast.error('Failed to fetch recent reports');
      } finally {
        setLoadingReports(false);
      }
    };

    fetchRecentReports();
  }, []);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    
    if (!dateRange.start || !dateRange.end) {
      toast.warning('Please select a date range');
      return;
    }

    setIsGenerating(true);
    
    try {
      const reportData = {
        reportType,
        startDate: dateRange.start,
        endDate: dateRange.end,
        format
      };

      const response = await generateReport(reportData);
      
      // Handle the file download
      const blob = new Blob([response], { type: `application/${format}` });
      const filename = `${reportType}_${dateRange.start}_to_${dateRange.end}.${format}`;
      saveAs(blob, filename);
      
      toast.success('Report generated successfully');
      
      // Refresh recent reports
      const reports = await getRecentReports();
      setRecentReports(reports);
    } catch (error) {
      toast.error(error.message || 'Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = async (reportId, filename) => {
    try {
      const response = await generateReport({ reportId });
      const blob = new Blob([response], { type: `application/${filename.split('.').pop()}` });
      saveAs(blob, filename);
    } catch (error) {
      toast.error('Failed to download report');
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await deleteReport(reportId);
        setRecentReports(prev => prev.filter(report => report.id !== reportId));
        toast.success('Report deleted successfully');
      } catch (error) {
        toast.error('Failed to delete report');
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Generate Reports</h2>
      
      <form onSubmit={handleGenerateReport} className="bg-gray-50 p-4 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <div className="flex space-x-2">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <input
                  type="date"
                  name="start"
                  value={dateRange.start}
                  onChange={handleDateChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <span className="flex items-center">to</span>
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <input
                  type="date"
                  name="end"
                  value={dateRange.end}
                  onChange={handleDateChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="format"
                value="pdf"
                checked={format === 'pdf'}
                onChange={() => setFormat('pdf')}
              />
              <span className="ml-2 flex items-center">
                <FaFilePdf className="mr-1 text-red-500" /> PDF
              </span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="format"
                value="excel"
                checked={format === 'excel'}
                onChange={() => setFormat('excel')}
              />
              <span className="ml-2 flex items-center">
                <FaFileExcel className="mr-1 text-green-500" /> Excel
              </span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="format"
                value="csv"
                checked={format === 'csv'}
                onChange={() => setFormat('csv')}
              />
              <span className="ml-2 flex items-center">
                <FaFileCsv className="mr-1 text-blue-500" /> CSV
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isGenerating}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center ${
              isGenerating ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isGenerating ? (
              <>
                <FaSpinner className="animate-spin inline mr-2" />
                Generating...
              </>
            ) : (
              <>
                <FaDownload className="inline mr-2" />
                Generate Report
              </>
            )}
          </button>
        </div>
      </form>

      {/* Recent Reports */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Recent Reports</h3>
        {loadingReports ? (
          <div className="flex justify-center items-center h-32">
            <FaSpinner className="animate-spin text-2xl text-blue-500" />
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {recentReports.length > 0 ? (
                recentReports.map((report) => (
                  <li key={report.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-blue-600 truncate">
                          {report.name}
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            report.format === 'pdf' ? 'bg-red-100 text-red-800' :
                            report.format === 'excel' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {report.format.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <div className="mr-6 flex items-center text-sm text-gray-500">
                            <FaCalendarAlt className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {new Date(report.createdAt).toLocaleDateString()}
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            {formatFileSize(report.size)}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <button 
                            className="text-blue-600 hover:text-blue-900 mr-3"
                            onClick={() => handleDownloadReport(report.id, report.filename)}
                          >
                            <FaDownload className="inline mr-1" />
                            Download
                          </button>
                          <button 
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => handleDeleteReport(report.id)}
                          >
                            <FaTrash className="inline" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li>
                  <div className="px-4 py-4 text-center text-sm text-gray-500">
                    No recent reports found
                  </div>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsSection;
// *********************************



// 'use client';
// import React, { useState } from 'react';
// import { FaFilePdf, FaFileExcel, FaFileCsv, FaDownload, FaCalendarAlt, FaTrash } from 'react-icons/fa';

// const ReportsSection = () => {
//   const [reportType, setReportType] = useState('employee_list');
//   const [dateRange, setDateRange] = useState({
//     start: '',
//     end: ''
//   });
//   const [format, setFormat] = useState('pdf');
//   const [isGenerating, setIsGenerating] = useState(false);

//   const reportTypes = [
//     { value: 'employee_list', label: 'Employee List' },
//     { value: 'attendance', label: 'Attendance Report' },
//     { value: 'leave', label: 'Leave Report' },
//     { value: 'payroll', label: 'Payroll Summary' },
//     { value: 'performance', label: 'Performance Review' },
//     { value: 'turnover', label: 'Turnover Analysis' },
//   ];

//   const handleDateChange = (e) => {
//     const { name, value } = e.target;
//     setDateRange(prev => ({ ...prev, [name]: value }));
//   };

//   const handleGenerateReport = (e) => {
//     e.preventDefault();
//     setIsGenerating(true);
    
//     // Simulate report generation
//     setTimeout(() => {
//       setIsGenerating(false);
//       alert(`Report generated successfully! (This would download the ${reportType} report in ${format} format)`);
//     }, 1500);
//   };

//   return (
//     <div>
//       <h2 className="text-xl font-semibold mb-6">Generate Reports</h2>
      
//       <form onSubmit={handleGenerateReport} className="bg-gray-50 p-4 rounded-md">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
//             <select
//               value={reportType}
//               onChange={(e) => setReportType(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             >
//               {reportTypes.map((type, index) => (
//                 <option key={index} value={type.value}>{type.label}</option>
//               ))}
//             </select>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
//             <div className="flex space-x-2">
//               <div className="relative flex-grow">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FaCalendarAlt className="text-gray-400" />
//                 </div>
//                 <input
//                   type="date"
//                   name="start"
//                   value={dateRange.start}
//                   onChange={handleDateChange}
//                   className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//               <span className="flex items-center">to</span>
//               <div className="relative flex-grow">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FaCalendarAlt className="text-gray-400" />
//                 </div>
//                 <input
//                   type="date"
//                   name="end"
//                   value={dateRange.end}
//                   onChange={handleDateChange}
//                   className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
//           <div className="flex space-x-4">
//             <label className="inline-flex items-center">
//               <input
//                 type="radio"
//                 className="form-radio"
//                 name="format"
//                 value="pdf"
//                 checked={format === 'pdf'}
//                 onChange={() => setFormat('pdf')}
//               />
//               <span className="ml-2 flex items-center">
//                 <FaFilePdf className="mr-1 text-red-500" /> PDF
//               </span>
//             </label>
//             <label className="inline-flex items-center">
//               <input
//                 type="radio"
//                 className="form-radio"
//                 name="format"
//                 value="excel"
//                 checked={format === 'excel'}
//                 onChange={() => setFormat('excel')}
//               />
//               <span className="ml-2 flex items-center">
//                 <FaFileExcel className="mr-1 text-green-500" /> Excel
//               </span>
//             </label>
//             <label className="inline-flex items-center">
//               <input
//                 type="radio"
//                 className="form-radio"
//                 name="format"
//                 value="csv"
//                 checked={format === 'csv'}
//                 onChange={() => setFormat('csv')}
//               />
//               <span className="ml-2 flex items-center">
//                 <FaFileCsv className="mr-1 text-blue-500" /> CSV
//               </span>
//             </label>
//           </div>
//         </div>

//         <div className="flex justify-end">
//           <button
//             type="submit"
//             disabled={isGenerating}
//             className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isGenerating ? 'opacity-75 cursor-not-allowed' : ''}`}
//           >
//             {isGenerating ? (
//               'Generating...'
//             ) : (
//               <>
//                 <FaDownload className="inline mr-2" />
//                 Generate Report
//               </>
//             )}
//           </button>
//         </div>
//       </form>

//       {/* Recent Reports */}
//       <div className="mt-8">
//         <h3 className="text-lg font-medium mb-4">Recent Reports</h3>
//         <div className="bg-white shadow overflow-hidden sm:rounded-md">
//           <ul className="divide-y divide-gray-200">
//             {[
//               { id: 1, name: 'Employee List', type: 'pdf', date: '2023-06-15', size: '2.4 MB' },
//               { id: 2, name: 'Payroll Summary', type: 'excel', date: '2023-06-10', size: '1.8 MB' },
//               { id: 3, name: 'Attendance Report', type: 'csv', date: '2023-06-05', size: '3.2 MB' },
//               { id: 4, name: 'Performance Review', type: 'pdf', date: '2023-05-28', size: '4.1 MB' },
//             ].map((report) => (
//               <li key={report.id}>
//                 <div className="px-4 py-4 sm:px-6">
//                   <div className="flex items-center justify-between">
//                     <div className="text-sm font-medium text-blue-600 truncate">
//                       {report.name}
//                     </div>
//                     <div className="ml-2 flex-shrink-0 flex">
//                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         report.type === 'pdf' ? 'bg-red-100 text-red-800' :
//                         report.type === 'excel' ? 'bg-green-100 text-green-800' :
//                         'bg-blue-100 text-blue-800'
//                       }`}>
//                         {report.type.toUpperCase()}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="mt-2 sm:flex sm:justify-between">
//                     <div className="sm:flex">
//                       <div className="mr-6 flex items-center text-sm text-gray-500">
//                         <FaCalendarAlt className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
//                         {report.date}
//                       </div>
//                       <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
//                         {report.size}
//                       </div>
//                     </div>
//                     <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
//                       <button className="text-blue-600 hover:text-blue-900 mr-3">
//                         <FaDownload className="inline mr-1" />
//                         Download
//                       </button>
//                       <button className="text-gray-500 hover:text-gray-700">
//                         <FaTrash className="inline" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReportsSection;