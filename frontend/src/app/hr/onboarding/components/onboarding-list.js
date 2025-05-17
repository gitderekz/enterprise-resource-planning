'use client';
import React from 'react';
import { FaChevronRight, FaUser, FaCalendar, FaCheck, FaPause } from 'react-icons/fa';

const statusIcons = {
  pending: <FaPause className="text-yellow-500" />,
  in_progress: <FaUser className="text-blue-500" />,
  completed: <FaCheck className="text-green-500" />,
  on_hold: <FaPause className="text-red-500" />
};

const stageColors = {
  paperwork: 'bg-blue-100 text-blue-800',
  training: 'bg-purple-100 text-purple-800',
  equipment: 'bg-green-100 text-green-800',
  orientation: 'bg-yellow-100 text-yellow-800',
  final_review: 'bg-indigo-100 text-indigo-800'
};

export default function OnboardingList({ onboardings, onSelect }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {onboardings.map((onboarding) => (
              <tr key={onboarding.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <FaUser className="text-gray-500" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {onboarding.candidate?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {onboarding.candidate?.positionApplied}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaCalendar className="text-gray-400 mr-2" />
                    <div className="text-sm text-gray-900">
                      {new Date(onboarding.startDate).toLocaleDateString()}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {statusIcons[onboarding.status]}
                    <span className="ml-2 capitalize">{onboarding.status.replace('_', ' ')}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${stageColors[onboarding.currentStage]}`}>
                    {onboarding.currentStage.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {onboarding.assignedUser?.username || 'Unassigned'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onSelect(onboarding)}
                    className="text-blue-600 hover:text-blue-900 flex items-center"
                  >
                    View Tasks <FaChevronRight className="ml-1" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}