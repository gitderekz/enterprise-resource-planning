// app/hr/recruitment/components/Reports.js
import { useState, useEffect } from 'react';
import { recruitmentService } from '../services/recruitmentService';
import { recruitmentReportService } from '../services/reportService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        // const data = await recruitmentService.getReports();
        const data = await recruitmentReportService.getReports();
        
        // Transform data for better visualization
        const transformed = {
          hiringPipeline: data.pipeline.map(item => ({
            name: item.status.replace(/([A-Z])/g, ' $1').trim(),
            count: item.count
          })),
          timeToHire: data.timeToHire.map(item => ({
            position: item.role,
            days: Math.round(item.days)
          }))
        };
        
        setReportData(transformed);
      } catch (error) {
        console.error('Failed to load reports:', error);
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Hiring Pipeline Analytics</h2>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={reportData.hiringPipeline}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
            >
              <XAxis type="number" label={{ value: 'Number of Candidates', position: 'insideBottom', offset: -10 }} />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip 
                formatter={(value) => [`${value} candidates`, 'Count']}
                labelFormatter={(label) => `Stage: ${label}`}
              />
              <Legend />
              <Bar 
                dataKey="count" 
                name="Candidate Count" 
                fill="#3b82f6" 
                radius={[0, 4, 4, 0]}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Time to Hire Metrics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reportData.timeToHire}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="days"
                  nameKey="position"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {reportData.timeToHire.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} days`, 'Average']}
                />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  formatter={(value) => value?.replace(/([A-Z])/g, ' $1').trim()}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Average Time to Hire by Position</h3>
            <ul className="space-y-3">
              {reportData.timeToHire.map((item, index) => (
                <li key={index} className="flex items-center">
                  <span 
                    className="inline-block w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></span>
                  <span>
                    <span className="font-medium">{item.position}:</span> {item.days} days
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
// *******************************



// // app/hr/recruitment/components/Reports.js
// import { useState, useEffect } from 'react';
// import { recruitmentService } from '../services/recruitmentService';
// import { recruitmentReportService } from '../services/reportService';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

// // const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
// const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

// const Reports = () => {
//   const [reportData, setReportData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadReports = async () => {
//       try {
//         const data = await recruitmentReportService.getReports();
//         setReportData(data);
//       } catch (error) {
//         console.error('Failed to load reports:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadReports();
//   }, []);

//   if (loading) return <div>Loading reports...</div>;
//   if (!reportData) return <div>No report data available</div>;

//   return (
//     <div className="space-y-6">
//       <div className="bg-white p-4 rounded-lg shadow">
//         <h2 className="text-xl font-semibold mb-4">Candidate Pipeline</h2>
//         <div className="h-64">
//           <PieChart width={400} height={300}>
//             <Pie
//               data={reportData.pipeline}
//               cx="50%"
//               cy="50%"
//               outerRadius={80}
//               fill="#8884d8"
//               dataKey="count"
//               label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//             >
//               {reportData.pipeline.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//             <Legend />
//           </PieChart>
//         </div>
//       </div>

//       <div className="bg-white p-4 rounded-lg shadow">
//         <h2 className="text-xl font-semibold mb-4">Time to Hire</h2>
//         <div className="h-64">
//           <BarChart
//             width={500}
//             height={300}
//             data={reportData.timeToHire}
//             margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//           >
//             <XAxis dataKey="role" />
//             <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="days" fill="#8884d8" name="Average Days" />
//           </BarChart>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Reports;
// // *************************



// import { useState, useEffect } from 'react';
// import { recruitmentReportService } from '../services/reportService';

// const Reports = () => {
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchReports = async () => {
//       try {
//         const data = await recruitmentReportService.getReports();
//         setReports(data);
//       } catch (error) {
//         console.error('Error fetching reports:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchReports();
//   }, []);

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-semibold mb-4">Recruitment Reports</h2>
//       {loading ? (
//         <p>Loading reports...</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {reports.map((report) => (
//             <div key={report.id} className="border rounded-lg p-4">
//               <h3 className="font-medium text-lg">{report.title}</h3>
//               <p className="text-gray-600">{report.description}</p>
//               <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
//                 Generate Report
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Reports;