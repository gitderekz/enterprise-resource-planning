import React,{useState} from 'react';
import CISDashboard from './CISDashboard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSidebar } from '../../lib/SidebarContext';

const FinanceDashboard = ({ stats }) => {
  const financeStats = stats.finance || {};
  const [activeTab, setActiveTab] = useState('financial');
  const { isSidebarVisible, toggleSidebar } = useSidebar();

  const cards = [
    { title: 'Total Revenue', value: financeStats.totalIncome || 0, trend: financeStats.incomeTrend || 0 },
    { title: 'Total Expenses', value: financeStats.totalExpense || 0, trend: financeStats.expenseTrend || 0 },
    { title: 'Net Profit', value: (financeStats.totalIncome || 0) - (financeStats.totalExpense || 0), trend: financeStats.profitTrend || 0 },
    { title: 'Open Invoices', value: financeStats.openInvoices || 0, trend: 0 },
    { title: 'Overdue Payments', value: financeStats.overduePayments || 0, trend: 0 },
    { title: 'Cash Flow', value: financeStats.cashFlow || 0, trend: financeStats.cashFlowTrend || 0 }
  ];

  const chartData = [
    { name: 'Revenue', value: financeStats.totalIncome || 0 },
    { name: 'Expenses', value: financeStats.totalExpense || 0 },
    { name: 'Profit', value: (financeStats.totalIncome || 0) - (financeStats.totalExpense || 0) }
  ];

  return (
    <div>
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'financial' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('financial')}
        >
          Financial Overview
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'cis' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('cis')}
        >
          Investment Schemes
        </button>
      </div>

      {activeTab === 'financial' ? (
        // Your existing financial dashboard content
        <div>
            <h1 className="text-2xl font-bold mb-6">Finance Dashboard</h1>
                {/* ... rest of your existing financial dashboard ... */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {cards.map((card, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">{card.title}</h3>
                    <div className="flex items-end mt-2">
                    <span className="text-2xl font-bold mr-2">
                        {typeof card.value === 'number' 
                        ? card.value.toLocaleString(undefined, { style: 'currency', currency: 'TSH' })
                        : card.value}
                    </span>
                    <span className={`text-sm ${card.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {card.trend >= 0 ? '↑' : '↓'} {Math.abs(card.trend)}%
                    </span>
                    </div>
                </div>
                ))}
            </div>

            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <h2 className="text-xl font-semibold mb-4">Financial Overview</h2>
                <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
                </div>
            </div>

            {/* Add more finance-specific components as needed */}
        </div>
      ) : (
        <CISDashboard />
      )}
    </div>
  );
};

export default FinanceDashboard;