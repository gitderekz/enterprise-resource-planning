// app/hr/recruitment/components/RecruitmentDashboard.js
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RecruitmentDashboard = ({ stats }) => {
  // Transform stats into pie chart data
  const pipelineData = [
    { name: 'Open Positions', value: stats.openPositions },
    { name: 'Candidates', value: stats.candidates },
    { name: 'Interviews', value: stats.interviews },
    { name: 'Hires', value: stats.hires }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* {pipelineData.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500">{item.name}</h3>
            <p className="text-2xl font-bold">{item.value}</p>
          </div>
        ))} */}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Pipeline Distribution</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="h-64 w-full md:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pipelineData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full md:w-1/2">
            <div className="grid grid-cols-2 gap-4">
              {pipelineData.map((status, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="text-sm text-gray-600">{status.name}</div>
                  <div className="text-2xl font-bold mt-1">{status.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentDashboard;
// ***********************************



// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// // app/hr/recruitment/components/RecruitmentDashboard.js
// const RecruitmentDashboard = ({ stats, statusData, COLORS }) => {
//     // return (
//     //   <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//     //     <div className="bg-white p-4 rounded-lg shadow">
//     //       <h3 className="text-gray-500">Open Positions</h3>
//     //       <p className="text-2xl font-bold">{stats.openPositions}</p>
//     //     </div>
//     //     <div className="bg-white p-4 rounded-lg shadow">
//     //       <h3 className="text-gray-500">Candidates</h3>
//     //       <p className="text-2xl font-bold">{stats.candidates}</p>
//     //     </div>
//     //     <div className="bg-white p-4 rounded-lg shadow">
//     //       <h3 className="text-gray-500">Interviews</h3>
//     //       <p className="text-2xl font-bold">{stats.interviews}</p>
//     //     </div>
//     //     <div className="bg-white p-4 rounded-lg shadow">
//     //       <h3 className="text-gray-500">Hires</h3>
//     //       <p className="text-2xl font-bold">{stats.hires}</p>
//     //     </div>
//     //   </div>
//     // );

//       {/* Recruitment Pipeline */}
//     return (
//       <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//         <h2 className="text-xl font-semibold mb-4">Recruitment Pipeline</h2>
//         <div className="flex flex-col md:flex-row gap-6">
//           <div className="h-64 w-full md:w-1/2">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={statusData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                   label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                 >
//                   {statusData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//           <div className="w-full md:w-1/2">
//             <div className="grid grid-cols-2 gap-4">
//               {statusData.map((status, index) => (
//                 <div key={index} className="border rounded-lg p-4">
//                   <div className="text-sm text-gray-600">{status.name}</div>
//                   <div className="text-2xl font-bold mt-1">{status.value}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };
  
//   export default RecruitmentDashboard;