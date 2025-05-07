// app/hr/recruitment/components/CandidatePool.js
import { useState, useEffect } from 'react';
import { recruitmentService } from '../services/recruitmentService';
import CandidateProfile from './CandidateProfile';

const CandidatePool = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await recruitmentService.getCandidates();
        setCandidates(data);
        setFilteredCandidates(data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = candidates.filter(candidate =>
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.positionApplied.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCandidates(filtered);
    } else {
      setFilteredCandidates(candidates);
    }
  }, [searchTerm, candidates]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-4">Candidate Pool</h2>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, position, or skills..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading candidates...</p>
      ) : (
        <div className="flex gap-4">
          <div className="w-1/3 bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <p className="text-sm text-gray-500">
                Showing {filteredCandidates.length} of {candidates.length} candidates
              </p>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
              {filteredCandidates.map(candidate => (
                <div
                  key={candidate.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedCandidate?.id === candidate.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  <h3 className="font-medium">{candidate.name}</h3>
                  <p className="text-sm text-gray-600">{candidate.positionApplied}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {candidate.status} • {new Date(candidate.applicationDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex-1">
            {selectedCandidate ? (
              <CandidateProfile 
                candidate={selectedCandidate}
                onStatusChange={(updatedCandidate) => {
                  setCandidates(candidates.map(c => 
                    c.id === updatedCandidate.id ? updatedCandidate : c
                  ));
                  setSelectedCandidate(updatedCandidate);
                }}
              />
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p>Select a candidate to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatePool;
// **********************************



// // app/hr/recruitment/components/CandidatePool.js
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import CandidateProfile from './CandidateProfile';

// const CandidatePool = () => {
//   const [candidates, setCandidates] = useState([]);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCandidates = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr/recruitment/candidates`);
//         setCandidates(response.data);
//       } catch (error) {
//         console.error('Error fetching candidates:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCandidates();
//   }, []);

//   return (
//     <div className="mt-4">
//       <h2 className="text-xl font-semibold mb-4">Candidate Pool</h2>
      
//       {loading ? (
//         <p>Loading candidates...</p>
//       ) : (
//         <div className="flex gap-4">
//           <div className="w-1/3 bg-white rounded-lg shadow overflow-hidden">
//             <div className="p-4 border-b">
//               <input
//                 type="text"
//                 placeholder="Search candidates..."
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//             <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
//               {candidates.map(candidate => (
//                 <div
//                   key={candidate.id}
//                   className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
//                     selectedCandidate?.id === candidate.id ? 'bg-blue-50' : ''
//                   }`}
//                   onClick={() => setSelectedCandidate(candidate)}
//                 >
//                   <h3 className="font-medium">{candidate.name}</h3>
//                   <p className="text-sm text-gray-600">{candidate.positionApplied}</p>
//                   <p className="text-xs text-gray-500 mt-1">
//                     Applied: {new Date(candidate.applicationDate).toLocaleDateString()}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
          
//           <div className="flex-1">
//             {selectedCandidate ? (
//               <CandidateProfile 
//                 candidate={selectedCandidate}
//                 onStatusChange={(updatedCandidate) => {
//                   setCandidates(candidates.map(c => 
//                     c.id === updatedCandidate.id ? updatedCandidate : c
//                   ));
//                   setSelectedCandidate(updatedCandidate);
//                 }}
//               />
//             ) : (
//               <div className="bg-white rounded-lg shadow p-6 text-center">
//                 <p>Select a candidate to view details</p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CandidatePool;