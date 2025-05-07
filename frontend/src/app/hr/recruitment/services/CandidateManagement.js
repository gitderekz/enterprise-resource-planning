import { useState, useEffect } from 'react';
import { recruitmentService } from '../services/recruitmentService';

export default function CandidateManagement() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    recruitmentService.getCandidates().then(setCandidates);
  }, []);

  const handleStatusChange = async (id, status) => {
    const updated = await recruitmentService.updateCandidate(id, { status });
    setCandidates(candidates.map(c => c.id === id ? updated : c));
    setSelectedCandidate(updated);
  };

  return (
    <div className="flex gap-4 mt-4">
      {/* Candidate List */}
      <div className="w-1/3 border rounded-lg overflow-hidden">
        {candidates.map(candidate => (
          <div key={candidate.id} 
            className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
              selectedCandidate?.id === candidate.id ? 'bg-blue-50' : ''
            }`}
            onClick={() => setSelectedCandidate(candidate)}
          >
            <h3 className="font-medium">{candidate.name}</h3>
            <p className="text-sm text-gray-600">{candidate.position}</p>
          </div>
        ))}
      </div>

      {/* Candidate Details */}
      {selectedCandidate ? (
        <div className="flex-1 p-4 border rounded-lg">
          <h2 className="text-xl font-bold">{selectedCandidate.name}</h2>
          <select
            value={selectedCandidate.status}
            onChange={(e) => handleStatusChange(selectedCandidate.id, e.target.value)}
            className="mt-2 p-2 border rounded"
          >
            {['New', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'].map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p>Select a candidate</p>
        </div>
      )}
    </div>
  );
}