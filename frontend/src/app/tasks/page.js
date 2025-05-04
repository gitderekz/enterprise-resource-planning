'use client';
import React, { useState, useEffect, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { generatePdf } from '../utils/generatePdf';
import { useWebSocket } from '../lib/WebSocketContext';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import { useSharedStyles } from '../sharedStyles';
import { usePathname } from 'next/navigation';
import { MenuContext } from '../lib/MenuContext';
import { useSidebar } from '../lib/SidebarContext';
import { toast } from 'react-toastify';

const taskStatusData = [
  { status: 'Completed', count: 12 },
  { status: 'In Progress', count: 8 },
  { status: 'Pending', count: 5 },
];

export default function TasksPage() {
  const styles = useSharedStyles();
  const pathname = usePathname();
  const { menuItems } = useContext(MenuContext);
  const { isSidebarVisible } = useSidebar();
  const currentMenuItem = menuItems.find(item => item.link === pathname);
  const pageTitle = currentMenuItem?.menu_item || 'Tasks';
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket, sendMessage } = useWebSocket();

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'NEW_TASK') {
          setTasks(prev => [...prev, message.payload]);
        } else if (message.type === 'DELETE_TASK') {
          setTasks(prev => prev.filter(task => task.id !== message.payload.id));
        }
      };
    }
  }, [socket]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTasks(response.data);
      } catch (error) {
        toast.error('Failed to load tasks');
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleDownloadReport = async () => {
    try {
      const pdfBytes = await generatePdf(tasks);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'task_report.pdf';
      link.click();
      toast.success('Task report downloaded');
    } catch (error) {
      toast.error('Failed to generate report');
      console.error('Error generating PDF:', error);
    }
  };

  const handleCreateTask = async () => {
    const newTask = {
      id: Date.now(),
      name: `Task ${Math.floor(Math.random() * 100)}`,
      status: 'Pending',
      due_date: new Date().toLocaleDateString()
    };

    try {
      // Send to server via WebSocket
      sendMessage({
        type: 'NEW_TASK',
        payload: newTask
      });

      // Also send to API for persistence
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, newTask, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      toast.success('Task created successfully');
    } catch (error) {
      toast.error('Failed to create task');
      console.error('Error creating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      // Send to server via WebSocket
      sendMessage({
        type: 'DELETE_TASK',
        payload: { id: taskId }
      });

      // Also delete from API
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
      console.error('Error deleting task:', error);
    }
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

          {/* Task Overview */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Task Overview</h2>
              <div className="flex gap-2">
                <button 
                  onClick={handleCreateTask}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Create Task
                </button>
                <button 
                  onClick={handleDownloadReport}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Download Report
                </button>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskStatusData}>
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name="Number of Tasks" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Task List */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Task List</h2>
            {loading ? (
              <div className="text-center py-8">Loading tasks...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Task Name</th>
                      <th className="py-2 px-4 border-b">Status</th>
                      <th className="py-2 px-4 border-b">Due Date</th>
                      <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.length > 0 ? (
                      tasks.map((task) => (
                        <tr key={task.id}>
                          <td className="py-2 px-4 border-b">{task.name}</td>
                          <td className="py-2 px-4 border-b">
                            <span className={`px-2 py-1 rounded text-xs ${
                              task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="py-2 px-4 border-b">{task.due_date}</td>
                          <td className="py-2 px-4 border-b">
                            <button 
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-4 text-center text-gray-500">No tasks found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}