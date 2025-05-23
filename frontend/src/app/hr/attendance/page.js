'use client';
import React, { useState, useEffect, useContext } from 'react';
import { useSharedStyles } from '../../sharedStyles';
import { usePathname } from 'next/navigation';
import { MenuContext } from '../../lib/MenuContext';
import { useSidebar } from '../../lib/SidebarContext';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DataTable } from './components/data-table';
import { Button } from '../../components/ui/button';
import { Calendar } from '../../components/ui/calendar';
import { format, subMonths, subYears, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { DownloadIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { startOfWeek, endOfWeek } from 'date-fns';

const AttendancePage = () => {
  const styles = useSharedStyles();
  const pathname = usePathname();
  const { menuItems } = useContext(MenuContext);
  const { isSidebarVisible } = useSidebar();
  const router = useRouter();
  const currentMenuItem = menuItems.find(item => item.link === pathname);
  const pageTitle = currentMenuItem?.menu_item || 'Attendance';

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [stats, setStats] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: subMonths(new Date(), 1),
    to: new Date()
  });
  const [viewMode, setViewMode] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [isCheckInDisabled, setIsCheckInDisabled] = useState(false);
  const [isCheckOutDisabled, setIsCheckOutDisabled] = useState(true);
  const [user, setUser] = useState(null);

  // Check attendance status on load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    checkAttendanceStatus();
    fetchEmployees();
  }, []);

  // Fetch attendance data when date range or employee changes
  useEffect(() => {
    if (selectedEmployee || viewMode) {
      fetchAttendanceData();
    }
  }, [selectedEmployee, dateRange, viewMode]);

  const checkAttendanceStatus = async () => {
    try {
      const today = new Date();
      const startDate = `${today.toISOString().split('T')[0]} 00:00:00`;
      const endDate = `${today.toISOString().split('T')[0]} 23:59:59`;

      const storedUser = JSON.parse(localStorage.getItem('user'));
      const currentUserId = storedUser?.id;

      // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr/attendance/stats/${selectedEmployee?.id|| currentUserId || ''}`, {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr/attendance/stats/${selectedEmployee?.id|| currentUserId || ''}`, {
        params: { startDate, endDate },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const todayAttendance = selectedEmployee 
      ? response.data.attendances[0]
      : response.data.attendances.find(a => parseInt(a.user_id) === parseInt(currentUserId)); // Assuming you have user in context

      setIsCheckInDisabled(!!todayAttendance?.check_in);
      setIsCheckOutDisabled(!todayAttendance?.check_in || !!todayAttendance?.check_out);
    } catch (err) {
      console.error('Error checking attendance status:', err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/employees`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setEmployees(response.data);
    } catch (err) {
      toast.error('Failed to fetch employees');
      console.error(err);
    }
  };

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      let startDate, endDate;
      
      if (viewMode === 'daily') {
        if (!dateRange.from || !dateRange.to) {
          throw new Error('Please select a valid date range');
        }
        startDate = dateRange.from;
        endDate = dateRange.to;
      } else if (viewMode === 'monthly') {
        if (!dateRange.from) {
          throw new Error('Please select a month');
        }
        startDate = startOfMonth(dateRange.from);
        endDate = endOfMonth(dateRange.from);
      } else { // yearly
        if (!dateRange.from) {
          throw new Error('Please select a year');
        }
        startDate = startOfYear(dateRange.from);
        endDate = endOfYear(dateRange.from);
      }

      // Validate date order
      if (startDate > endDate) {
        throw new Error('Start date cannot be after end date');
      }

      const params = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        userId: selectedEmployee?.id
      };

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr/attendance`,  {
        params ,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.data) {
        throw new Error('No data received from server');
      }
      setAttendanceData(response.data);
      
      // Calculate stats if viewing a single employee
      if (selectedEmployee) {
        const statsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr/attendance/stats/${selectedEmployee.id}`, {
          params,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!statsResponse.data) {
          throw new Error('No stats data received');
        }
        setStats(statsResponse.data.stats);
      } else {
        // Always fetch stats, whether single or multiple users
        const statsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr/attendance/stats`, {
          params,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setStats(statsResponse.data.stats);
        // setStats(null);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Failed to fetch attendance data';
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportSummary = async (format) => {
    try {
      let startDate, endDate;
      
      if (viewMode === 'daily') {
        startDate = dateRange.from;
        endDate = dateRange.to;
      } else if (viewMode === 'monthly') {
        startDate = startOfMonth(dateRange.from);
        endDate = endOfMonth(dateRange.from);
      } else { // yearly
        startDate = startOfYear(dateRange.from);
        endDate = endOfYear(dateRange.from);
      }

      const params = {
        format,
        type: 'summary',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr/attendance/report`, {
        params,
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `employee_summary_${formatDate(startDate)}_to_${formatDate(endDate)}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error('Failed to export summary');
      console.error(err);
    }
  };

  const handleCheckIn = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/hr/attendance/check-in`, {
        notes: 'Checked in via system',
        ip_address: '', // You can capture this if needed
        device_info: navigator.userAgent
      },{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 201) {
        toast.success('Checked in successfully');
        setIsCheckInDisabled(true);
        setIsCheckOutDisabled(false);
        fetchAttendanceData();
      } else {
        throw new Error(response.data.message || 'Failed to check in');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to check in');
      console.error(err);
    }
  };

  const handleCheckOut = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/hr/attendance/check-out`, {
        notes: 'Checked out via system'
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Checked out successfully');
      setIsCheckOutDisabled(true);
      fetchAttendanceData();
    } catch (err) {
      toast.error('Failed to check out');
      console.error(err);
    }
  };

  const handleDeductSalary = async (employeeId) => {
    if (confirm('Are you sure you want to deduct salary for this employee?')) {
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/hr/attendance/deduct-salary`, {
          userId: employeeId,
          deductionPercentage: 10 // Default 10% deduction
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('Salary deducted successfully');
        fetchEmployees();
      } catch (err) {
        toast.error('Failed to deduct salary');
        console.error(err);
      }
    }
  };

  const handleExport = async (format) => {
    try {
      let startDate, endDate;
      
      if (viewMode === 'daily') {
        startDate = dateRange.from;
        endDate = dateRange.to;
      } else if (viewMode === 'monthly') {
        startDate = startOfMonth(dateRange.from);
        endDate = endOfMonth(dateRange.from);
      } else { // yearly
        startDate = startOfYear(dateRange.from);
        endDate = endOfYear(dateRange.from);
      }

      const params = {
        format,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        userId: selectedEmployee?.id
      };

      // Use axios to download the file
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr/attendance/report`, {
        params,
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance_report_${formatDate(startDate)}_to_${formatDate(endDate)}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error('Failed to export data');
      console.error(err);
    }
  };

  // Helper function to format date for filename
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const columns = [
    {
      accessorKey: 'user.username',
      header: 'Employee',
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.user?.username || 'N/A'}
        </div>
      )
    },
    {
      accessorKey: 'check_in',
      header: 'Check In',
      cell: ({ row }) => (
        <div>
          {row.original.check_in ? format(new Date(row.original.check_in), 'PPpp') : 'N/A'}
        </div>
      )
    },
    {
      accessorKey: 'check_out',
      header: 'Check Out',
      cell: ({ row }) => (
        <div>
          {row.original.check_out ? format(new Date(row.original.check_out), 'PPpp') : 'Not checked out'}
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          row.original.status === 'present' ? 'bg-green-100 text-green-800' :
          row.original.status === 'absent' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {row.original.status}
        </span>
      )
    },
    {
      accessorKey: 'attendance_status',
      header: 'Attendance Status',
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          row.original.attendance_status === 'on_time' ? 'bg-green-100 text-green-800' :
          row.original.attendance_status === 'late' ? 'bg-red-100 text-red-800' :
          row.original.attendance_status === 'early' ? 'bg-blue-100 text-blue-800' :
          row.original.attendance_status === 'overtime' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {row.original.attendance_status || 'N/A'}
        </span>
      )
    },
    {
      accessorKey: 'work_hours',
      header: 'Work Hours',
      cell: ({ row }) => (
        <div>
          {row.original.work_hours ? `${row.original.work_hours.toFixed(2)} hrs` : 'N/A'}
        </div>
      )
    }
  ];

  const employeeColumns = [
    {
      accessorKey: 'id',
      header: 'S/N',
      cell: ({ row }) => row.index + 1
    },
    {
      accessorKey: 'username',
      header: 'Employee',
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.username}
        </div>
      )
    },
    {
      accessorKey: 'department',
      header: 'Department'
    },
    {
      accessorKey: 'role',
      header: 'Role',
      // cell: ({ row }) => (
      //   <div>{typeof row.original.role === 'object' ? row.original.role.name : row.original.role}</div>
      // ),
      cell: ({ row }) => (
        <div>{row.original.role?.name || 'N/A'}</div>
      )
    },
    {
      accessorKey: 'presentDays',
      header: 'Present Days',
      cell: ({ row }) => row.original.presentDays || 0
    },
    {
      accessorKey: 'absentDays',
      header: 'Absent Days',
      cell: ({ row }) => row.original.absentDays || 0
    },
    {
      accessorKey: 'lateDays',
      header: 'Late Days',
      cell: ({ row }) => row.original.lateDays || 0
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const absentDays = row.original.absentDays || 0;
        return (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleSendReminder(row.original.id)}
            >
              Send Reminder
            </Button>
            {absentDays >= 8 && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => handleDeductSalary(row.original.id)}
              >
                Deduct Salary
              </Button>
            )}
          </div>
        );
      }
    }
  ];

  // Prepare employee data with stats
  const employeesWithStats = employees.map(employee => {
    // In a real app, you would fetch these stats from the backend
    const presentDays = Math.floor(Math.random() * 20) + 10;
    const absentDays = Math.floor(Math.random() * 10);
    const lateDays = Math.floor(Math.random() * 5);
    
    return {
      ...employee,
      presentDays,
      absentDays,
      lateDays
    };
  });

  const handleSendReminder = async (employeeId) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/hr/attendance/send-reminder`, {
        userId: employeeId
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Reminder sent successfully');
    } catch (err) {
      toast.error('Failed to send reminder');
      console.error(err);
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
          <div className="flex justify-between items-center mb-6">
            <h1 style={styles.pageTitle}>{pageTitle}</h1>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                disabled={isCheckInDisabled}
                onClick={handleCheckIn}
              >
                Check In
              </Button>
              <Button 
                variant="outline" 
                disabled={isCheckOutDisabled}
                onClick={handleCheckOut}
              >
                Check Out
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">View Mode</h3>
              <div className="flex gap-2">
                <Button 
                  variant={viewMode === 'daily' ? 'default' : 'outline'}
                  onClick={() => setViewMode('daily')}
                >
                  Daily
                </Button>
                <Button 
                  variant={viewMode === 'monthly' ? 'default' : 'outline'}
                  onClick={() => setViewMode('monthly')}
                >
                  Monthly
                </Button>
                <Button 
                  variant={viewMode === 'yearly' ? 'default' : 'outline'}
                  onClick={() => setViewMode('yearly')}
                >
                  Yearly
                </Button>
              </div>
            </div> */}

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Date Range</h3>
              <Calendar
                mode="range"
                selected={{
                  startDate: dateRange.from,
                  endDate: dateRange.to,
                  key: 'selection',
                  color: '#6A3CBC'
                }}
                onSelect={(ranges) => {
                  setDateRange({
                    from: ranges.selection.startDate,
                    to: ranges.selection.endDate
                  });
                }}
                className="rounded-md border"
                displayMode="dateRange"
                showMonthAndYearPickers
                ranges={[{
                  startDate: dateRange.from,
                  endDate: dateRange.to,
                  key: 'selection',
                  color: '#6A3CBC'
                }]}
                rangeColors={['#6A3CBC']}
                staticRanges={[]}
                inputRanges={[]}
                monthDisplayFormat="MMMM yyyy"
                weekdayDisplayFormat="EEEEEE"
              />
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Date Range</h3>
              <div className="flex flex-col space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="date"
                    value={dateRange.from ? dateRange.from.toISOString().split('T')[0] : ''}
                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value ? new Date(e.target.value) : null })}
                    className="p-2 border rounded"
                  />
                  <span className="flex items-center">to</span>
                  <input
                    type="date"
                    value={dateRange.to ? dateRange.to.toISOString().split('T')[0] : ''}
                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value ? new Date(e.target.value) : null })}
                    className="p-2 border rounded"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant={viewMode === 'daily' ? 'outline' : 'default'}    
                    onClick={() => {
                      setViewMode('daily')
                      setDateRange({
                      from: new Date(),
                      to: new Date()
                    })}}
                  >
                    Today
                  </Button>
                  <Button 
                    variant={viewMode === 'monthly' ? 'outline' : 'default'}    
                    onClick={() => {
                      setViewMode('monthly')
                      setDateRange({
                      from: startOfWeek(new Date()),
                      to: endOfWeek(new Date())
                    })}}
                  >
                    This Week
                  </Button>
                  <Button 
                    variant={viewMode === 'yearly' ? 'outline' : 'default'}    
                    onClick={() => {
                      setViewMode('yearly')
                      setDateRange({
                      from: startOfMonth(new Date()),
                      to: endOfMonth(new Date())
                    })}}
                  >
                    This Month
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Employee</h3>
              <select
                className="w-full p-2 border rounded"
                value={selectedEmployee?.id || ''}
                onChange={(e) => {
                  const emp = employees.find(emp => emp.id === parseInt(e.target.value));
                  setSelectedEmployee(emp || null);
                }}
              >
                <option value="">All Employees</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.username} ({employee.department})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Attendance Records</h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleExport('csv')}>
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline" onClick={() => handleExport('excel')}>
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Excel
                </Button>
                <Button variant="outline" onClick={() => handleExport('pdf')}>
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
            <DataTable 
              columns={columns} 
              data={attendanceData} 
              loading={loading}
            />
          </div>

          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-4">Attendance Statistics</h3>
                {Array.isArray(stats) ? (
                  // Multiple users stats
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 font-medium">
                      <div>Employee</div>
                      <div>Present Days</div>
                      <div>Absent Days</div>
                    </div>
                    {stats.map((userStat, index) => (
                      <div key={index} className="grid grid-cols-3 gap-2 border-b pb-2">
                        <div>{userStat.username}</div>
                        <div>{userStat.present_days} ({Math.round((userStat.present_days / userStat.total_days) * 100)}%)</div>
                        <div>{userStat.absent_days} ({Math.round((userStat.absent_days / userStat.total_days) * 100)}%)</div>
                      </div>
                    ))}
                  </div>
                ) : (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Days:</span>
                    <span>{stats.total_days}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Present Days:</span>
                    <span>{stats.present_days} ({Math.round((stats.present_days / stats.total_days) * 100)}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Absent Days:</span>
                    <span>{stats.absent_days} ({Math.round((stats.absent_days / stats.total_days) * 100)}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Late Days:</span>
                    <span>{stats.late_days} ({Math.round((stats.late_days / stats.total_days) * 100)}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Work Hours:</span>
                    <span>{stats.average_work_hours?.toFixed(2) || 'N/A'} hrs/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Late Minutes:</span>
                    <span>{stats.average_late_minutes?.toFixed(0) || 'N/A'} mins</span>
                  </div>
                </div>
                )}
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-4">Attendance Trend</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={Array.isArray(stats) ? 
                        // Multiple users data
                        stats.map(stat => ({
                          name: stat.username,
                          present: stat.present_days,
                          absent: stat.absent_days
                        })) : 
                        // Single user data
                        [
                          { name: 'Present', value: stats.present_days },
                          { name: 'Absent', value: stats.absent_days },
                          { name: 'Late', value: stats.late_days }
                        ]
                      }
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {Array.isArray(stats) ? (
                        <>
                          <Bar dataKey="present" fill="#4CAF50" name="Present Days" />
                          <Bar dataKey="absent" fill="#F44336" name="Absent Days" />
                        </>
                      ) : (
                        <Bar dataKey="value" fill="#8884d8" />
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Employee Attendance Summary</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleExportSummary('csv')}>
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExportSummary('excel')}>
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Excel
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExportSummary('pdf')}>
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
            <DataTable 
              columns={employeeColumns} 
              data={employeesWithStats} 
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
// ****************************************



// 'use client';
// import React, { useContext } from 'react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import Header from '../../components/header';
// import Sidebar from '../../components/sidebar';
// import { useSharedStyles } from '../../sharedStyles';
// import { usePathname } from 'next/navigation';
// import { MenuContext } from '../../lib/MenuContext';
// import { useSidebar } from '../../lib/SidebarContext';

// const attendanceData = [
//   { name: 'Jan', present: 85, absent: 15 },
//   { name: 'Feb', present: 78, absent: 22 },
//   { name: 'Mar', present: 92, absent: 8 },
//   { name: 'Apr', present: 88, absent: 12 },
//   { name: 'May', present: 95, absent: 5 },
// ];

// const lateArrivals = [
//   { name: 'John Doe', lateDays: 3 },
//   { name: 'Jane Smith', lateDays: 5 },
//   { name: 'Robert Johnson', lateDays: 2 },
//   { name: 'Emily Davis', lateDays: 1 },
// ];

// export default function AttendancePage() {
//   const styles = useSharedStyles();
//   const pathname = usePathname();
//   const { menuItems } = useContext(MenuContext);
//   const { isSidebarVisible } = useSidebar();
//   const currentMenuItem = menuItems.find(item => item.link === pathname);
//   const pageTitle = currentMenuItem?.menu_item || 'Attendance';

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

//           {/* Attendance Overview */}
//           <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//             <h2 className="text-xl font-semibold mb-4">Monthly Attendance Rate</h2>
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={attendanceData}>
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="present" fill="#4CAF50" name="Present (%)" />
//                   <Bar dataKey="absent" fill="#F44336" name="Absent (%)" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Late Arrivals */}
//           <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//             <h2 className="text-xl font-semibold mb-4">Late Arrivals This Month</h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white">
//                 <thead>
//                   <tr>
//                     <th className="py-2 px-4 border-b">Employee</th>
//                     <th className="py-2 px-4 border-b">Late Days</th>
//                     <th className="py-2 px-4 border-b">Average Delay</th>
//                     <th className="py-2 px-4 border-b">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {lateArrivals.map((employee, index) => (
//                     <tr key={index}>
//                       <td className="py-2 px-4 border-b">{employee.username}</td>
//                       <td className="py-2 px-4 border-b">{employee.lateDays}</td>
//                       <td className="py-2 px-4 border-b">{Math.floor(Math.random() * 30) + 5} mins</td>
//                       <td className="py-2 px-4 border-b">
//                         <button className="text-blue-600 hover:underline">Send Reminder</button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Department-wise Attendance */}
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-semibold mb-4">Department-wise Attendance</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {['HR', 'Engineering', 'Marketing'].map((dept, i) => (
//                 <div key={i} className="border rounded-lg p-4">
//                   <h3 className="font-medium">{dept} Department</h3>
//                   <div className="mt-4">
//                     <div className="flex justify-between mb-1">
//                       <span>Present:</span>
//                       <span className="text-green-600">{85 + i * 5}%</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Absent:</span>
//                       <span className="text-red-600">{15 - i * 5}%</span>
//                     </div>
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
// // *****************************************


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

// const attendancePage = () => {
  
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

// export default attendancePage;