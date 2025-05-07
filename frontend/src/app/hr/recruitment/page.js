// // app/hr/recruitment/page.js
// 'use client';
// import React, { useContext, useEffect, useState } from 'react';
// import Header from '../../components/header';
// import Sidebar from '../../components/sidebar';
// import { useSharedStyles } from '../../sharedStyles';
// import { usePathname } from 'next/navigation';
// import { MenuContext } from '../../lib/MenuContext';
// import { useSidebar } from '../../lib/SidebarContext';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import 'react-tabs/style/react-tabs.css';
// import RecruitmentDashboard from './components/RecruitmentDashboard';
// import JobRequisitions from './components/JobRequisitions';
// import CandidatePool from './components/CandidatePool';
// import InterviewManagement from './components/InterviewManagement';
// import OfferManagement from './components/OfferManagement';
// import Reports from './components/Reports';

// const RecruitmentPage = () => {
//   const [activeTab, setActiveTab] = useState(0);
//   const [stats, setStats] = useState({
//     openPositions: 0,
//     candidates: 0,
//     interviews: 0,
//     hires: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const styles = useSharedStyles();
//   const pathname = usePathname();
//   const { menuItems } = useContext(MenuContext);
//   const { isSidebarVisible } = useSidebar();
//   const currentMenuItem = menuItems.find(item => item.link === pathname);
//   const pageTitle = currentMenuItem?.menu_item || 'Recruitment';

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr/recruitment/stats`);
//         setStats(response.data);
//       } catch (error) {
//         console.error('Error fetching stats:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStats();
//   }, []);

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
          
//           {!loading && <RecruitmentDashboard stats={stats} />}

//           <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)}>
//             <TabList className="flex border-b border-gray-200">
//               <Tab className="px-4 py-2 cursor-pointer focus:outline-none">Job Requisitions</Tab>
//               <Tab className="px-4 py-2 cursor-pointer focus:outline-none">Candidate Pool</Tab>
//               <Tab className="px-4 py-2 cursor-pointer focus:outline-none">Interview Management</Tab>
//               <Tab className="px-4 py-2 cursor-pointer focus:outline-none">Offer Management</Tab>
//               <Tab className="px-4 py-2 cursor-pointer focus:outline-none">Reports</Tab>
//             </TabList>

//             <TabPanel>
//               <JobRequisitions />
//             </TabPanel>
//             <TabPanel>
//               <CandidatePool />
//             </TabPanel>
//             <TabPanel>
//               <InterviewManagement />
//             </TabPanel>
//             <TabPanel>
//               <OfferManagement />
//             </TabPanel>
//             <TabPanel>
//               <Reports />
//             </TabPanel>
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default RecruitmentPage;



// app/hr/recruitment/page.js
'use client';
import React, { useContext, useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import { useSharedStyles } from '../../sharedStyles';
import { usePathname } from 'next/navigation';
import { MenuContext } from '../../lib/MenuContext';
import { useSidebar } from '../../lib/SidebarContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import RecruitmentDashboard from './components/RecruitmentDashboard';
import JobRequisitions from './components/JobRequisitions';
import CandidatePool from './components/CandidatePool';
import InterviewManagement from './components/InterviewManagement';
import OfferManagement from './components/OfferManagement';
import Reports from './components/Reports';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RecruitmentPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState({
    openPositions: 0,
    candidates: 0,
    interviews: 0,
    hires: 0
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const styles = useSharedStyles();
  const pathname = usePathname();
  const { menuItems } = useContext(MenuContext);
  const { isSidebarVisible } = useSidebar();
  const currentMenuItem = menuItems.find(item => item.link === pathname);
  const pageTitle = currentMenuItem?.menu_item || 'Recruitment';
  const [applicants, setApplicants] = useState([]);

  // useEffect(() => {
  //   const fetchApplicants = async () => {
  //     try {
  //       const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr/recruitment/applicants`);
  //       setApplicants(response.data);
  //     } catch (error) {
  //       toast.error('Failed to fetch applicants');
  //       console.error('Error fetching applicants:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchApplicants();
  // }, []);

  const statusData = [
    { name: 'New', value: applicants.filter(a => a.status === 'new').length },
    { name: 'Interview', value: applicants.filter(a => a.status === 'interview').length },
    { name: 'Offer', value: applicants.filter(a => a.status === 'offer').length },
    { name: 'Hired', value: applicants.filter(a => a.status === 'hired').length },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr/recruitment/stats`);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr/recruitment/stats`);
        setStats(response.data);
      } catch (error) {
        toast.error('Failed to load recruitment stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

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
            {/* <div className="p-6"> */}
            <h1 style={styles.pageTitle}>{pageTitle}</h1>
            {/* <h1 className="text-2xl font-bold mb-6">Recruitment Management</h1> */}
          
            {!loading && <RecruitmentDashboard stats={stats} statusData={statusData} COLORS={COLORS} />}

            <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)}>
              <TabList className="flex border-b border-gray-200">
                <Tab className="px-4 py-2 cursor-pointer focus:outline-none">Job Requisitions</Tab>
                <Tab className="px-4 py-2 cursor-pointer focus:outline-none">Candidate Pool</Tab>
                <Tab className="px-4 py-2 cursor-pointer focus:outline-none">Interview Management</Tab>
                <Tab className="px-4 py-2 cursor-pointer focus:outline-none">Offer Management</Tab>
                <Tab className="px-4 py-2 cursor-pointer focus:outline-none">Reports</Tab>
              </TabList>

              <TabPanel>
                <JobRequisitions />
              </TabPanel>
              <TabPanel>
                <CandidatePool />
              </TabPanel>
              <TabPanel>
                <InterviewManagement />
              </TabPanel>
              <TabPanel>
                <OfferManagement />
              </TabPanel>
              <TabPanel>
                <Reports />
              </TabPanel>
            </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentPage;
