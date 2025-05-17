'use client';
import React, { useState, useEffect, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import { useSharedStyles } from '../../sharedStyles';
import { usePathname } from 'next/navigation';
import { MenuContext } from '../../lib/MenuContext';
import { useSidebar } from '../../lib/SidebarContext';
import { FaUserPlus, FaTasks, FaChartBar, FaCalendarAlt, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import OnboardingList from './components/onboarding-list';
import OnboardingTasks from './components/onboarding-tasks';
import NewOnboardingForm from './components/new-onboarding-form';
import OnboardingStats from './components/onboarding-stats';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function OnboardingPage() {
  const styles = useSharedStyles();
  const pathname = usePathname();
  const { menuItems } = useContext(MenuContext);
  const { isSidebarVisible } = useSidebar();
  const currentMenuItem = menuItems.find(item => item.link === pathname);
  const pageTitle = currentMenuItem?.menu_item || 'Onboarding';
  const [activeTab, setActiveTab] = useState('dashboard');
  const [onboardingData, setOnboardingData] = useState([]);
  const [onboardingStats, setOnboardingStats] = useState(null);
  const [upcomingOnboardings, setUpcomingOnboardings] = useState([]);
  const [selectedOnboarding, setSelectedOnboarding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOnboardingData = async () => {
    try {
      setLoading(true);
      const [statsRes, upcomingRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr/onboarding/stats`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr/onboarding/upcoming`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);
      setOnboardingStats(statsRes.data);
      setUpcomingOnboardings(upcomingRes.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOnboardings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr/onboarding`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      setOnboardingData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchOnboardingData();
    } else if (activeTab === 'onboardings') {
      fetchAllOnboardings();
    }
  }, [activeTab]);

  const handleOnboardingSelect = (onboarding) => {
    setSelectedOnboarding(onboarding);
    setActiveTab('tasks');
  };

  const handleTaskUpdate = () => {
    if (selectedOnboarding) {
      fetchOnboardingData();
      fetchAllOnboardings();
    }
  };

  const handleNewOnboarding = () => {
    setActiveTab('new');
  };

  const handleOnboardingCreated = () => {
    setActiveTab('onboardings');
    fetchOnboardingData();
    fetchAllOnboardings();
  };

  if (loading) {
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
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="animate-spin text-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-2 px-4 font-medium flex items-center gap-2 ${activeTab === 'dashboard' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <FaChartBar /> Dashboard
            </button>
            <button
              className={`py-2 px-4 font-medium flex items-center gap-2 ${activeTab === 'onboardings' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('onboardings')}
            >
              <FaUserPlus /> Onboardings
            </button>
            <button
              className={`py-2 px-4 font-medium flex items-center gap-2 ${activeTab === 'tasks' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => selectedOnboarding && setActiveTab('tasks')}
              disabled={!selectedOnboarding}
            >
              <FaTasks /> Tasks
            </button>
            <button
              className={`py-2 px-4 font-medium flex items-center gap-2 ${activeTab === 'new' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={handleNewOnboarding}
            >
              <FaCalendarAlt /> New Onboarding
            </button>
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && onboardingStats && (
            <div className="space-y-6">
              <OnboardingStats stats={onboardingStats} upcoming={upcomingOnboardings} />
            </div>
          )}

          {/* Onboardings Tab */}
          {activeTab === 'onboardings' && (
            <OnboardingList 
              onboardings={onboardingData} 
              onSelect={handleOnboardingSelect}
            />
          )}

          {/* Tasks Tab */}
          {activeTab === 'tasks' && selectedOnboarding && (
            <OnboardingTasks 
              onboarding={selectedOnboarding} 
              onTaskUpdate={handleTaskUpdate}
            />
          )}

          {/* New Onboarding Tab */}
          {activeTab === 'new' && (
            <NewOnboardingForm 
              onSuccess={handleOnboardingCreated}
              onCancel={() => setActiveTab('dashboard')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
// **********************************



// 'use client';
// import React, { useContext } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import Header from '../../components/header';
// import Sidebar from '../../components/sidebar';
// import { useSharedStyles } from '../../sharedStyles';
// import { usePathname } from 'next/navigation';
// import { MenuContext } from '../../lib/MenuContext';
// import { useSidebar } from '../../lib/SidebarContext';

// const onboardingData = [
//   { stage: 'Paperwork', completed: 85, pending: 15 },
//   { stage: 'Training', completed: 65, pending: 35 },
//   { stage: 'Equipment', completed: 90, pending: 10 },
//   { stage: 'Orientation', completed: 70, pending: 30 },
// ];

// const newHires = [
//   { name: 'Alex Johnson', position: 'Developer', startDate: '2023-06-15', progress: 75 },
//   { name: 'Sarah Williams', position: 'Designer', startDate: '2023-06-20', progress: 60 },
//   { name: 'Michael Brown', position: 'Marketer', startDate: '2023-06-25', progress: 45 },
// ];

// export default function OnboardingPage() {
//   const styles = useSharedStyles();
//   const pathname = usePathname();
//   const { menuItems } = useContext(MenuContext);
//   const { isSidebarVisible } = useSidebar();
//   const currentMenuItem = menuItems.find(item => item.link === pathname);
//   const pageTitle = currentMenuItem?.menu_item || 'Onboarding';

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

//           {/* Onboarding Progress */}
//           <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//             <h2 className="text-xl font-semibold mb-4">Onboarding Progress</h2>
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={onboardingData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="stage" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="completed" fill="#4CAF50" name="Completed (%)" />
//                   <Bar dataKey="pending" fill="#F44336" name="Pending (%)" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Current Onboarding Tasks */}
//           <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//             <h2 className="text-xl font-semibold mb-4">Current Onboarding Tasks</h2>
//             <div className="space-y-4">
//               {[
//                 { task: 'Complete tax forms', due: 'Today', assigned: 'Alex Johnson', status: 'Pending' },
//                 { task: 'IT equipment setup', due: 'Tomorrow', assigned: 'Sarah Williams', status: 'In Progress' },
//                 { task: 'Company orientation', due: 'In 2 days', assigned: 'Michael Brown', status: 'Scheduled' },
//                 { task: 'Team introductions', due: 'In 3 days', assigned: 'All new hires', status: 'Pending' },
//               ].map((task, index) => (
//                 <div key={index} className="border rounded-lg p-4">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <h3 className="font-medium">{task.task}</h3>
//                       <p className="text-sm text-gray-600">Assigned to: {task.assigned}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-sm">{task.due}</p>
//                       <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
//                         task.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
//                         task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
//                         'bg-green-100 text-green-800'
//                       }`}>
//                         {task.status}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* New Hires Progress */}
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-semibold mb-4">New Hires Progress</h2>
//             <div className="space-y-4">
//               {newHires.map((hire, index) => (
//                 <div key={index} className="border rounded-lg p-4">
//                   <div className="flex justify-between items-center mb-2">
//                     <div>
//                       <h3 className="font-medium">{hire.name}</h3>
//                       <p className="text-sm text-gray-600">{hire.position} • Started {hire.startDate}</p>
//                     </div>
//                     <span className="font-bold">{hire.progress}%</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2.5">
//                     <div 
//                       className="h-2.5 rounded-full bg-blue-600" 
//                       style={{ width: `${hire.progress}%` }}
//                     ></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }