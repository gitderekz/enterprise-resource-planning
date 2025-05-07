// app/hr/recruitment/components/InterviewForm.js
import { useState } from 'react';
import axios from 'axios';

const InterviewForm = ({ candidates, onClose, onSave }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [formData, setFormData] = useState({
    candidateId: '',
    jobRequisitionId: '',
    interviewer: '',
    interviewDate: '',
    interviewType: 'Technical',
    location: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert to ISO string for backend
      const interviewToSave = {
        ...formData,
        interviewDate: new Date(formData.interviewDate).toISOString(),
        status: 'Scheduled'
      };
      onSave(interviewToSave);
    } catch (error) {
      console.error('Error scheduling interview:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Schedule Interview</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Candidate</label>
              <select
                className="w-full p-2 border rounded"
                value={formData.candidateId}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const candidate = candidates.find(c => parseInt(c.id) === parseInt(selectedId));                  
                  setFormData({
                    ...formData,
                    candidateId: selectedId,
                    jobRequisitionId: candidate?.jobRequisitionId || ''
                  });
                  setSelectedCandidate(candidate || null); // ✅ update selectedCandidate
                }}
                required
              >
                <option value="">Select Candidate</option>
                {candidates.map(candidate => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.name} ({candidate.positionApplied})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Interviewer</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.interviewer}
                onChange={(e) => setFormData({...formData, interviewer: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Date & Time</label>
              <input
                type="datetime-local"
                className="w-full p-2 border rounded"
                value={formData.interviewDate}
                onChange={(e) => setFormData({...formData, interviewDate: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Interview Type</label>
              <select
                className="w-full p-2 border rounded"
                value={formData.interviewType}
                onChange={(e) => setFormData({...formData, interviewType: e.target.value})}
              >
                <option value="Technical">Technical</option>
                <option value="HR">HR</option>
                <option value="Managerial">Managerial</option>
                <option value="Cultural Fit">Cultural Fit</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Location/Meeting Link</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="Physical location or Zoom/Teams link"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Notes</label>
            <textarea
              className="w-full p-2 border rounded"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
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
              Schedule Interview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewForm;