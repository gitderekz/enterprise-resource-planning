// src/app/finance/cis/SchemeDetailModal.js
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

export default function SchemeDetailModal({ schemeId, onClose }) {
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(false);
  const [navHistory, setNavHistory] = useState([]);
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    if (!schemeId) return;

    const fetchSchemeData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const [schemeRes, navRes, investmentsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cis/schemes/${schemeId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cis/nav/${schemeId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cis/investments`, {
            params: { schemeId },
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
  }, [schemeId]);

  // Prepare data for charts
  const performanceData = navHistory.map(record => ({
    date: new Date(record.date).toLocaleDateString(),
    nav: record.navPerUnit
  }));

  return (
    <AnimatePresence>
      {schemeId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold">Scheme Details</h2>
                <button 
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : scheme ? (
                <>
                  {/* Your existing detail view content */}
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
                </>
              ) : (
                <div className="p-6 text-center">
                  <p>Scheme not found</p>
                  <button 
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}