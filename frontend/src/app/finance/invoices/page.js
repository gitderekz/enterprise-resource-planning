'use client';
import React, { useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import { useSharedStyles } from '../../sharedStyles';
import { usePathname } from 'next/navigation';
import { MenuContext } from '../../lib/MenuContext';
import { useSidebar } from '../../lib/SidebarContext';

const invoiceStatusData = [
  { status: 'Paid', count: 120 },
  { status: 'Pending', count: 45 },
  { status: 'Overdue', count: 15 },
];

const recentInvoices = [
  { id: 'INV-001', client: 'Acme Corp', amount: 1250.50, date: '2023-06-15', dueDate: '2023-07-15', status: 'Paid' },
  { id: 'INV-002', client: 'Globex Inc', amount: 890.00, date: '2023-06-18', dueDate: '2023-07-18', status: 'Pending' },
  { id: 'INV-003', client: 'Soylent Corp', amount: 2450.75, date: '2023-06-20', dueDate: '2023-07-20', status: 'Pending' },
  { id: 'INV-004', client: 'Initech LLC', amount: 1500.00, date: '2023-06-22', dueDate: '2023-07-22', status: 'Overdue' },
];

export default function InvoicesPage() {
  const styles = useSharedStyles();
  const pathname = usePathname();
  const { menuItems } = useContext(MenuContext);
  const { isSidebarVisible } = useSidebar();
  const currentMenuItem = menuItems.find(item => item.link === pathname);
  const pageTitle = currentMenuItem?.menu_item || 'Invoices';

  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.mainContent}>
        <Sidebar />
        <div style={{ 
          marginLeft: isSidebarVisible ? '250px' : '0',
          padding: '24px',
          width: isSidebarVisible ? 'calc(100% - 250px)' : '100%',
          transition: 'all 0.3s ease',
        }}>
          <h1 style={styles.pageTitle}>{pageTitle}</h1>

          {/* Invoice Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Invoice Status</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="h-64 w-full md:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={invoiceStatusData}>
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Number of Invoices" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full md:w-1/2">
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">120</div>
                    <div className="text-sm text-gray-600">Paid</div>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">45</div>
                    <div className="text-sm text-gray-600">Pending</div>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">15</div>
                    <div className="text-sm text-gray-600">Overdue</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between mb-1">
                    <span>Total Outstanding:</span>
                    <span className="font-bold">{`${process.env.NEXT_PUBLIC_CURRENCY}`}12,450.25</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Days to Pay:</span>
                    <span className="font-bold">14.5 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Invoices</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Create New Invoice
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Invoice #</th>
                    <th className="py-2 px-4 border-b">Client</th>
                    <th className="py-2 px-4 border-b">Amount</th>
                    <th className="py-2 px-4 border-b">Date</th>
                    <th className="py-2 px-4 border-b">Due Date</th>
                    <th className="py-2 px-4 border-b">Status</th>
                    <th className="py-2 px-4 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((invoice, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{invoice.id}</td>
                      <td className="py-2 px-4 border-b">{invoice.client}</td>
                      <td className="py-2 px-4 border-b">{`${process.env.NEXT_PUBLIC_CURRENCY}`}{invoice.amount.toFixed(2)}</td>
                      <td className="py-2 px-4 border-b">{invoice.date}</td>
                      <td className="py-2 px-4 border-b">{invoice.dueDate}</td>
                      <td className="py-2 px-4 border-b">
                        <span className={`px-2 py-1 rounded text-xs ${
                          invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button className="text-blue-600 hover:underline mr-2">View</button>
                        <button className="text-gray-600 hover:underline">PDF</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}