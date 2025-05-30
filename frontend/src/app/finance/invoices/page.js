'use client';
import React, { useState, useEffect } from 'react';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import FinanceTable from '../components/FinanceTable';
import FinanceForm from '../components/FinanceForm';
import FinanceChart from '../components/FinanceChart';
import { useSharedStyles } from '../../sharedStyles';
import { useSidebar } from '../../lib/SidebarContext';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function InvoicesPage() {
  const { isSidebarVisible } = useSidebar();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const styles = useSharedStyles();
  const [showForm, setShowForm] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = { type: 'invoice' };
      if (statusFilter !== 'all') params.status = statusFilter;
      
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/finance`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      setInvoices(response.data);
    } catch (error) {
      toast.error('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [statusFilter]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/finance/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Invoice deleted successfully');
      fetchInvoices();
    } catch (error) {
      toast.error('Failed to delete invoice');
    }
  };

  const handleStatusChange = (id, newStatus) => {
    const updateInvoiceStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/finance/${id}`, 
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Invoice status updated');
        fetchInvoices();
      } catch (error) {
        toast.error('Failed to update invoice status');
      }
    };
    updateInvoiceStatus();
  };

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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Invoice Management</h1>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded px-3 py-1"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={() => {
                  setCurrentRecord(null);
                  setShowForm(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create Invoice
              </button>
            </div>
          </div>
          
          {showForm ? (
            <FinanceForm 
              record={currentRecord}
              onSuccess={() => {
                setShowForm(false);
                fetchInvoices();
              }}
              onCancel={() => setShowForm(false)}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <FinanceChart 
                  data={[
                    { name: 'Pending', value: invoices.filter(i => i.status === 'pending').length },
                    { name: 'Completed', value: invoices.filter(i => i.status === 'completed').length },
                    { name: 'Cancelled', value: invoices.filter(i => i.status === 'cancelled').length },
                  ]}
                  type="pie"
                  title="Invoice Status Distribution"
                />
                <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-lg font-semibold mb-4">Invoice Summary</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-600">Total Invoices</p>
                      <p className="text-2xl font-bold">{invoices.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Amount</p>
                      <p className="text-2xl font-bold text-green-600">
                        {invoices.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Outstanding</p>
                      <p className="text-xl text-red-600">
                        {invoices
                          .filter(i => i.status === 'pending')
                          .reduce((sum, item) => sum + item.amount, 0)
                          .toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <FinanceTable 
                records={invoices} 
                onDelete={handleDelete}
                onEdit={(record) => {
                  setCurrentRecord(record);
                  setShowForm(true);
                }}
                customActions={(record) => (
                  <>
                    {record.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleStatusChange(record.id, 'completed')}
                          className="text-green-600 hover:text-green-800"
                        >
                          Mark Paid
                        </button>
                        <button 
                          onClick={() => handleStatusChange(record.id, 'cancelled')}
                          className="text-red-600 hover:text-red-800 ml-2"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </>
                )}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}



// 'use client';
// import React, { useContext } from 'react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import Header from '../../components/header';
// import Sidebar from '../../components/sidebar';
// import { useSharedStyles } from '../../sharedStyles';
// import { usePathname } from 'next/navigation';
// import { MenuContext } from '../../lib/MenuContext';
// import { useSidebar } from '../../lib/SidebarContext';

// const invoiceStatusData = [
//   { status: 'Paid', count: 120 },
//   { status: 'Pending', count: 45 },
//   { status: 'Overdue', count: 15 },
// ];

// const recentInvoices = [
//   { id: 'INV-001', client: 'Acme Corp', amount: 1250.50, date: '2023-06-15', dueDate: '2023-07-15', status: 'Paid' },
//   { id: 'INV-002', client: 'Globex Inc', amount: 890.00, date: '2023-06-18', dueDate: '2023-07-18', status: 'Pending' },
//   { id: 'INV-003', client: 'Soylent Corp', amount: 2450.75, date: '2023-06-20', dueDate: '2023-07-20', status: 'Pending' },
//   { id: 'INV-004', client: 'Initech LLC', amount: 1500.00, date: '2023-06-22', dueDate: '2023-07-22', status: 'Overdue' },
// ];

// export default function InvoicesPage() {
//   const styles = useSharedStyles();
//   const pathname = usePathname();
//   const { menuItems } = useContext(MenuContext);
//   const { isSidebarVisible } = useSidebar();
//   const currentMenuItem = menuItems.find(item => item.link === pathname);
//   const pageTitle = currentMenuItem?.menu_item || 'Invoices';

//   return (
//     <div style={styles.container}>
//       <Header />
//       <div style={styles.mainContent}>
//         <Sidebar />
//         <div style={{ 
//           marginLeft: isSidebarVisible ? '250px' : '0',
//           padding: '24px',
//           width: isSidebarVisible ? 'calc(100% - 250px)' : '100%',
//           transition: 'all 0.3s ease',
//         }}>
//           <h1 style={styles.pageTitle}>{pageTitle}</h1>

//           {/* Invoice Summary */}
//           <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//             <h2 className="text-xl font-semibold mb-4">Invoice Status</h2>
//             <div className="flex flex-col md:flex-row gap-6">
//               <div className="h-64 w-full md:w-1/2">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={invoiceStatusData}>
//                     <XAxis dataKey="status" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="count" fill="#8884d8" name="Number of Invoices" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//               <div className="w-full md:w-1/2">
//                 <div className="grid grid-cols-3 gap-4">
//                   <div className="border rounded-lg p-4 text-center">
//                     <div className="text-2xl font-bold">120</div>
//                     <div className="text-sm text-gray-600">Paid</div>
//                   </div>
//                   <div className="border rounded-lg p-4 text-center">
//                     <div className="text-2xl font-bold">45</div>
//                     <div className="text-sm text-gray-600">Pending</div>
//                   </div>
//                   <div className="border rounded-lg p-4 text-center">
//                     <div className="text-2xl font-bold">15</div>
//                     <div className="text-sm text-gray-600">Overdue</div>
//                   </div>
//                 </div>
//                 <div className="mt-4">
//                   <div className="flex justify-between mb-1">
//                     <span>Total Outstanding:</span>
//                     <span className="font-bold">{`${process.env.NEXT_PUBLIC_CURRENCY}`}12,450.25</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Average Days to Pay:</span>
//                     <span className="font-bold">14.5 days</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Recent Invoices */}
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">Recent Invoices</h2>
//               <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//                 Create New Invoice
//               </button>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white">
//                 <thead>
//                   <tr>
//                     <th className="py-2 px-4 border-b">Invoice #</th>
//                     <th className="py-2 px-4 border-b">Client</th>
//                     <th className="py-2 px-4 border-b">Amount</th>
//                     <th className="py-2 px-4 border-b">Date</th>
//                     <th className="py-2 px-4 border-b">Due Date</th>
//                     <th className="py-2 px-4 border-b">Status</th>
//                     <th className="py-2 px-4 border-b">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {recentInvoices.map((invoice, index) => (
//                     <tr key={index}>
//                       <td className="py-2 px-4 border-b">{invoice.id}</td>
//                       <td className="py-2 px-4 border-b">{invoice.client}</td>
//                       <td className="py-2 px-4 border-b">{`${process.env.NEXT_PUBLIC_CURRENCY}`}{invoice.amount.toFixed(2)}</td>
//                       <td className="py-2 px-4 border-b">{invoice.date}</td>
//                       <td className="py-2 px-4 border-b">{invoice.dueDate}</td>
//                       <td className="py-2 px-4 border-b">
//                         <span className={`px-2 py-1 rounded text-xs ${
//                           invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
//                           invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
//                           'bg-red-100 text-red-800'
//                         }`}>
//                           {invoice.status}
//                         </span>
//                       </td>
//                       <td className="py-2 px-4 border-b">
//                         <button className="text-blue-600 hover:underline mr-2">View</button>
//                         <button className="text-gray-600 hover:underline">PDF</button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// // ***************************