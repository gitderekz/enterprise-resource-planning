'use client';
import React, { useState, useEffect } from 'react';
import { FaTimes, FaCalendarAlt, FaUserEdit } from 'react-icons/fa';
import axios from 'axios';

const ReviewModal = ({ review, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    reviewerId: '',
    reviewDate: new Date().toISOString().split('T')[0],
    scores: {
      quality: 0,
      productivity: 0,
      initiative: 0,
      teamwork: 0,
      communication: 0
    },
    comments: '',
    status: 'pending'
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/employees`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }); // You'll need to create this endpoint
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();

    if (review) {
      setFormData({
        employeeId: review.employeeId,
        reviewerId: review.reviewerId,
        reviewDate: review.reviewDate.split('T')[0],
        scores: typeof review.scores === 'string' ? JSON.parse(review.scores) : review.scores,
        comments: review.comments,
        status: review.status
      });
    }
  }, [review]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleScoreChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      scores: { ...prev.scores, [name]: parseInt(value) || 0 }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {review ? 'Edit Performance Review' : 'Schedule New Review'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="form-group">
              <label className="block text-sm font-medium mb-1">Employee</label>
              <select
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                disabled={!!review}
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.username} ({emp.role?.name??emp.position})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-1">Reviewer</label>
              <select
                name="reviewerId"
                value={formData.reviewerId}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Reviewer</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.username}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-1">Review Date</label>
              <div className="relative">
                <input
                  type="date"
                  name="reviewDate"
                  value={formData.reviewDate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded pl-10"
                  required
                />
                <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

            {/* <div className="mb-4">
                <h3 className="font-medium mb-2 flex items-center">
                    <FaUserEdit className="mr-2" /> Evaluation Scores
                </h3>
                <div className="grid grid-cols-1 gap-4">
                    {Object.entries(formData.scores).map(([key, value]) => (
                    <div key={key} className="form-group">
                        <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium w-32">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                        <input
                            type="number"
                            name={key}
                            min="0"
                            max="100"
                            value={value}
                            onChange={handleScoreChange}
                            className="w-20 p-1 border rounded text-center"
                        />
                        <input
                            type="range"
                            name={key}
                            min="0"
                            max="100"
                            value={value}
                            onChange={handleScoreChange}
                            className="flex-grow ml-2"
                        />
                        </div>
                    </div>
                    ))}
                </div>
            </div> */}
          <div className="mb-4">
            <h3 className="font-medium mb-2 flex items-center">
              <FaUserEdit className="mr-2" /> Evaluation Scores
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(formData.scores).map(([key, value]) => (
                <div key={key} className="form-group">
                  <label className="block text-sm font-medium mb-1">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <input
                    type="range"
                    name={key}
                    min="0"
                    max="100"
                    value={value}
                    onChange={handleScoreChange}
                    className="w-full"
                  />
                  <div className="flex justify-between">
                    <span>0</span>
                    <span>{value}</span>
                    <span>100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group mb-4">
            <label className="block text-sm font-medium mb-1">Comments</label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="3"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {review ? 'Update Review' : 'Create Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;