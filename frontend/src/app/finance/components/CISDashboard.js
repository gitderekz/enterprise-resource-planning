import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const CISDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [schemes, setSchemes] = useState([]);
  const [summary, setSummary] = useState([]);
  const [navHistory, setNavHistory] = useState([]);
  const router = useRouter();

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
      
      // Get NAV history for the first scheme by default
      if (schemesRes.data.length > 0) {
        const navRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/cis/nav/${schemesRes.data[0].id}`, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNavHistory(navRes.data);
      }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Prepare data for charts
  const aumData = summary.map(scheme => ({
    name: scheme.name,
    value: scheme.aum
  }));

  const performanceData = navHistory.map(record => ({
    date: new Date(record.date).toLocaleDateString(),
    nav: record.navPerUnit
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Collective Investment Schemes</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Schemes</h3>
          <p className="text-2xl font-bold mt-2">{schemes.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total AUM</h3>
          <p className="text-2xl font-bold mt-2">
            {summary.reduce((sum, scheme) => sum + scheme.aum, 0).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD'
            })}
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AUM Distribution Pie Chart */}
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
                    currency: 'USD'
                  })}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* NAV Performance Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">NAV Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => value.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  })}
                />
                <Legend />
                <Bar dataKey="nav" fill="#8884d8" name="NAV per Unit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Schemes Table */}
      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">Schemes Overview</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheme</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AUM</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investors</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAV</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {summary.map((scheme) => (
              <tr key={scheme.id} className="hover:bg-gray-50 cursor-pointer" 
                  onClick={() => router.push(`/finance/cis/${scheme.id}`)}>
                <td className="px-6 py-4 whitespace-nowrap">{scheme.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${scheme.status === 'active' ? 'bg-green-100 text-green-800' : 
                      scheme.status === 'closed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {scheme.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{scheme.riskProfile}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {scheme.aum.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{scheme.totalInvestors}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {scheme.latestNav.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CISDashboard;