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
import { FaSearch, FaBell, FaCog, FaUserCircle, FaPlus, FaFileExport, FaExchangeAlt, FaCalendarAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import CalendarView from './components/CalendarView';
import NotificationTesting from './components/NotificationTesting';

const TimetablePage = () => {
  const styles = useSharedStyles();
  const pathname = usePathname();
  const { menuItems } = useContext(MenuContext);
  const { isSidebarVisible } = useSidebar();
  const currentMenuItem = menuItems.find(item => item.link === pathname);
  const pageTitle = currentMenuItem?.menu_item || 'Timetable';
  const [activeTab, setActiveTab] = useState('schedule');
  const [timetableData, setTimetableData] = useState([]);
  const [shiftCoverage, setShiftCoverage] = useState([]);
  const [timeOffRequests, setTimeOffRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const [showCalendarView, setShowCalendarView] = useState(false);
  const [swapRequest, setSwapRequest] = useState({
    fromShiftId: '',
    toShiftId: '',
    reason: '',
    requestedToId: ''
  });
  const [showSwapModal, setShowSwapModal] = useState(false);

  const [newShift, setNewShift] = useState({
    day: 'Monday',
    startTime: '09:00',
    endTime: '17:00',
    departmentId: ''
  });
  const [newRequest, setNewRequest] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  // Fetch all necessary data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [timetableRes, coverageRes, departmentsRes, employeesRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/timetable`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/timetable/coverage`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/departments`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);

        setTimetableData(timetableRes.data.timetable);
        setShiftCoverage(coverageRes.data);
        setTimeOffRequests(timetableRes.data.timeOffRequests || []);
        setDepartments(departmentsRes.data);
        setEmployees(employeesRes.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle week navigation
  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  // Handle shift creation
  const handleCreateShift = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/timetable/shifts`,
        {
          ...newShift,
          employeeIds: selectedEmployees
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      setTimetableData(prev => {
        const dayIndex = prev.findIndex(d => d.day === newShift.day);
        if (dayIndex >= 0) {
          const updated = [...prev];
          updated[dayIndex].shifts.push(response.data);
          return updated;
        }
        return [...prev, { day: newShift.day, shifts: [response.data] }];
      });

      setShowShiftModal(false);
      setNewShift({
        day: 'Monday',
        startTime: '09:00',
        endTime: '17:00',
        departmentId: ''
      });
      setSelectedEmployees([]);
      toast.success('Shift created successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create shift');
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

  // Handle request approval
  const handleApproveRequest = async (id, approved) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/timetable/time-off/${id}/approve`,
        { approved },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      setTimeOffRequests(prev => prev.filter(req => req.id !== id));
      toast.success(`Request ${approved ? 'approved' : 'rejected'}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process request');
    }
  };

  // Export timetable
  // // const handleExport = async (format) => {
  // //   try {
  // //     window.open(
  // //       `${process.env.NEXT_PUBLIC_API_URL}/timetable/export/${format}`,
  // //       '_blank'
  // //     );
  // //   } catch (err) {
  // //     toast.error(err.response?.data?.message || 'Failed to export timetable');
  // //   }
  // // };
  
  // const handleExport = async (format) => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     if (!token) {
  //       toast.error('Please login to export');
  //       return;
  //     }

  //     // Create a temporary link to trigger download
  //     const link = document.createElement('a');
  //     link.href = `${process.env.NEXT_PUBLIC_API_URL}/timetable/export/${format}`;
  //     link.setAttribute('download', `timetable.${format}`);
  //     link.setAttribute('target', '_blank');
      
  //     // Add authorization header
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   } catch (err) {
  //     toast.error(err.response?.data?.message || 'Failed to export timetable');
  //   }
  // };
  const handleExport = async (format) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to export');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/timetable/export/${format}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `timetable.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err.message || 'Failed to export timetable');
    }
  };


  // Handle shift swap request
  const handleShiftSwap = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/timetable/shift-swap`,
        swapRequest,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      toast.success('Shift swap request submitted');
      setShowSwapModal(false);
      setSwapRequest({
        fromShiftId: '',
        toShiftId: '',
        reason: '',
        requestedToId: ''
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit swap request');
    }
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
            <h1 style={styles.pageTitle}>{pageTitle}</h1>
            <div className="flex justify-center items-center h-64">
              <p>Loading timetable data...</p>
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
            <h1 style={styles.pageTitle}>{pageTitle}</h1>
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
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
          <div className="flex justify-between items-center mb-6">
            <h1 style={styles.pageTitle}>{pageTitle}</h1>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowCalendarView(!showCalendarView)}
                className="flex items-center px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                <FaCalendarAlt className="mr-1" /> 
                {showCalendarView ? 'Table View' : 'Calendar View'}
              </button>
              <button 
                onClick={() => handleExport('pdf')}
                className="flex items-center px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                <FaFileExport className="mr-1" /> PDF
              </button>
              <button 
                onClick={() => handleExport('excel')}
                className="flex items-center px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <FaFileExport className="mr-1" /> Excel
              </button>
              <button 
                onClick={() => handleExport('csv')}
                className="flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <FaFileExport className="mr-1" /> CSV
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'schedule' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('schedule')}
            >
              Weekly Schedule
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'coverage' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('coverage')}
            >
              Shift Coverage
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'timeoff' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('timeoff')}
            >
              Time Off Requests
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'notifications' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </button>
          </div>

          {/* Calendar View Toggle */}
          {showCalendarView && activeTab === 'schedule' && (
            <CalendarView 
              timetableData={timetableData} 
              onRequestSwap={(shiftId) => {
                setSwapRequest(prev => ({ ...prev, fromShiftId: shiftId }));
                setShowSwapModal(true);
              }}
            />
          )}

          {/* Weekly Schedule Tab */}
          {!showCalendarView && activeTab === 'schedule' && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Weekly Schedule</h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => navigateWeek('prev')}
                    className="border px-3 py-1 rounded hover:bg-gray-100"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1">
                    Week of {currentWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                  <button 
                    onClick={() => navigateWeek('next')}
                    className="border px-3 py-1 rounded hover:bg-gray-100"
                  >
                    Next
                  </button>
                  <button 
                    onClick={() => setShowShiftModal(true)}
                    className="flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    <FaPlus className="mr-1" /> Add Shift
                  </button>
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
                      <th className="py-3 px-4 border-b text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timetableData.map((day, index) => (
                      <React.Fragment key={index}>
                        {day.shifts.map((shift, shiftIndex) => (
                          <tr key={`${index}-${shiftIndex}`} className={shiftIndex === 0 ? 'border-t' : ''}>
                            {shiftIndex === 0 && (
                              <td className="py-3 px-4 border-b" rowSpan={day.shifts.length}>
                                {day.day}
                              </td>
                            )}
                            <td className="py-3 px-4 border-b">{shift.startTime} - {shift.endTime}</td>
                            <td className="py-3 px-4 border-b">{shift.employees.length}</td>
                            <td className="py-3 px-4 border-b">{shift.department?.name || 'All'}</td>
                            <td className="py-3 px-4 border-b">
                              <button
                                onClick={() => {
                                  setSwapRequest(prev => ({ ...prev, fromShiftId: shift.id }));
                                  setShowSwapModal(true);
                                }}
                                className="text-blue-500 hover:text-blue-700"
                                title="Request shift swap"
                              >
                                <FaExchangeAlt />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Shift Coverage Tab */}
          {activeTab === 'coverage' && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">Shift Coverage</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {shiftCoverage.map((shift, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-medium">{shift.day} - {shift.timeRange}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`font-medium ${
                        shift.status === 'Fully Staffed' ? 'text-green-600' :
                        shift.status === 'Understaffed' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {shift.status}
                      </span>
                      <span className="text-sm text-gray-600">
                        {shift.employeeCount}/{shift.needed} employees
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 overflow-hidden box-border">
                      <div 
                        className={`h-2.5 rounded-full ${
                          shift.status === 'Fully Staffed' ? 'bg-green-600' :
                          shift.status === 'Understaffed' ? 'bg-yellow-600' : 'bg-red-600'
                        }`} 
                        style={{
                          width: `${(shift.employeeCount / shift.needed) * 100}%`,
                          maxWidth: '100%'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
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
                      <th className="py-2 px-4 border-b">Action</th>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <NotificationTesting employees={employees} />
            </div>
          )}

          {/* Add Shift Modal */}
          {showShiftModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Add New Shift</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Day</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={newShift.day}
                      onChange={(e) => setNewShift({...newShift, day: e.target.value})}
                    >
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Time</label>
                    <input
                      type="time"
                      className="w-full p-2 border rounded"
                      value={newShift.startTime}
                      onChange={(e) => setNewShift({...newShift, startTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Time</label>
                    <input
                      type="time"
                      className="w-full p-2 border rounded"
                      value={newShift.endTime}
                      onChange={(e) => setNewShift({...newShift, endTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Department</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={newShift.departmentId}
                      onChange={(e) => setNewShift({...newShift, departmentId: e.target.value})}
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Employees</label>
                    <select
                      multiple
                      className="w-full p-2 border rounded h-32"
                      value={selectedEmployees}
                      onChange={(e) => setSelectedEmployees(
                        Array.from(e.target.selectedOptions, option => option.value)
                      )}
                    >
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.username}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => setShowShiftModal(false)}
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateShift}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save Shift
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Shift Swap Modal */}
          {showSwapModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Request Shift Swap</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">To Shift</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={swapRequest.toShiftId}
                      onChange={(e) => setSwapRequest({...swapRequest, toShiftId: e.target.value})}
                    >
                      <option value="">Select Shift</option>
                      {timetableData.flatMap(day => 
                        day.shifts
                          .filter(shift => shift.id !== swapRequest.fromShiftId)
                          .map(shift => (
                            <option key={shift.id} value={shift.id}>
                              {day.day} - {shift.time} ({shift.department?.name})
                            </option>
                          ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Request To</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={swapRequest.requestedToId}
                      onChange={(e) => setSwapRequest({...swapRequest, requestedToId: e.target.value})}
                    >
                      <option value="">Select Employee</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.username}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Reason</label>
                    <textarea
                      className="w-full p-2 border rounded"
                      value={swapRequest.reason}
                      onChange={(e) => setSwapRequest({...swapRequest, reason: e.target.value})}
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => setShowSwapModal(false)}
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleShiftSwap}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Request Swap
                  </button>
                </div>
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
};

export default TimetablePage;
// ********************************************



// 'use client';
// import React, { useState, useEffect, useContext } from 'react';
// import Header from '../../components/header';
// import Sidebar from '../../components/sidebar';
// import { useSharedStyles } from '../../sharedStyles';
// import { usePathname } from 'next/navigation';
// import { MenuContext } from '../../lib/MenuContext';
// import { useSidebar } from '../../lib/SidebarContext';
// import axios from 'axios';
// import { generatePdf } from '../../utils/generatePdf';
// import { useWebSocket } from '../../lib/WebSocketContext';
// import {
//   FaSearch, FaCommentDots, FaBell, FaCog, FaUserCircle, FaHome, FaBox, FaList, FaStore, FaWallet, FaPlus, FaSignOutAlt,
// } from 'react-icons/fa';


// const scheduleData = [
//   { 
//     day: 'Monday', 
//     shifts: [
//       { time: '09:00 - 17:00', employees: 12, department: 'All' },
//       { time: '14:00 - 22:00', employees: 8, department: 'Support' }
//     ] 
//   },
//   { 
//     day: 'Tuesday', 
//     shifts: [
//       { time: '09:00 - 17:00', employees: 15, department: 'All' },
//       { time: '12:00 - 20:00', employees: 6, department: 'Sales' }
//     ] 
//   },
//   { 
//     day: 'Wednesday', 
//     shifts: [
//       { time: '09:00 - 17:00', employees: 14, department: 'All' },
//       { time: '08:00 - 16:00', employees: 5, department: 'Operations' }
//     ] 
//   },
//   { 
//     day: 'Thursday', 
//     shifts: [
//       { time: '09:00 - 17:00', employees: 13, department: 'All' },
//       { time: '10:00 - 18:00', employees: 7, department: 'Marketing' }
//     ] 
//   },
//   { 
//     day: 'Friday', 
//     shifts: [
//       { time: '09:00 - 17:00', employees: 11, department: 'All' },
//       { time: '16:00 - 00:00', employees: 4, department: 'Support' }
//     ] 
//   },
// ];

// export default function TimetablePage() {
//   const styles = useSharedStyles();
//   const pathname = usePathname();
//   const { menuItems } = useContext(MenuContext);
//   const { isSidebarVisible } = useSidebar();
//   const currentMenuItem = menuItems.find(item => item.link === pathname);
//   const pageTitle = currentMenuItem?.menu_item || 'Timetable';
//   // const pageTitle = currentMenuItem?.link || currentMenuItem?.menu_item || 'Timetable';

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

//           {/* Weekly Schedule */}
//           <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">Weekly Schedule</h2>
//               <div className="flex space-x-2">
//                 <button className="border px-3 py-1 rounded">Previous</button>
//                 <span className="px-3 py-1">Week of June 26, 2023</span>
//                 <button className="border px-3 py-1 rounded">Next</button>
//               </div>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white">
//                 <thead>
//                   <tr>
//                     <th className="py-3 px-4 border-b text-left">Day</th>
//                     <th className="py-3 px-4 border-b text-left">Shift Times</th>
//                     <th className="py-3 px-4 border-b text-left">Employees</th>
//                     <th className="py-3 px-4 border-b text-left">Department</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {scheduleData.map((day, index) => (
//                     <React.Fragment key={index}>
//                       {day.shifts.map((shift, shiftIndex) => (
//                         <tr key={`${index}-${shiftIndex}`} className={shiftIndex === 0 ? 'border-t' : ''}>
//                           {shiftIndex === 0 && (
//                             <td className="py-3 px-4 border-b" rowSpan={day.shifts.length}>
//                               {day.day}
//                             </td>
//                           )}
//                           <td className="py-3 px-4 border-b">{shift.time}</td>
//                           <td className="py-3 px-4 border-b">{shift.employees}</td>
//                           <td className="py-3 px-4 border-b">{shift.department}</td>
//                         </tr>
//                       ))}
//                     </React.Fragment>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Shift Coverage */}
//           <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//             <h2 className="text-xl font-semibold mb-4">Shift Coverage</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {[
//                 { shift: 'Morning (9AM-5PM)', coverage: 'Fully Staffed', employees: 15, needed: 15 },
//                 { shift: 'Evening (2PM-10PM)', coverage: 'Understaffed', employees: 8, needed: 10 },
//                 { shift: 'Night (10PM-6AM)', coverage: 'Not Staffed', employees: 0, needed: 5 },
//               ].map((shift, index) => (
//                 <div key={index} className="border rounded-lg p-4">
//                   <h3 className="font-medium">{shift.shift}</h3>
//                   <div className="flex justify-between items-center mt-2">
//                     <span className={`font-medium ${
//                       shift.coverage === 'Fully Staffed' ? 'text-green-600' :
//                       shift.coverage === 'Understaffed' ? 'text-yellow-600' : 'text-red-600'
//                     }`}>
//                       {shift.coverage}
//                     </span>
//                     <span className="text-sm text-gray-600">
//                       {shift.employees}/{shift.needed} employees
//                     </span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
//                     <div 
//                       className={`h-2.5 rounded-full ${
//                         shift.coverage === 'Fully Staffed' ? 'bg-green-600' :
//                         shift.coverage === 'Understaffed' ? 'bg-yellow-600' : 'bg-red-600'
//                       }`} 
//                       style={{ width: `${(shift.employees / shift.needed) * 100}%` }}
//                     ></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Time Off Requests */}
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">Time Off Requests</h2>
//               <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//                 New Request
//               </button>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white">
//                 <thead>
//                   <tr>
//                     <th className="py-2 px-4 border-b">Employee</th>
//                     <th className="py-2 px-4 border-b">Dates</th>
//                     <th className="py-2 px-4 border-b">Type</th>
//                     <th className="py-2 px-4 border-b">Status</th>
//                     <th className="py-2 px-4 border-b">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {[
//                     { name: 'John Doe', dates: 'Jul 5-7, 2023', type: 'Vacation', status: 'Pending' },
//                     { name: 'Jane Smith', dates: 'Jul 10-12, 2023', type: 'Sick Leave', status: 'Approved' },
//                     { name: 'Robert Johnson', dates: 'Jul 15-19, 2023', type: 'Personal', status: 'Rejected' },
//                   ].map((request, index) => (
//                     <tr key={index}>
//                       <td className="py-2 px-4 border-b">{request.name}</td>
//                       <td className="py-2 px-4 border-b">{request.dates}</td>
//                       <td className="py-2 px-4 border-b">{request.type}</td>
//                       <td className="py-2 px-4 border-b">
//                         <span className={`px-2 py-1 rounded text-xs ${
//                           request.status === 'Approved' ? 'bg-green-100 text-green-800' :
//                           request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
//                           'bg-red-100 text-red-800'
//                         }`}>
//                           {request.status}
//                         </span>
//                       </td>
//                       <td className="py-2 px-4 border-b">
//                         {request.status === 'Pending' && (
//                           <>
//                             <button className="text-green-600 hover:underline mr-2">Approve</button>
//                             <button className="text-red-600 hover:underline">Reject</button>
//                           </>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

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
//                 {
//                   notificationData.type==='task'&&(
//                     <div>
//                       <label className="block text-gray-700 mb-2">Due date</label>
//                       <input
//                         type="datetime-local"
//                         className="w-full p-2 border rounded"
//                         value={notificationData.due_date}
//                         onChange={(e) => setNotificationData({...notificationData, due_date: e.target.value})}
//                         required
//                       />
//                     </div>
//                   )
//                 }
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
//         </div>
//       </div>
//     </div>
//   );
// }
// // ****************************************



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