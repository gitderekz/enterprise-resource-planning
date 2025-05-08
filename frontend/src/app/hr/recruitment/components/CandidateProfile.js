// app/hr/recruitment/components/CandidateProfile.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CandidateProfile = ({ candidate, onStatusChange }) => {
  const [notes, setNotes] = useState(candidate.notes || '');
  const [status, setStatus] = useState(candidate.status || 'New');
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    setNotes(candidate.notes||'');
    setStatus(candidate.status||'New');
  },[candidate])

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/hr/recruitment/candidates/${candidate.id}`, {
        notes,
        status
      });
      onStatusChange(response.data);
      toast.success('Candidate updated successfully');
    } catch (error) {
      toast.error('Failed to update candidate');
      console.error('Error updating candidate:', error);
    } finally {
      setLoading(false);
      setNotes('');
      setStatus('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold">{candidate.name}</h2>
          <p className="text-gray-600">{candidate.positionApplied}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs ${
            status === 'Hired' ? 'bg-green-100 text-green-800' :
            status === 'Interview' ? 'bg-blue-100 text-blue-800' :
            status === 'Rejected' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold mb-2">Contact Information</h3>
          <p>Email: {candidate.email}</p>
          <p>Phone: {candidate.phone}</p>
          <p>Location: {candidate.location}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Application Details</h3>
          <p>Applied: {new Date(candidate.applicationDate).toLocaleDateString()}</p>
          <p>Source: {candidate.source}</p>
          <p>Resume: <a href={`${process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '')}${candidate.resumeUrl}`} className="text-blue-600">Download</a></p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Skills & Experience</h3>
        <div className="flex flex-wrap gap-2">
          {candidate.skills?.split(',').map(skill => (
            <span key={skill} className="bg-gray-100 px-2 py-1 rounded text-sm">
              {skill.trim()}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Status</h3>
        <select
          className="w-full p-2 border rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="New">New</option>
          <option value="Screening">Screening</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Hired">Hired</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Notes</h3>
        <textarea
          className="w-full p-2 border rounded"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-blue-400"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default CandidateProfile;