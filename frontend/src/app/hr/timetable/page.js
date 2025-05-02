'use client';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { generatePdf } from '../../utils/generatePdf';
import { useWebSocket } from '../../lib/WebSocketContext';
import {
  FaSearch, FaCommentDots, FaBell, FaCog, FaUserCircle, FaHome, FaBox, FaList, FaStore, FaWallet, FaPlus, FaSignOutAlt,
} from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { useSidebar } from '../../lib/SidebarContext';
import { MenuContext } from '../../lib/MenuContext';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import { useSharedStyles } from '../../sharedStyles';

const TimetablePage = () => {
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
  
  const styles = useSharedStyles();
  const pathname = usePathname();
  const { menuItems } = useContext(MenuContext);
  const { isSidebarVisible } = useSidebar();

  const currentMenuItem = menuItems.find(item => item.link === pathname);
  const pageTitle = currentMenuItem?.link || currentMenuItem?.menu_item || 'Untitled Page';

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

          {/* Existing task management UI */}
          <div className="p-6 mt-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Task Management</h1>
            <button
              onClick={handleDownloadReport}
              className="bg-blue-500 text-white p-2 rounded mb-4"
            >
              Download Task Report
            </button>
            <table className="w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="p-4">Task Name</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td className="p-4">{task.name}</td>
                    <td className="p-4">{task.status}</td>
                    <td className="p-4">{task.due_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetablePage;



// 'use client'; 
// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import { generatePdf } from '../../utils/generatePdf';
// import { useWebSocket } from '../../lib/WebSocketContext';
// import {
//   FaSearch, FaCommentDots, FaBell, FaCog, FaUserCircle, FaHome, FaBox, FaList, FaStore, FaWallet, FaPlus, FaSignOutAlt,
// } from 'react-icons/fa'; // Icons from react-icons
// import { usePathname } from 'next/navigation';
// import { useSidebar } from '../../lib/SidebarContext';
// import { MenuContext } from '../../lib/MenuContext';
// import Header from '../../components/header';
// import Sidebar from '../../components/sidebar';
// import { useSharedStyles } from '../../sharedStyles';

// const timetablePage = () => {
//   const [tasks, setTasks] = useState([]);
//   const { socket, sendMessage } = useWebSocket();
  
//   const styles = useSharedStyles();
//   const pathname = usePathname();
//   const { menuItems } = useContext(MenuContext);
//   const { isSidebarVisible, toggleSidebar } = useSidebar();

//   // Find the matching menu item
//   const currentMenuItem = menuItems.find(item => item.link === pathname);
//   const pageTitle = currentMenuItem?.link || currentMenuItem?.menu_item || 'Untitled Page';


//   useEffect(() => {
//     if (socket) {
//       socket.onmessage = (event) => {
//         console.log('Received:', event.data);
//       };
//     }
//   }, [socket]);

//   useEffect(() => {
//     const fetchTasks = async () => {
//       const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         },
//       });
//       setTasks(response.data);
//     };
//     fetchTasks();
//   }, []);

//   const handleDownloadReport = async () => {
//     const pdfBytes = await generatePdf(tasks);
//     const blob = new Blob([pdfBytes], { type: 'application/pdf' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = 'task_report.pdf';
//     link.click();
//   };

//   const handleCreateTask = () => {
//     const newTask = {
//       id: Date.now(),
//       name: `Task ${Math.floor(Math.random() * 100)}`,
//       status: 'Pending',
//       due_date: new Date().toLocaleDateString()
//     };

//     // Send to server via WebSocket
//     sendMessage({
//       type: 'NEW_TASK',
//       payload: newTask
//     });

//     // Update local state
//     setTasks(prev => [...prev, newTask]);
//   };
//   const handleDeleteTask = (taskId) => {
//     // Send to server via WebSocket
//     sendMessage({
//       type: 'DELETE_TASK',
//       payload: { id: taskId }
//     });

//     // Update local state
//     setTasks(prev => prev.filter(task => task.id !== taskId));
//   }
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
//           <h1 style={styles.pageTitle}>{pageTitle}</h1>

//           {/* TODO */}
//           <div className="p-6">
//             <h1 className="text-2xl font-bold mb-6">Task Management</h1>
//             <div>
//               {/* <button onClick={() => sendMessage('Hello from client!')}>Send Message</button> */}
//               <button onClick={handleCreateTask}>Send Message</button>
//             </div>
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

// export default timetablePage;