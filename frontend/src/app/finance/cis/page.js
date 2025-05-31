'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import SchemeDetailModal from './SchemeDetailModal';
import { useSidebar } from '../../lib/SidebarContext';
import { useSharedStyles } from '../../sharedStyles';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FaPlus, FaSearch, FaFilter, FaDownload } from 'react-icons/fa';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const CISPage = () => {
  const router = useRouter();
  const [selectedSchemeId, setSelectedSchemeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [schemes, setSchemes] = useState([]);
  const [summary, setSummary] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { isSidebarVisible } = useSidebar();
  const styles = useSharedStyles();
  const schemesPerPage = 10;

  const fetchCISData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [summaryRes, schemesRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cis/reports/summary`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cis/schemes`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setSummary(summaryRes.data);
      setSchemes(schemesRes.data);
    } catch (error) {
      toast.error('Failed to load CIS data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCISData();
  }, []);

  // Filter and search functionality
  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         scheme.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || scheme.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const indexOfLastScheme = currentPage * schemesPerPage;
  const indexOfFirstScheme = indexOfLastScheme - schemesPerPage;
  const currentSchemes = filteredSchemes.slice(indexOfFirstScheme, indexOfLastScheme);
  const totalPages = Math.ceil(filteredSchemes.length / schemesPerPage);

  // Data for charts
  const aumData = summary.map(scheme => ({
    name: scheme.name,
    value: scheme.aum
  }));

  const statusData = [
    { name: 'Active', value: schemes.filter(s => s.status === 'active').length },
    { name: 'Closed', value: schemes.filter(s => s.status === 'closed').length },
    { name: 'Suspended', value: schemes.filter(s => s.status === 'suspended').length }
  ];

  const riskProfileData = [
    { name: 'Low', value: schemes.filter(s => s.riskProfile === 'low').length },
    { name: 'Medium', value: schemes.filter(s => s.riskProfile === 'medium').length },
    { name: 'High', value: schemes.filter(s => s.riskProfile === 'high').length }
  ];

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cis/reports/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'cis-report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Export started successfully');
    } catch (error) {
      toast.error('Failed to export data');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <Header />

        {/* Main Content */}
        <div style={styles.mainContent}>
            {/* Sidebar */}
            <Sidebar/>

            {/* Scrollable Content */}
            {/*<div style={styles.content}>*/}
            <div style={{ 
            marginLeft: isSidebarVisible ? '250px' : '0',
            padding: '24px',
            width: isSidebarVisible ? 'calc(100% - 250px)' : '100%',
            transition: 'all 0.3s ease',
            }}>
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Collective Investment Schemes</h1>
                    <div className="flex space-x-4">
                    <button 
                        onClick={() => router.push('/finance/cis/new')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center space-x-2 hover:bg-blue-700 transition"
                    >
                        <FaPlus /> <span>New Scheme</span>
                    </button>
                    <button 
                        onClick={handleExport}
                        className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center space-x-2 hover:bg-green-700 transition"
                    >
                        <FaDownload /> <span>Export</span>
                    </button>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-lg shadow">
                    <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Search schemes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    </div>
                    <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                        <FaFilter className="text-gray-400 mr-2" />
                        <select
                        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="closed">Closed</option>
                        <option value="suspended">Suspended</option>
                        </select>
                    </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Total Schemes</h3>
                    <p className="text-2xl font-bold mt-2">{schemes.length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Total AUM</h3>
                    <p className="text-2xl font-bold mt-2">
                        {summary.reduce((sum, scheme) => sum + scheme.aum, 0).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'TSH'
                        })}
                    </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Active Schemes</h3>
                    <p className="text-2xl font-bold mt-2">
                        {schemes.filter(s => s.status === 'active').length}
                    </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Total Investors</h3>
                    <p className="text-2xl font-bold mt-2">
                        {summary.reduce((sum, scheme) => sum + scheme.totalInvestors, 0)}
                    </p>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* AUM Distribution */}
                    <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">AUM Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                            data={aumData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                            {aumData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                            </Pie>
                            <Tooltip 
                            formatter={(value) => value.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'TSH'
                            })}
                            />
                            <Legend />
                        </PieChart>
                        </ResponsiveContainer>
                    </div>
                    </div>
                    
                    {/* Status Distribution */}
                    <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={statusData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" name="Schemes" />
                        </BarChart>
                        </ResponsiveContainer>
                    </div>
                    </div>
                    
                    {/* Risk Profile */}
                    <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Risk Profile</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                            data={riskProfileData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                            <Cell fill="#4CAF50" />
                            <Cell fill="#FFC107" />
                            <Cell fill="#F44336" />
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                        </ResponsiveContainer>
                    </div>
                    </div>
                </div>

                {/* Schemes Table */}
                <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheme</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AUM</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investors</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAV</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentSchemes.map((scheme) => {
                        const schemeSummary = summary.find(s => s.id === scheme.id) || {};
                        return (
                            <tr key={scheme.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{scheme.name}</div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">{scheme.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${scheme.status === 'active' ? 'bg-green-100 text-green-800' : 
                                    scheme.status === 'closed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {scheme.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap capitalize">{scheme.riskProfile}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {schemeSummary.aum?.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'TSH'
                                }) || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{schemeSummary.totalInvestors || 0}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {schemeSummary.latestNav?.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'TSH'
                                }) || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                onClick={() => setSelectedSchemeId(scheme.id)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                                >
                                View
                                </button>
                                <button
                                onClick={() => router.push(`/finance/cis/${scheme.id}/edit`)}
                                className="text-indigo-600 hover:text-indigo-900"
                                >
                                Edit
                                </button>
                            </td>
                            </tr>
                        );
                        })}
                    </tbody>
                    </table>

                    {/* Pagination */}
                    {filteredSchemes.length > schemesPerPage && (
                    <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{indexOfFirstScheme + 1}</span> to{' '}
                            <span className="font-medium">
                                {Math.min(indexOfLastScheme, filteredSchemes.length)}
                            </span>{' '}
                            of <span className="font-medium">{filteredSchemes.length}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    currentPage === page
                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                                >
                                {page}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                            </nav>
                        </div>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>
        <SchemeDetailModal 
            schemeId={selectedSchemeId}
            onClose={() => setSelectedSchemeId(null)}
        />
    </div>
  );
};

export default CISPage;