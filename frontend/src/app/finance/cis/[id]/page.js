// 'use client'; // Add this line at the very top
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SchemeDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [navHistory, setNavHistory] = useState([]);
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    const fetchSchemeData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [schemeRes, navRes, investmentsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cis/schemes/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cis/nav/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cis/investments`, {
            params: { schemeId: id },
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setScheme(schemeRes.data);
        setNavHistory(navRes.data);
        setInvestments(investmentsRes.data);
      } catch (error) {
        toast.error('Failed to load scheme data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemeData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!scheme) {
    return <div className="p-6">Scheme not found</div>;
  }

  // Prepare data for charts
  const performanceData = navHistory.map(record => ({
    date: new Date(record.date).toLocaleDateString(),
    nav: record.navPerUnit
  }));

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{scheme.name}</h1>
          <p className="text-gray-600">{scheme.description}</p>
        </div>
        <div className="flex space-x-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full 
            ${scheme.status === 'active' ? 'bg-green-100 text-green-800' : 
              scheme.status === 'closed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {scheme.status}
          </span>
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            {scheme.riskProfile} risk
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Current NAV</h3>
          <p className="text-2xl font-bold mt-2">
            {navHistory.length > 0 
              ? navHistory[0].navPerUnit.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'TSH'
                })
              : 'N/A'}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total AUM</h3>
          <p className="text-2xl font-bold mt-2">
            {(scheme.totalUnits * (navHistory.length > 0 ? navHistory[0].navPerUnit : 0)).toLocaleString('en-US', {
              style: 'currency',
              currency: 'TSH'
            })}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Investors</h3>
          <p className="text-2xl font-bold mt-2">{investments.length}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">NAV Performance</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value) => value.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'TSH'
                })}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="nav" 
                stroke="#8884d8" 
                name="NAV per Unit" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">Recent Investments</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {investments.slice(0, 5).map((investment) => (
              <tr key={investment.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {investment.customer?.name || 'Unknown'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(investment.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{investment.units}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {investment.amount.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'TSH'
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${investment.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {investment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// export default SchemeDetailPage;
export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/finance/cis`);
  const data = await res.json();

  return data.map((item) => ({
    id: item.id.toString(),
  }));
}
