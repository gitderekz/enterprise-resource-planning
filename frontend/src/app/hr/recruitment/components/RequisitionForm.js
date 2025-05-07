// app/hr/recruitment/components/RequisitionForm.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const RequisitionForm = ({ requisition, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    position: '',
    department: '',
    jobDescription: '',
    requirements: '',
    salaryRange: '',
    hiringManager: '',
    // status: 'Draft'
  });

  // Pre-fill form if editing
  useEffect(() => {
    if (requisition) {
      setFormData({
        position: requisition.position || '',
        department: requisition.department || '',
        jobDescription: requisition.jobDescription || '',
        requirements: requisition.requirements || '',
        salaryRange: requisition.salaryRange || '',
        hiringManager: requisition.hiringManager || '',
        status: requisition.status || 'Draft'
      });
    }
  }, [requisition]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/hr/recruitment/requisitions`, formData);
      onSuccess(response.data);
      toast.success('Requisition created successfully!');
    } catch (error) {
      toast.error('Failed to create requisition');
      console.error('Error creating requisition:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create Job Requisition</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Position Title</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Department</label>
              <select
                className="w-full p-2 border rounded"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                required
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">Human Resources</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Job Description</label>
            <textarea
              className="w-full p-2 border rounded"
              rows={4}
              value={formData.jobDescription}
              onChange={(e) => setFormData({...formData, jobDescription: e.target.value})}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Requirements</label>
            <textarea
              className="w-full p-2 border rounded"
              rows={4}
              value={formData.requirements}
              onChange={(e) => setFormData({...formData, requirements: e.target.value})}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Salary Range</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.salaryRange}
                onChange={(e) => setFormData({...formData, salaryRange: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Hiring Manager</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.hiringManager}
                onChange={(e) => setFormData({...formData, hiringManager: e.target.value})}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Submit Requisition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequisitionForm;