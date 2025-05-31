'use client';
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const FinanceChart = ({ data = [], type = 'bar', title, width = '100%', height = 300, keys }) => {
  // Defensive checks
  if (!Array.isArray(data) || data.length === 0 || !type) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500">
        No data available for this chart.
      </div>
    );
  }

  const firstItem = data[0] || {};
  const resolvedKeys = keys || Object.keys(firstItem).filter(key => key !== 'name' && key !== 'color');

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {resolvedKeys.length === 1 ? (
              <Bar dataKey={resolvedKeys[0]} name="Amount" fill="#8884d8">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} />
                ))}
              </Bar>
            ) : (
              resolvedKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  name={key.charAt(0).toUpperCase() + key.slice(1)}
                  fill={COLORS[index % COLORS.length]}
                />
              ))
            )}
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {resolvedKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
                name={key.charAt(0).toUpperCase() + key.slice(1)}
              />
            ))}
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey={resolvedKeys[0] || 'value'}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <div style={{ width, height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart() || <></>}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinanceChart;
// **************************************8




// 'use client';
// import React from 'react';
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
//   AreaChart, Area, PieChart, Pie, Cell
// } from 'recharts';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

// const FinanceChart = ({ data = [], type = 'bar', title, width = '100%', height = 300 }) => {
//   if (!data.length) return null;

//   const firstItem = data[0];
//   const keys = Object.keys(firstItem).filter(key => key !== 'name' && key !== 'color');

//   const renderChart = () => {
//     switch (type) {
//       case 'bar':
//         return (
//           <BarChart data={data}>
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             {keys.length === 1 ? (
//               <Bar dataKey={keys[0]} name="Amount" fill="#8884d8">
//                 {data.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} />
//                 ))}
//               </Bar>
//             ) : (
//               keys.map((key, index) => (
//                 <Bar
//                   key={key}
//                   dataKey={key}
//                   name={key.charAt(0).toUpperCase() + key.slice(1)}
//                   fill={COLORS[index % COLORS.length]}
//                 />
//               ))
//             )}
//           </BarChart>
//         );

//       case 'area':
//         return (
//           <AreaChart data={data}>
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             {keys.map((key, index) => (
//               <Area
//                 key={key}
//                 type="monotone"
//                 dataKey={key}
//                 stroke={COLORS[index % COLORS.length]}
//                 fill={COLORS[index % COLORS.length]}
//                 name={key.charAt(0).toUpperCase() + key.slice(1)}
//               />
//             ))}
//           </AreaChart>
//         );

//       case 'pie':
//         return (
//           <PieChart>
//             <Pie
//               data={data}
//               cx="50%"
//               cy="50%"
//               labelLine={false}
//               outerRadius={80}
//               fill="#8884d8"
//               dataKey={keys[0] || 'value'}
//               label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//             >
//               {data.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//             <Legend />
//           </PieChart>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md p-4">
//       {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
//       <div style={{ width, height }}>
//         <ResponsiveContainer width="100%" height="100%">
//           {renderChart()}
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default FinanceChart;
// // **************************************




// 'use client';
// import React from 'react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

// const FinanceChart = ({ data, type = 'bar', title, width = '100%', height = 300 }) => {
//   const renderChart = () => {
//     switch (type) {
//       case 'bar':
//         return (
//           <BarChart data={data}>
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="value" fill="#8884d8" />
//             {/* <Bar dataKey="value" name="Amount" fill="#8884d8">
//               {data?.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} />
//               ))}
//             </Bar> */}
//             {/* <Bar dataKey="inflow" fill="#16a34a" name="Inflow" />
//             <Bar dataKey="outflow" fill="#dc2626" name="Outflow" /> */}
//           </BarChart>
//         );
//       case 'area':
//         return (
//           <AreaChart data={data}>
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
//           </AreaChart>
//         );
//       case 'pie':
//         return (
//           <PieChart>
//             <Pie
//               data={data}
//               cx="50%"
//               cy="50%"
//               labelLine={false}
//               outerRadius={80}
//               fill="#8884d8"
//               dataKey="value"
//               label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//             >
//               {data.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//             <Legend />
//           </PieChart>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md p-4">
//       {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
//       <div style={{ width, height }}>
//         <ResponsiveContainer width="100%" height="100%">
//           {renderChart()}
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default FinanceChart;