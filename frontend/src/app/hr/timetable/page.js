'use client'; 
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { generatePdf } from '../../utils/generatePdf';
import { useWebSocket } from '../../lib/WebSocketContext';
import {
  FaSearch, FaCommentDots, FaBell, FaCog, FaUserCircle, FaHome, FaBox, FaList, FaStore, FaWallet, FaPlus, FaSignOutAlt,
} from 'react-icons/fa'; // Icons from react-icons
import { usePathname } from 'next/navigation';
import { useSidebar } from '../../lib/SidebarContext';
import { MenuContext } from '../../lib/MenuContext';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import { useSharedStyles } from '../../sharedStyles';

const timetablePage = () => {
  const [tasks, setTasks] = useState([]);
  const { socket, sendMessage } = useWebSocket();
  
  const styles = useSharedStyles();
  const pathname = usePathname();
  const { menuItems } = useContext(MenuContext);
  const { isSidebarVisible, toggleSidebar } = useSidebar();

  // Find the matching menu item
  const currentMenuItem = menuItems.find(item => item.link === pathname);
  const pageTitle = currentMenuItem?.link || currentMenuItem?.menu_item || 'Untitled Page';


  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        console.log('Received:', event.data);
      };
    }
  }, [socket]);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTasks(response.data);
    };
    fetchTasks();
  }, []);

  const handleDownloadReport = async () => {
    const pdfBytes = await generatePdf(tasks);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'task_report.pdf';
    link.click();
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Sidebar */}
        <Sidebar />

        {/* Scrollable Content */}
        {/* <div style={styles.content}> */}
        <div style={{ 
          marginLeft: isSidebarVisible ? '250px' : '0',
          padding: '24px',
          width: isSidebarVisible ? 'calc(100% - 250px)' : '100%',
          transition: 'all 0.3s ease',
        }}>
          <h1 style={styles.pageTitle}>{pageTitle}</h1>

          {/* TODO */}
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Task Management</h1>
            <div>
              {/* <button onClick={() => sendMessage('Hello from client!')}>Send Message</button> */}
              <button onClick={() => sendMessage({
                type: 'NEW_TASK',
                payload: { id: 1, name: 'My Task' }
              })}>Send Message</button>
            </div>
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

export default timetablePage;