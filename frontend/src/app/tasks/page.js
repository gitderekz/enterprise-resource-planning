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
import { FaSearch, FaBell, FaCog, FaUserCircle, FaPlus, FaFileExport, FaExchangeAlt, FaCalendarAlt } from 'react-icons/fa';
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
  const [updatingTaskIds, setUpdatingTaskIds] = useState([]);
  const [activeTab, setActiveTab] = useState('tasks');
  const [timeOffRequests, setTimeOffRequests] = useState([]);

  const [newRequest, setNewRequest] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [user, setUser] = useState(null);


  useState(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  },[])
    
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
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const currentUserId = storedUser?.id;

        const [timetableRes, tasks] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/timetable/time-off/${currentUserId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`,},
          })
        ]);
        setTimeOffRequests(timetableRes.data.timeOffRequests || []);
        setTasks(tasks.data);
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

  const handleUpdateTask = async (taskId, status) => {
    setUpdatingTaskIds(prev => [...prev, taskId]);
  
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`, { status }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      const updatedTask = response.data.task;
  
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === updatedTask.id ? { ...task, status: updatedTask.status } : task
        )
      );
  
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error('Failed to update task');
      console.error('Error updating task:', error);
    } finally {
      setUpdatingTaskIds(prev => prev.filter(id => id !== taskId));
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

  // Handle time off request creation
  const handleCreateRequest = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/timetable/time-off`,
        newRequest,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      setTimeOffRequests(prev => [...prev, response.data]);
      setShowRequestModal(false);
      setNewRequest({
        startDate: '',
        endDate: '',
        reason: ''
      });
      toast.success('Time off request submitted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
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
        
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'tasks' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('tasks')}
            >
              Tasks
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'timeoff' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('timeoff')}
            >
              Time Off Requests
            </button>
          </div>

          {/* Task Overview */}
          {activeTab === 'tasks' && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Task Overview</h2>
              <div className="flex gap-2">
                {/* <button 
                  onClick={handleCreateTask}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Create Task
                </button> */}
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
          )}

          {/* Task List */}
          {activeTab === 'tasks' && (
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
                          <td className="py-2 px-4 border-b text-right">
                            <button 
                              onClick={() => handleDeleteTask(task.id)}
                              disabled={updatingTaskIds.includes(task.id)}
                              className={`text-red-600 hover:underline ${updatingTaskIds.includes(task.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              Delete
                            </button> | 
                            <button 
                              onClick={() => handleUpdateTask(task.id, 'In Progress')}
                              disabled={updatingTaskIds.includes(task.id)}
                              className={`text-blue-600 hover:underline ${updatingTaskIds.includes(task.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              Progressing
                            </button> | 
                            <button 
                              onClick={() => handleUpdateTask(task.id, 'Completed')}
                              disabled={updatingTaskIds.includes(task.id)}
                              className={`text-green-600 hover:underline ${updatingTaskIds.includes(task.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              Completed
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
          )}
          
          {/* Time Off Requests Tab */}
          {activeTab === 'timeoff' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Time Off Requests</h2>
                <button 
                  onClick={() => setShowRequestModal(true)}
                  className="flex items-center px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <FaPlus className="mr-1" /> New Request
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Employee</th>
                      <th className="py-2 px-4 border-b">Dates</th>
                      <th className="py-2 px-4 border-b">Reason</th>
                      <th className="py-2 px-4 border-b">Status</th>
                      {user.role?.name==='hr' && 
                      (<th className="py-2 px-4 border-b">Action</th>)
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {timeOffRequests.map((request, index) => (
                      <tr key={index}>
                        <td className="py-2 px-4 border-b">{request.user?.username || 'Unknown'}</td>
                        <td className="py-2 px-4 border-b">
                          {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4 border-b">{request.reason}</td>
                        <td className="py-2 px-4 border-b">
                          <span className={`px-2 py-1 rounded text-xs ${
                            request.status === 'approved' ? 'bg-green-100 text-green-800' :
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {request.status}
                          </span>
                        </td>
                        {user.role?.name==='hr' && (
                          <td className="py-2 px-4 border-b">
                            {request.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => handleApproveRequest(request.id, true)}
                                  className="text-green-600 hover:underline mr-2"
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => handleApproveRequest(request.id, false)}
                                  className="text-red-600 hover:underline"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </td>
                          )
                        }
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Time Off Request Modal */}
          {showRequestModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">New Time Off Request</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded"
                      value={newRequest.startDate}
                      onChange={(e) => setNewRequest({...newRequest, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded"
                      value={newRequest.endDate}
                      onChange={(e) => setNewRequest({...newRequest, endDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Reason</label>
                    <textarea
                      className="w-full p-2 border rounded"
                      value={newRequest.reason}
                      onChange={(e) => setNewRequest({...newRequest, reason: e.target.value})}
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateRequest}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}