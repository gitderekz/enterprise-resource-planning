'use client';
import React, { useState } from 'react';
import { FaSearch, FaFilter, FaPlus, FaEdit, FaTrash, FaCheck, FaClock, FaTimes } from 'react-icons/fa';
import ReviewModal from './ReviewModal';

const PerformanceReviews = ({ reviews, onEdit, onDelete, onCreate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // const filteredReviews = reviews
  //   ?.filter(review => 
  //     (review.employee?.username?.toLowerCase().includes(searchTerm.toLowerCase())) ||
  //     (review.reviewer?.username?.toLowerCase().includes(searchTerm.toLowerCase())) ||
  //     (review.employee?.position?.toLowerCase().includes(searchTerm.toLowerCase())))
  //   ?.filter(review => filterStatus === 'all' || review.status === filterStatus);
  const filteredReviews = reviews
  ?.filter(review => 
    (review.employee?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     review.reviewer?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     review.employee?.position?.toLowerCase().includes(searchTerm.toLowerCase()))
  )
  .filter(review => filterStatus === 'all' || review.status === filterStatus);


  const statusIcons = {
    pending: <FaClock className="text-yellow-500" />,
    in_progress: <FaClock className="text-blue-500" />,
    completed: <FaCheck className="text-green-500" />,
    cancelled: <FaTimes className="text-red-500" />
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const handleEditClick = (review) => {
    setSelectedReview(review);
    setShowModal(true);
  };

  const handleCreateClick = () => {
    setSelectedReview(null);
    setShowModal(true);
  };

  const handleSubmit = (reviewData) => {
    if (selectedReview) {
      onEdit(selectedReview.id, reviewData);
    } else {
      onCreate(reviewData);
    }
    setShowModal(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {showModal && (
        <ReviewModal
          review={selectedReview}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />
      )}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold">Performance Reviews</h2>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search reviews..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative flex-grow md:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border rounded-lg w-full"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <button 
            onClick={handleCreateClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FaPlus /> Schedule Review
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b text-left">Employee</th>
              <th className="py-3 px-4 border-b text-left">Position/Role</th>
              <th className="py-3 px-4 border-b text-left">Reviewer</th>
              <th className="py-3 px-4 border-b text-left">Review Date</th>
              <th className="py-3 px-4 border-b text-left">Last Review</th>
              <th className="py-3 px-4 border-b text-left">Status</th>
              <th className="py-3 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews?.map((review) => (
              <tr key={review.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">{review.employee?.username}</td>
                <td className="py-3 px-4 border-b">{review.employee?.position || review.employee?.role?.name}</td>
                <td className="py-3 px-4 border-b">{review.reviewer?.username}</td>
                <td className="py-3 px-4 border-b">
                  {new Date(review.reviewDate).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 border-b">
                  {review.lastReviewDate ? new Date(review.lastReviewDate).toLocaleDateString() : 'N/A'}
                </td>
                <td className="py-3 px-4 border-b">
                  <span className={`px-3 py-1 rounded-full text-xs ${statusColors[review.status]}`}>
                    {statusIcons[review.status]} {review.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3 px-4 border-b">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditClick(review)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => onDelete(review.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerformanceReviews;
// ********************************************



// 'use client';
// import React, { useState } from 'react';
// import { FaSearch, FaFilter, FaPlus, FaEdit, FaTrash, FaCheck, FaClock, FaTimes } from 'react-icons/fa';

// const PerformanceReviews = ({ reviews, onEdit, onDelete }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');

//   const filteredReviews = reviews
//     ?.filter(review => 
//       (review.employee?.username?.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (review.reviewer?.username?.toLowerCase().includes(searchTerm.toLowerCase())))
//     ?.filter(review => filterStatus === 'all' || review.status === filterStatus);

//   const statusIcons = {
//     pending: <FaClock className="text-yellow-500" />,
//     in_progress: <FaClock className="text-blue-500" />,
//     completed: <FaCheck className="text-green-500" />,
//     cancelled: <FaTimes className="text-red-500" />
//   };

//   const statusColors = {
//     pending: 'bg-yellow-100 text-yellow-800',
//     in_progress: 'bg-blue-100 text-blue-800',
//     completed: 'bg-green-100 text-green-800',
//     cancelled: 'bg-red-100 text-red-800'
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
//         <h2 className="text-xl font-semibold">Performance Reviews</h2>
//         <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
//           <div className="relative flex-grow md:w-64">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaSearch className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search reviews..."
//               className="pl-10 pr-4 py-2 border rounded-lg w-full"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <div className="relative flex-grow md:w-48">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaFilter className="text-gray-400" />
//             </div>
//             <select
//               className="pl-10 pr-4 py-2 border rounded-lg w-full"
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//             >
//               <option value="all">All Statuses</option>
//               <option value="pending">Pending</option>
//               <option value="in_progress">In Progress</option>
//               <option value="completed">Completed</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
//           </div>
//           <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
//             <FaPlus /> Schedule Review
//           </button>
//         </div>
//       </div>
      
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white">
//           <thead>
//             <tr>
//               <th className="py-3 px-4 border-b text-left">Employee</th>
//               <th className="py-3 px-4 border-b text-left">Reviewer</th>
//               <th className="py-3 px-4 border-b text-left">Review Date</th>
//               <th className="py-3 px-4 border-b text-left">Status</th>
//               <th className="py-3 px-4 border-b text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredReviews?.map((review) => (
//               <tr key={review.id} className="hover:bg-gray-50">
//                 <td className="py-3 px-4 border-b">{review.employee?.username}</td>
//                 <td className="py-3 px-4 border-b">{review.reviewer?.username}</td>
//                 <td className="py-3 px-4 border-b">
//                   {new Date(review.reviewDate).toLocaleDateString()}
//                 </td>
//                 <td className="py-3 px-4 border-b">
//                   <span className={`px-3 py-1 rounded-full text-xs ${statusColors[review.status]}`}>
//                     {statusIcons[review.status]} {review.status.replace('_', ' ')}
//                   </span>
//                 </td>
//                 <td className="py-3 px-4 border-b">
//                   <div className="flex gap-2">
//                     <button 
//                       onClick={() => onEdit(review)}
//                       className="p-2 text-blue-600 hover:bg-blue-50 rounded"
//                     >
//                       <FaEdit />
//                     </button>
//                     <button 
//                       onClick={() => onDelete(review.id)}
//                       className="p-2 text-red-600 hover:bg-red-50 rounded"
//                     >
//                       <FaTrash />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default PerformanceReviews;