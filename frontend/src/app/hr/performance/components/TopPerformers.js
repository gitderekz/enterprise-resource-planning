'use client';
import React from 'react';
import { FaMedal, FaStar, FaUserTie } from 'react-icons/fa';

const TopPerformers = ({ performers }) => {
  const medalColors = ['text-yellow-500', 'text-gray-400', 'text-yellow-700'];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Top Performers</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {performers?.map((employee, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className={`text-3xl mr-3 ${medalColors[index] || 'text-gray-400'}`}>
                {index < 3 ? <FaMedal /> : <FaStar />}
              </div>
              <div>
                <h3 className="font-medium">{employee.name}</h3>
                <p className="text-sm text-gray-600">{employee.position}</p>
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="flex items-center">
                <FaStar className="text-yellow-500 mr-1" />
                Score:
              </span>
              <span className="font-bold">{employee.score?.toFixed(1)}/100</span>
            </div>
            <div className="flex justify-between">
              <span>Position:</span>
              <span className="text-blue-600 font-medium">{index + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPerformers;