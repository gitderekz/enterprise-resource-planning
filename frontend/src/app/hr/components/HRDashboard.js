import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FaUser } from 'react-icons/fa';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const HRDashboard = ({ stats }) => {
  const hrStats = stats.hr || {};
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [openPositions, setOpenPositions] = useState(0);
  const [activeRecruitments, setActiveRecruitments] = useState(0);
  const router = useRouter();

  useEffect(() => {
    console.log('hrStats',hrStats);
    
    setEmployees(hrStats.totalEmployees);
    setDepartments(hrStats.totalDepartments);
    setOpenPositions(hrStats.openPositions);
    setActiveRecruitments(hrStats.candidates);
// interviews
// hires


    // const fetchHRData = async () => {
    //   try {
    //     const token = localStorage.getItem('token');
    //     const [employeesRes, departmentsRes, positionsRes, recruitmentsRes] = await Promise.all([
    //       axios.get(`${process.env.NEXT_PUBLIC_API_URL}/employees`, {
    //         headers: { Authorization: `Bearer ${token}` }
    //       }),
    //       axios.get(`${process.env.NEXT_PUBLIC_API_URL}/departments`, {
    //         headers: { Authorization: `Bearer ${token}` }
    //       }),
    //       axios.get(`${process.env.NEXT_PUBLIC_API_URL}/positions/open`, {
    //         headers: { Authorization: `Bearer ${token}` }
    //       }),
    //       axios.get(`${process.env.NEXT_PUBLIC_API_URL}/recruitments/active`, {
    //         headers: { Authorization: `Bearer ${token}` }
    //       })
    //     ]);
        
    //     setEmployees(employeesRes.data);
    //     setDepartments(departmentsRes.data);
    //     setOpenPositions(positionsRes.data.count);
    //     setActiveRecruitments(recruitmentsRes.data.count);
    //   } catch (error) {
    //     toast.error('Failed to load HR data');
    //     console.error(error);
    //   } finally {
        setLoading(false);
    //   }
    // };

    // fetchHRData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Prepare data for charts
  const departmentDistribution = departments.map(dept => ({
    name: dept.name,
    value: employees.filter(emp => emp.departmentId??emp.position??emp.role_id === dept.id).length
  }));

  const positionLevelData = [
    { name: 'Junior', value: employees.filter(emp => emp.level === 'junior').length },
    { name: 'Mid', value: employees.filter(emp => emp.level === 'mid').length },
    { name: 'Senior', value: employees.filter(emp => emp.level === 'senior').length },
    { name: 'Executive', value: employees.filter(emp => emp.level === 'executive').length }
  ];

  const turnoverData = [
    { name: 'Jan', hires: 5, exits: 2 },
    { name: 'Feb', hires: 3, exits: 1 },
    { name: 'Mar', hires: 7, exits: 0 },
    { name: 'Apr', hires: 2, exits: 1 },
    { name: 'May', hires: 4, exits: 3 },
    { name: 'Jun', hires: 6, exits: 2 }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Human Resources Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Employees</h3>
          <p className="text-2xl font-bold mt-2">{employees.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Departments</h3>
          <p className="text-2xl font-bold mt-2">{departments.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Open Positions</h3>
          <p className="text-2xl font-bold mt-2">{openPositions}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Active Recruitments</h3>
          <p className="text-2xl font-bold mt-2">{activeRecruitments}</p>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Department Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {departmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Turnover Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Monthly Turnover</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={turnoverData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="hires" fill="#4CAF50" name="Hires" />
                <Bar dataKey="exits" fill="#F44336" name="Exits" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Additional Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Position Level Distribution */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Position Levels</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={positionLevelData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#2196F3" name="Employees" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Gender Diversity (example) */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Gender Diversity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Male', value: employees.filter(e => e.gender === 'male').length },
                    { name: 'Female', value: employees.filter(e => e.gender === 'female').length },
                    // { name: 'Other', value: employees.filter(e => !['male', 'female'].includes(e.gender)).length }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill="#3F51B5" />
                  <Cell fill="#E91E63" />
                  <Cell fill="#9E9E9E" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Employees Table */}
      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Employees</h3>
          <button 
            onClick={() => router.push('/hr/administration')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            View All Employees
          </button>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hire Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.slice(0, 5).sort((a, b) => new Date(b.hireDate) - new Date(a.hireDate)).map((employee) => (
              <tr 
                key={employee.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/hr/employees/${employee.id}`)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {employee.photo?<img className="h-10 w-10 rounded-full" src={employee.photo || '/default-avatar.png'} alt="" />:<FaUser/>}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-500">{employee.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{employee.position??employee.role?.name}</div>
                  <div className="text-sm text-gray-500 capitalize">{employee.level}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {departments.find(d => d.id === (employee.departmentId??employee.role_id))?.name || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(employee.hireDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${employee.status === 'active' ? 'bg-green-100 text-green-800' : 
                      employee.status === 'on-leave' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {employee.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => router.push('/hr/administration')}
            className="p-4 bg-green-100 rounded-lg hover:bg-green-200 transition flex flex-col items-center"
          >
            <span className="text-green-800 font-medium">Add New Employee</span>
          </button>
          <button 
            onClick={() => router.push('/hr/recruitment')}
            className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200 transition flex flex-col items-center"
          >
            <span className="text-blue-800 font-medium">Create Recruitment</span>
          </button>
          <button 
            onClick={() => router.push('/hr/recruitment')}
            className="p-4 bg-purple-100 rounded-lg hover:bg-purple-200 transition flex flex-col items-center"
          >
            <span className="text-purple-800 font-medium">Add Position</span>
          </button>
          <button 
            onClick={() => router.push('/hr/administration')}
            className="p-4 bg-orange-100 rounded-lg hover:bg-orange-200 transition flex flex-col items-center"
          >
            <span className="text-orange-800 font-medium">Generate Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;