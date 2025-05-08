'use client';
import React, { useState, useEffect, useContext } from 'react';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import { useSharedStyles } from '../../sharedStyles';
import { usePathname } from 'next/navigation';
import { MenuContext } from '../../lib/MenuContext';
import { useSidebar } from '../../lib/SidebarContext';
import axios from 'axios';
import { generatePdf } from '../../utils/generatePdf';
import { useWebSocket } from '../../lib/WebSocketContext';
import {
  FaSearch, FaCommentDots, FaBell, FaCog, FaUserCircle, FaHome, FaBox, FaList, FaStore, FaWallet, FaPlus, FaSignOutAlt,
} from 'react-icons/fa';


const scheduleData = [
  { 
    day: 'Monday', 
    shifts: [
      { time: '09:00 - 17:00', employees: 12, department: 'All' },
      { time: '14:00 - 22:00', employees: 8, department: 'Support' }
    ] 
  },
  { 
    day: 'Tuesday', 
    shifts: [
      { time: '09:00 - 17:00', employees: 15, department: 'All' },
      { time: '12:00 - 20:00', employees: 6, department: 'Sales' }
    ] 
  },
  { 
    day: 'Wednesday', 
    shifts: [
      { time: '09:00 - 17:00', employees: 14, department: 'All' },
      { time: '08:00 - 16:00', employees: 5, department: 'Operations' }
    ] 
  },
  { 
    day: 'Thursday', 
    shifts: [
      { time: '09:00 - 17:00', employees: 13, department: 'All' },
      { time: '10:00 - 18:00', employees: 7, department: 'Marketing' }
    ] 
  },
  { 
    day: 'Friday', 
    shifts: [
      { time: '09:00 - 17:00', employees: 11, department: 'All' },
      { time: '16:00 - 00:00', employees: 4, department: 'Support' }
    ] 
  },
];

