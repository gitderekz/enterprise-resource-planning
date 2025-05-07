// app/hr/recruitment/components/CandidateForm.js
'use client';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ResumeUpload from './ResumeUpload';

export default function CandidateForm({ 
  jobRequisitionId, 
  positionApplied,
  onSuccess,
  onCancel 
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    source: 'Website',
    jobRequisitionId,
    positionApplied
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formPayload.append(key, value);
      });
      if (file) formPayload.append('resume', file);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/hr/recruitment/candidates`,
        formPayload,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      toast.success('Application submitted successfully!');
      onSuccess(response.data);
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Invalid file type or size');
      } else if (error.response?.status === 413) {
        toast.error('File size exceeds 5MB limit');
      } else {
        toast.error('Failed to submit application');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {/* <div>
          <label className="block mb-1">Position Applied</label>
          <input
            type="text"
            name="positionApplied"
            value={formData.positionApplied}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div> */}
      </div>

      <div>
        <label className="block mb-1">Skills</label>
        <textarea
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={3}
        />
      </div>

      <div>
        <label className="block mb-1">How did you hear about us?</label>
        <select
          name="source"
          value={formData.source}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Website">Company Website</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Job Board">Job Board</option>
          <option value="Referral">Referral</option>
        </select>
      </div>

      <div>
        <label className="block mb-1">Resume</label>
        <ResumeUpload onFileSelect={setFile} />
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded"
        >
          Back to Positions
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-blue-400"
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </form>
  );
}