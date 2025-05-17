'use client';
import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import { FaStar, FaChartLine, FaUserTie, FaUsers, FaComments } from 'react-icons/fa';

const PerformanceMetrics = ({ metrics }) => {
  const data = [
    { subject: 'Quality', A: metrics?.quality || 0, fullMark: 100 },
    { subject: 'Productivity', A: metrics?.productivity || 0, fullMark: 100 },
    { subject: 'Initiative', A: metrics?.initiative || 0, fullMark: 100 },
    { subject: 'Teamwork', A: metrics?.teamwork || 0, fullMark: 100 },
    { subject: 'Communication', A: metrics?.communication || 0, fullMark: 100 },
  ];

  const metricCards = [
    { title: 'Quality', value: metrics?.quality?.toFixed(1) || '0.0', icon: <FaStar className="text-yellow-500" /> },
    { title: 'Productivity', value: metrics?.productivity?.toFixed(1) || '0.0', icon: <FaChartLine className="text-green-500" /> },
    { title: 'Initiative', value: metrics?.initiative?.toFixed(1) || '0.0', icon: <FaUserTie className="text-blue-500" /> },
    { title: 'Teamwork', value: metrics?.teamwork?.toFixed(1) || '0.0', icon: <FaUsers className="text-purple-500" /> },
    { title: 'Communication', value: metrics?.communication?.toFixed(1) || '0.0', icon: <FaComments className="text-red-500" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {metricCards.map((card, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
              <div className="text-2xl">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Team Average" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;