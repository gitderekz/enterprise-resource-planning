import { useState, useEffect } from 'react';
import { offerService } from '../services/offerService';
import { recruitmentService } from '../services/recruitmentService';
import { toast } from 'react-toastify';

const OfferManagement = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState([]);
  const [interviews, setInterviews] = useState([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [offerData, interviewData] = await Promise.all([
        recruitmentService.getOffers(),
        recruitmentService.getInterviews({ status: 'Completed' })
      ]);
      setOffers(offerData);
      setInterviews(interviewData);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const generateOffer = async (interviewId) => {
    setLoading(true);
    try {
      // const offer = await recruitmentService.generateOffer(interviewId, {
      //   salary: 'Competitive', // Default values
      //   startDate: new Date().toISOString().split('T')[0]
      // });
      // setOffers([...offers, offer]);
      // toast.success('Offer generated!');
      setLoading(true);
      const response = await recruitmentService.generateOffer(interviewId, {
          salary: 'Competitive', // Default values
          startDate: new Date().toISOString().split('T')[0]
        });
      setOffers([...offers, response]);
      toast.success('Offer generated successfully');
      loadData(); // Refresh the data
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error('Interview not completed yet');
      } else {
        // toast.error('Failed to generate offer');
        toast.error(error.response?.data?.message || 'Failed to generate offer');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateOfferStatus = async (offerId, status) => {
    try {
      setLoading(true);
      await recruitmentService.updateOffer(offerId, { status });
      toast.success('Offer updated successfully');
      loadData(); // Refresh the data
    } catch (error) {
      toast.error('Failed to update offer');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await offerService.getOffers();
        setOffers(data);
      } catch (error) {
        console.error('Error fetching offers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  // return (
  //   <div className="p-4">
  //     <h2 className="text-xl font-semibold mb-4">Offer Management</h2>
  //     {loading ? (
  //       <p>Loading offers...</p>
  //     ) : (
  //       <div className="overflow-x-auto">
  //         <table className="min-w-full bg-white">
  //           <thead>
  //             <tr>
  //               <th className="py-2 px-4 border">Candidate</th>
  //               <th className="py-2 px-4 border">Position</th>
  //               <th className="py-2 px-4 border">Status</th>
  //               <th className="py-2 px-4 border">Actions</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {offers.map((offer) => (
  //               <tr key={offer.id}>
  //                 <td className="py-2 px-4 border">{offer.candidateName}</td>
  //                 <td className="py-2 px-4 border">{offer.position}</td>
  //                 <td className="py-2 px-4 border">{offer.status}</td>
  //                 <td className="py-2 px-4 border">
  //                   <button className="mr-2 text-blue-600">View</button>
  //                   <button className="text-green-600">Update</button>
  //                 </td>
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //       </div>
  //     )}
  //   </div>
  // );

  {/* Applicant List */}
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Offer Management</h2>
        {loading ? (
          <p>Loading offers...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Candidate</th>
                  <th className="py-2 px-4 border">Position</th>
                  <th className="py-2 px-4 border">Applied Date</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer.id}>
                    <td className="py-2 px-4 border">{offer.candidate?.name}</td>
                    <td className="py-2 px-4 border">{offer.candidate?.positionApplied}</td>
                    <td className="py-2 px-4 border">{new Date(offer.candidate?.applicationDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border">
                        <span className={`px-2 py-1 rounded text-xs ${
                          offer.status === 'New' ? 'bg-blue-100 text-blue-800' :
                          offer.status === 'Interview' ? 'bg-yellow-100 text-yellow-800' :
                          offer.status === 'Scheduled' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {offer.status}
                        </span>
                      </td>
                    <td className="py-2 px-4 border">
                      {/* <button className="mr-2 text-blue-600">View</button>
                      <button className="text-green-600">Update</button> */}
                      <button 
                        onClick={() => updateOfferStatus(offer.id, 'Accepted')}
                        className="text-green-600 hover:underline"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => updateOfferStatus(offer.id, 'Rejected')}
                        className="text-red-600 hover:underline"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* {interviews.map(interview => (
        <div key={interview.id}>
          <button 
            onClick={() => generateOffer(interview.id)}
            disabled={loading}
          >
            Generate Offer
          </button>
        </div>
      ))} */}
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Generate Offers</h2>
        {interviews.map(interview => (
          <div key={interview.id} className="flex items-center justify-between p-2 border-b">
            <div>
              <p>{interview.candidate?.name} - {interview.jobRequisition?.position}</p>
              <p className="text-sm text-gray-500">
                Interviewed on: {new Date(interview.interviewDate).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => generateOffer(interview.id)}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
            >
              Generate Offer
            </button>
          </div>
        ))}
      </div>
        
      {/* <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Applicants</h2>
        {loading ? (
          <div className="text-center py-8">Loading applicants...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Position</th>
                  <th className="py-2 px-4 border-b">Applied Date</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.length > 0 ? (
                  offers.slice(0, 5).map((applicant) => (
                    <tr key={applicant.id}>
                      <td className="py-2 px-4 border-b">{applicant.candidate.name}</td>
                      <td className="py-2 px-4 border-b">{applicant.candidate.positionApplied}</td>
                      <td className="py-2 px-4 border-b">{new Date(applicant.candidate.applicationDate).toLocaleDateString()}</td>
                      <td className="py-2 px-4 border-b">
                        <span className={`px-2 py-1 rounded text-xs ${
                          applicant.status === 'new' ? 'bg-blue-100 text-blue-800' :
                          applicant.status === 'interview' ? 'bg-yellow-100 text-yellow-800' :
                          applicant.status === 'offer' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {applicant.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button className="text-blue-600 hover:underline mr-2">View</button>
                        <button className="text-gray-600 hover:underline">Edit</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-gray-500">No applicants found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default OfferManagement;