// *****************************



// 'use client';
// import React, { useContext, useEffect, useState } from 'react';
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import Header from '../../components/header';
// import Sidebar from '../../components/sidebar';
// import { useSharedStyles } from '../../sharedStyles';
// import { usePathname } from 'next/navigation';
// import { MenuContext } from '../../lib/MenuContext';
// import { useSidebar } from '../../lib/SidebarContext';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// export default function RecruitmentPage() {
//   const styles = useSharedStyles();
//   const pathname = usePathname();
//   const { menuItems } = useContext(MenuContext);
//   const { isSidebarVisible } = useSidebar();
//   const currentMenuItem = menuItems.find(item => item.link === pathname);
//   const pageTitle = currentMenuItem?.menu_item || 'Recruitment';
//   const [applicants, setApplicants] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // useEffect(() => {
//   //   const fetchApplicants = async () => {
//   //     try {
//   //       const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/recruitment/applicants`);
//   //       setApplicants(response.data);
//   //     } catch (error) {
//   //       toast.error('Failed to fetch applicants');
//   //       console.error('Error fetching applicants:', error);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };
//   //   fetchApplicants();
//   // }, []);

//   const statusData = [
//     { name: 'New', value: applicants.filter(a => a.status === 'new').length },
//     { name: 'Interview', value: applicants.filter(a => a.status === 'interview').length },
//     { name: 'Offer', value: applicants.filter(a => a.status === 'offer').length },
//     { name: 'Hired', value: applicants.filter(a => a.status === 'hired').length },
//   ];

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

