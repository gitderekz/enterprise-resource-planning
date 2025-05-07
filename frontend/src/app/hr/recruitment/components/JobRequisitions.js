// app/hr/recruitment/components/JobRequisitions.js
import { useState, useEffect } from 'react';
import { recruitmentService } from '../services/recruitmentService';
import RequisitionForm from './RequisitionForm';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const JobRequisitions = () => {
  const [requisitions, setRequisitions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadRequisitions = async () => {
    setLoading(true);
    try {
      const data = await recruitmentService.getJobRequisitions();
      setRequisitions(data);
    } catch (error) {
      toast.error('Failed to load requisitions');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (requisition) => {
    setSelectedReq(requisition);
    setShowViewModal(true);
  };

  const handleEdit = (requisition) => {
    setSelectedReq(requisition);
    setShowForm(true);
  };

  useEffect(() => {
    loadRequisitions();
  }, []);

  return (
    <div className="space-y-4">
      
      {showViewModal && selectedReq && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedReq.position}</h2>
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Details</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Department:</span> {selectedReq.department}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        selectedReq.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        selectedReq.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedReq.status}
                      </span>
                    </p>
                    <p><span className="font-medium">Salary Range:</span> {selectedReq.salaryRange}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <div className="prose max-w-none">
                    {selectedReq.jobDescription}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Requirements</h3>
                <div className="prose max-w-none">
                  {selectedReq.requirements}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Job Requisitions</h2>
        <button
          onClick={() => {
            setSelectedReq(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Requisition
        </button>
      </div>

      {showForm && (
        <RequisitionForm
          requisition={selectedReq}
          onClose={() => {
            setShowForm(false);
            setSelectedReq(null);
          }}
          onSuccess={() => {
            loadRequisitions();
            setShowForm(false);
          }}
        />
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Position</th>
              <th className="px-4 py-2 text-left">Department</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requisitions.map(req => (
              <tr key={req.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{req.position}</td>
                <td className="px-4 py-2">{req.department}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    req.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleView(req.id)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(req)}
                    className="text-gray-600 hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobRequisitions;
// ********************************



// // app/hr/recruitment/components/JobRequisitions.js
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import RequisitionForm from './RequisitionForm';

// const JobRequisitions = () => {
//   const [requisitions, setRequisitions] = useState([]);
//   const [showForm, setShowForm] = useState(false);

//   useEffect(() => {
//     const fetchRequisitions = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr/recruitment/requisitions`);
//         setRequisitions(response.data);
//       } catch (error) {
//         console.error('Error fetching requisitions:', error);
//       }
//     };
//     fetchRequisitions();
//   }, []);

//   return (
//     <div className="mt-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">Job Requisitions</h2>
//         <button 
//           onClick={() => setShowForm(true)}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Create Requisition
//         </button>
//       </div>

//       {showForm && (
//         <RequisitionForm 
//           onClose={() => setShowForm(false)}
//           onSuccess={(newReq) => {
//             setRequisitions([...requisitions, newReq]);
//             setShowForm(false);
//           }}
//         />
//       )}

//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-4 py-2 text-left">Position</th>
//               <th className="px-4 py-2 text-left">Department</th>
//               <th className="py-4 px-2 text-left">Applicants</th>
//               <th className="px-4 py-2 text-left">Status</th>
//               <th className="px-4 py-2 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {requisitions.map(req => (
//               <tr key={req.id} className="border-t">
//                 <td className="px-4 py-2">{req.position}</td>
//                 <td className="px-4 py-2">{req.department}</td>
//                 <td className="px-4 py-2">{req.number_of_applicants}</td>
//                 <td className="px-4 py-2">
//                   <span className={`px-2 py-1 rounded text-xs ${
//                     req.status === 'Approved' ? 'bg-green-100 text-green-800' :
//                     req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
//                     'bg-red-100 text-red-800'
//                   }`}>
//                     {req.status}
//                   </span>
//                 </td>
//                 <td className="px-4 py-2">
//                   <button className="text-blue-600 hover:underline mr-2">View</button>
//                   <button className="text-gray-600 hover:underline">Edit</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );

//   // {/* Open Positions */}
//   // return (
//   //   <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//   //     <div className="flex justify-between items-center mb-4">
//   //       <h2 className="text-xl font-semibold">Open Positions</h2>
//   //       <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//   //         Create Position
//   //       </button>
//   //     </div>
//   //     <div className="overflow-x-auto">
//   //       <table className="min-w-full bg-white">
//   //         <thead>
//   //           <tr>
//   //             <th className="py-2 px-4 border-b">Position</th>
//   //             <th className="py-2 px-4 border-b">Department</th>
//   //             <th className="py-2 px-4 border-b">Applicants</th>
//   //             <th className="py-2 px-4 border-b">Status</th>
//   //             <th className="py-2 px-4 border-b">Actions</th>
//   //           </tr>
//   //         </thead>
//   //         <tbody>
//   //           {[...Array(3)].map((_, i) => (
//   //             <tr key={i}>
//   //               <td className="py-2 px-4 border-b">Position {i + 1}</td>
//   //               <td className="py-2 px-4 border-b">Department {i + 1}</td>
//   //               <td className="py-2 px-4 border-b">{Math.floor(Math.random() * 10) + 1}</td>
//   //               <td className="py-2 px-4 border-b">
//   //                 <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
//   //                   Active
//   //                 </span>
//   //               </td>
//   //               <td className="py-2 px-4 border-b">
//   //                 <button className="text-blue-600 hover:underline mr-2">View</button>
//   //                 <button className="text-gray-600 hover:underline">Edit</button>
//   //               </td>
//   //             </tr>
//   //           ))}
//   //         </tbody>
//   //       </table>
//   //     </div>
//   //   </div>
//   // );
// };

// export default JobRequisitions;