export default function TimetablePage() {
  const styles = useSharedStyles();
  const pathname = usePathname();
  const { menuItems } = useContext(MenuContext);
  const { isSidebarVisible } = useSidebar();
  const currentMenuItem = menuItems.find(item => item.link === pathname);
  const pageTitle = currentMenuItem?.menu_item || 'Timetable';
  // const pageTitle = currentMenuItem?.link || currentMenuItem?.menu_item || 'Timetable';

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [notificationData, setNotificationData] = useState({
    title: '',
    message: '',
    type: 'info'
  });
  const { socket, sendMessage } = useWebSocket();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) setCurrentUserId(user.id);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);
  

  const handleDownloadReport = async () => {
    const pdfBytes = await generatePdf(tasks);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'task_report.pdf';
    link.click();
  };

  const handleSendNotification = async (scope = 'single') => {
    try {
      let userIds = [];
      
      if (scope === 'single' && selectedUsers.length > 0) {
        userIds = [selectedUsers[0]];
      } else if (scope === 'multiple' && selectedUsers.length > 0) {
        userIds = selectedUsers;
      } else if (scope === 'all') {
        userIds = users.map(user => user.id);
      }

      if (userIds.length === 0) {
        alert('Please select at least one user');
        return;
      }

      const notificationPayload = {
        userIds,
        title: notificationData.title || `Test ${scope} notification`,
        message: notificationData.message || `This is a test ${scope} notification`,
        type: notificationData.type,
        metadata: {
          senderId: currentUserId,
          source: 'timetable-page',
          scope: scope,
          timestamp: new Date().toISOString()
        }
      };

      // Option 1: Send via HTTP API
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications`,
        notificationPayload,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Option 2: Send via WebSocket if you want real-time
      if (socket?.readyState === WebSocket.OPEN) {
        sendMessage({
          type: 'CREATE_NOTIFICATION',
          payload: notificationPayload
        });
      }

      console.log('Notification sent:', response?.data);
      alert(`Notification sent successfully to ${userIds.length} user(s)`);
      
      // Reset form
      setNotificationData({
        title: '',
        message: '',
        type: 'info'
      });
      setSelectedUsers([]);

    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification');
    }
  };

  // const handleUserSelection = (userId) => {
  //   setSelectedUsers(prev => 
  //     prev.includes(userId) 
  //       ? prev.filter(id => id !== userId) 
  //       : [...prev, userId]
  //   );
  // };
  // Updated user selection with better type safety
  const handleUserSelection = (userId) => {
    setSelectedUsers(prev => {
      const newSelection = prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId];
      return newSelection;
    });
  };

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

          {/* Weekly Schedule */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Weekly Schedule</h2>
              <div className="flex space-x-2">
                <button className="border px-3 py-1 rounded">Previous</button>
                <span className="px-3 py-1">Week of June 26, 2023</span>
                <button className="border px-3 py-1 rounded">Next</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-3 px-4 border-b text-left">Day</th>
                    <th className="py-3 px-4 border-b text-left">Shift Times</th>
                    <th className="py-3 px-4 border-b text-left">Employees</th>
                    <th className="py-3 px-4 border-b text-left">Department</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleData.map((day, index) => (
                    <React.Fragment key={index}>
                      {day.shifts.map((shift, shiftIndex) => (
                        <tr key={`${index}-${shiftIndex}`} className={shiftIndex === 0 ? 'border-t' : ''}>
                          {shiftIndex === 0 && (
                            <td className="py-3 px-4 border-b" rowSpan={day.shifts.length}>
                              {day.day}
                            </td>
                          )}
                          <td className="py-3 px-4 border-b">{shift.time}</td>
                          <td className="py-3 px-4 border-b">{shift.employees}</td>
                          <td className="py-3 px-4 border-b">{shift.department}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Shift Coverage */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Shift Coverage</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { shift: 'Morning (9AM-5PM)', coverage: 'Fully Staffed', employees: 15, needed: 15 },
                { shift: 'Evening (2PM-10PM)', coverage: 'Understaffed', employees: 8, needed: 10 },
                { shift: 'Night (10PM-6AM)', coverage: 'Not Staffed', employees: 0, needed: 5 },
              ].map((shift, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-medium">{shift.shift}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className={`font-medium ${
                      shift.coverage === 'Fully Staffed' ? 'text-green-600' :
                      shift.coverage === 'Understaffed' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {shift.coverage}
                    </span>
                    <span className="text-sm text-gray-600">
                      {shift.employees}/{shift.needed} employees
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className={`h-2.5 rounded-full ${
                        shift.coverage === 'Fully Staffed' ? 'bg-green-600' :
                        shift.coverage === 'Understaffed' ? 'bg-yellow-600' : 'bg-red-600'
                      }`} 
                      style={{ width: `${(shift.employees / shift.needed) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time Off Requests */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Time Off Requests</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                New Request
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Employee</th>
                    <th className="py-2 px-4 border-b">Dates</th>
                    <th className="py-2 px-4 border-b">Type</th>
                    <th className="py-2 px-4 border-b">Status</th>
                    <th className="py-2 px-4 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'John Doe', dates: 'Jul 5-7, 2023', type: 'Vacation', status: 'Pending' },
                    { name: 'Jane Smith', dates: 'Jul 10-12, 2023', type: 'Sick Leave', status: 'Approved' },
                    { name: 'Robert Johnson', dates: 'Jul 15-19, 2023', type: 'Personal', status: 'Rejected' },
                  ].map((request, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{request.name}</td>
                      <td className="py-2 px-4 border-b">{request.dates}</td>
                      <td className="py-2 px-4 border-b">{request.type}</td>
                      <td className="py-2 px-4 border-b">
                        <span className={`px-2 py-1 rounded text-xs ${
                          request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b">
                        {request.status === 'Pending' && (
                          <>
                            <button className="text-green-600 hover:underline mr-2">Approve</button>
                            <button className="text-red-600 hover:underline">Reject</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Notification Testing</h2>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Notification Content</h3>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={notificationData.title}
                    onChange={(e) => setNotificationData({...notificationData, title: e.target.value})}
                    placeholder="Notification title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <textarea
                    className="w-full p-2 border rounded"
                    value={notificationData.message}
                    onChange={(e) => setNotificationData({...notificationData, message: e.target.value})}
                    placeholder="Notification message"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={notificationData.type}
                    onChange={(e) => setNotificationData({...notificationData, type: e.target.value})}
                  >
                    <option value="info">Information</option>
                    <option value="task">Task</option>
                    <option value="alert">Alert</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                {
                  notificationData.type==='task'&&(
                    <div>
                      <label className="block text-gray-700 mb-2">Due date</label>
                      <input
                        type="datetime-local"
                        className="w-full p-2 border rounded"
                        value={notificationData.due_date}
                        onChange={(e) => setNotificationData({...notificationData, due_date: e.target.value})}
                        required
                      />
                    </div>
                  )
                }
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Select Users</h3>
              <div className="max-h-60 overflow-y-auto border rounded p-2">
                {users.map(user => (
                  <div key={user.id} className="flex items-center p-2 hover:bg-gray-50">
                    <input
                      type="checkbox"
                      id={`user-${user.id}`}
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserSelection(user.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`user-${user.id}`} className="flex-1">
                      {user.username} ({user.email})
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Selected: {selectedUsers.length} user(s)
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => handleSendNotification('single')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Send to First Selected
              </button>
              <button
                onClick={() => handleSendNotification('multiple')}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Send to All Selected
              </button>
              <button
                onClick={() => handleSendNotification('all')}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
              >
                Send to All Users
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



// 'use client';
// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import { generatePdf } from '../../utils/generatePdf';
// import { useWebSocket } from '../../lib/WebSocketContext';
// import {
//   FaSearch, FaCommentDots, FaBell, FaCog, FaUserCircle, FaHome, FaBox, FaList, FaStore, FaWallet, FaPlus, FaSignOutAlt,
// } from 'react-icons/fa';
// import { usePathname } from 'next/navigation';
// import { useSidebar } from '../../lib/SidebarContext';
// import { MenuContext } from '../../lib/MenuContext';
// import Header from '../../components/header';
// import Sidebar from '../../components/sidebar';
// import { useSharedStyles } from '../../sharedStyles';

// const TimetablePage = () => {
//   const [tasks, setTasks] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [notificationData, setNotificationData] = useState({
//     title: '',
//     message: '',
//     type: 'info'
//   });
//   const { socket, sendMessage } = useWebSocket();
  
//   const styles = useSharedStyles();
//   const pathname = usePathname();
//   const { menuItems } = useContext(MenuContext);
//   const { isSidebarVisible } = useSidebar();

//   const currentMenuItem = menuItems.find(item => item.link === pathname);
//   const pageTitle = currentMenuItem?.link || currentMenuItem?.menu_item || 'Untitled Page';

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     if (user) setCurrentUserId(user.id);
//   }, []);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           },
//         });
//         setUsers(response.data);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     };

//     fetchUsers();
//   }, []);
  

//   const handleDownloadReport = async () => {
//     const pdfBytes = await generatePdf(tasks);
//     const blob = new Blob([pdfBytes], { type: 'application/pdf' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = 'task_report.pdf';
//     link.click();
//   };

//   const handleSendNotification = async (scope = 'single') => {
//     try {
//       let userIds = [];
      
//       if (scope === 'single' && selectedUsers.length > 0) {
//         userIds = [selectedUsers[0]];
//       } else if (scope === 'multiple' && selectedUsers.length > 0) {
//         userIds = selectedUsers;
//       } else if (scope === 'all') {
//         userIds = users.map(user => user.id);
//       }

//       if (userIds.length === 0) {
//         alert('Please select at least one user');
//         return;
//       }

//       const notificationPayload = {
//         userIds,
//         title: notificationData.title || `Test ${scope} notification`,
//         message: notificationData.message || `This is a test ${scope} notification`,
//         type: notificationData.type,
//         metadata: {
//           senderId: currentUserId,
//           source: 'timetable-page',
//           scope: scope,
//           timestamp: new Date().toISOString()
//         }
//       };

//       // Option 1: Send via HTTP API
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/notifications`,
//         notificationPayload,
//         {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           },
//         }
//       );

//       // Option 2: Send via WebSocket if you want real-time
//       if (socket?.readyState === WebSocket.OPEN) {
//         sendMessage({
//           type: 'CREATE_NOTIFICATION',
//           payload: notificationPayload
//         });
//       }

//       console.log('Notification sent:', response?.data);
//       alert(`Notification sent successfully to ${userIds.length} user(s)`);
      
//       // Reset form
//       setNotificationData({
//         title: '',
//         message: '',
//         type: 'info'
//       });
//       setSelectedUsers([]);

//     } catch (error) {
//       console.error('Error sending notification:', error);
//       alert('Failed to send notification');
//     }
//   };

//   // const handleUserSelection = (userId) => {
//   //   setSelectedUsers(prev => 
//   //     prev.includes(userId) 
//   //       ? prev.filter(id => id !== userId) 
//   //       : [...prev, userId]
//   //   );
//   // };
//   // Updated user selection with better type safety
//   const handleUserSelection = (userId) => {
//     setSelectedUsers(prev => {
//       const newSelection = prev.includes(userId)
//         ? prev.filter(id => id !== userId)
//         : [...prev, userId];
//       return newSelection;
//     });
//   };

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

//           <div className="p-6 bg-white rounded-lg shadow-md">
//             <h2 className="text-xl font-bold mb-4">Notification Testing</h2>
            
//             <div className="mb-6">
//               <h3 className="font-semibold mb-2">Notification Content</h3>
//               <div className="grid grid-cols-1 gap-4 mb-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Title</label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border rounded"
//                     value={notificationData.title}
//                     onChange={(e) => setNotificationData({...notificationData, title: e.target.value})}
//                     placeholder="Notification title"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Message</label>
//                   <textarea
//                     className="w-full p-2 border rounded"
//                     value={notificationData.message}
//                     onChange={(e) => setNotificationData({...notificationData, message: e.target.value})}
//                     placeholder="Notification message"
//                     rows={3}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Type</label>
//                   <select
//                     className="w-full p-2 border rounded"
//                     value={notificationData.type}
//                     onChange={(e) => setNotificationData({...notificationData, type: e.target.value})}
//                   >
//                     <option value="info">Information</option>
//                     <option value="task">Task</option>
//                     <option value="alert">Alert</option>
//                     <option value="urgent">Urgent</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             <div className="mb-6">
//               <h3 className="font-semibold mb-2">Select Users</h3>
//               <div className="max-h-60 overflow-y-auto border rounded p-2">
//                 {users.map(user => (
//                   <div key={user.id} className="flex items-center p-2 hover:bg-gray-50">
//                     <input
//                       type="checkbox"
//                       id={`user-${user.id}`}
//                       checked={selectedUsers.includes(user.id)}
//                       onChange={() => handleUserSelection(user.id)}
//                       className="mr-2"
//                     />
//                     <label htmlFor={`user-${user.id}`} className="flex-1">
//                       {user.username} ({user.email})
//                     </label>
//                   </div>
//                 ))}
//               </div>
//               <p className="text-sm text-gray-500 mt-1">
//                 Selected: {selectedUsers.length} user(s)
//               </p>
//             </div>

//             <div className="flex flex-wrap gap-4">
//               <button
//                 onClick={() => handleSendNotification('single')}
//                 className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
//               >
//                 Send to First Selected
//               </button>
//               <button
//                 onClick={() => handleSendNotification('multiple')}
//                 className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
//               >
//                 Send to All Selected
//               </button>
//               <button
//                 onClick={() => handleSendNotification('all')}
//                 className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
//               >
//                 Send to All Users
//               </button>
//             </div>
//           </div>

//           {/* Existing task management UI */}
//           <div className="p-6 mt-6 bg-white rounded-lg shadow-md">
//             <h1 className="text-2xl font-bold mb-6">Task Management</h1>
//             <button
//               onClick={handleDownloadReport}
//               className="bg-blue-500 text-white p-2 rounded mb-4"
//             >
//               Download Task Report
//             </button>
//             <table className="w-full bg-white rounded-lg shadow-md">
//               <thead>
//                 <tr>
//                   <th className="p-4">Task Name</th>
//                   <th className="p-4">Status</th>
//                   <th className="p-4">Due Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {tasks.map((task) => (
//                   <tr key={task.id}>
//                     <td className="p-4">{task.name}</td>
//                     <td className="p-4">{task.status}</td>
//                     <td className="p-4">{task.due_date}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TimetablePage;