//           {/* Recruitment Pipeline */}
//           <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//             <h2 className="text-xl font-semibold mb-4">Recruitment Pipeline</h2>
//             <div className="flex flex-col md:flex-row gap-6">
//               <div className="h-64 w-full md:w-1/2">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={statusData}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       outerRadius={80}
//                       fill="#8884d8"
//                       dataKey="value"
//                       label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                     >
//                       {statusData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//               <div className="w-full md:w-1/2">
//                 <div className="grid grid-cols-2 gap-4">
//                   {statusData.map((status, index) => (
//                     <div key={index} className="border rounded-lg p-4">
//                       <div className="text-sm text-gray-600">{status.name}</div>
//                       <div className="text-2xl font-bold mt-1">{status.value}</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Open Positions */}
//           <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">Open Positions</h2>
//               <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//                 Create Position
//               </button>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white">
//                 <thead>
//                   <tr>
//                     <th className="py-2 px-4 border-b">Position</th>
//                     <th className="py-2 px-4 border-b">Department</th>
//                     <th className="py-2 px-4 border-b">Applicants</th>
//                     <th className="py-2 px-4 border-b">Status</th>
//                     <th className="py-2 px-4 border-b">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {[...Array(3)].map((_, i) => (
//                     <tr key={i}>
//                       <td className="py-2 px-4 border-b">Position {i + 1}</td>
//                       <td className="py-2 px-4 border-b">Department {i + 1}</td>
//                       <td className="py-2 px-4 border-b">{Math.floor(Math.random() * 10) + 1}</td>
//                       <td className="py-2 px-4 border-b">
//                         <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
//                           Active
//                         </span>
//                       </td>
//                       <td className="py-2 px-4 border-b">
//                         <button className="text-blue-600 hover:underline mr-2">View</button>
//                         <button className="text-gray-600 hover:underline">Edit</button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Applicant List */}
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-semibold mb-4">Recent Applicants</h2>
//             {loading ? (
//               <div className="text-center py-8">Loading applicants...</div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full bg-white">
//                   <thead>
//                     <tr>
//                       <th className="py-2 px-4 border-b">Name</th>
//                       <th className="py-2 px-4 border-b">Position</th>
//                       <th className="py-2 px-4 border-b">Applied Date</th>
//                       <th className="py-2 px-4 border-b">Status</th>
//                       <th className="py-2 px-4 border-b">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {applicants.length > 0 ? (
//                       applicants.slice(0, 5).map((applicant) => (
//                         <tr key={applicant.id}>
//                           <td className="py-2 px-4 border-b">{applicant.name}</td>
//                           <td className="py-2 px-4 border-b">{applicant.position}</td>
//                           <td className="py-2 px-4 border-b">{new Date(applicant.appliedDate).toLocaleDateString()}</td>
//                           <td className="py-2 px-4 border-b">
//                             <span className={`px-2 py-1 rounded text-xs ${
//                               applicant.status === 'new' ? 'bg-blue-100 text-blue-800' :
//                               applicant.status === 'interview' ? 'bg-yellow-100 text-yellow-800' :
//                               applicant.status === 'offer' ? 'bg-purple-100 text-purple-800' :
//                               'bg-green-100 text-green-800'
//                             }`}>
//                               {applicant.status}
//                             </span>
//                           </td>
//                           <td className="py-2 px-4 border-b">
//                             <button className="text-blue-600 hover:underline mr-2">View</button>
//                             <button className="text-gray-600 hover:underline">Edit</button>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="5" className="py-4 text-center text-gray-500">No applicants found</td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// // *********************************



// 'use client'; 
// import React, { useContext } from 'react';
// import {
//   FaSearch, FaCommentDots, FaBell, FaCog, FaUserCircle, FaHome, FaBox, FaList, FaStore, FaWallet, FaPlus, FaSignOutAlt,
// } from 'react-icons/fa'; // Icons from react-icons
// import { usePathname } from 'next/navigation';
// import { useSidebar } from '../../lib/SidebarContext';
// import { MenuContext } from '../../lib/MenuContext';
// import Header from '../../components/header';
// import Sidebar from '../../components/sidebar';
// import { useSharedStyles } from '../../sharedStyles';

// const recruitmentPage = () => {
  
//   const styles = useSharedStyles();
//   const pathname = usePathname();
//   const { menuItems } = useContext(MenuContext);
//   const { isSidebarVisible, toggleSidebar } = useSidebar();

//   // Find the matching menu item
//   const currentMenuItem = menuItems.find(item => item.link === pathname);
//   const pageTitle = currentMenuItem?.link || currentMenuItem?.menu_item || 'Untitled Page';

//   return (
//     <div style={styles.container}>
//       {/* Header */}
//       <Header />

//       {/* Main Content */}
//       <div style={styles.mainContent}>
//         {/* Sidebar */}
//         <Sidebar />

//         {/* Scrollable Content */}
//         {/* <div style={styles.content}> */}
//         <div style={{ 
//           marginLeft: isSidebarVisible ? '250px' : '0',
//           padding: '24px',
//           width: isSidebarVisible ? 'calc(100% - 250px)' : '100%',
//           transition: 'all 0.3s ease',
//         }}>
//             <h1 style={styles.pageTitle}>{pageTitle}</h1>

//             {/* TODO */}

//         </div>
//       </div>
//     </div>
//   );
// };

// export default recruitmentPage;