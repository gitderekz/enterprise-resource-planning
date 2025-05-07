// app/careers/page.js
'use client';
import { useState, useEffect } from 'react';
import CandidateForm from '../hr/recruitment/components/CandidateForm';

export default function CareersPage() {
  const [submitted, setSubmitted] = useState(false);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState(null);


  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hr/recruitment/requisitions`);
        const data = await response.json();
        setPositions(data.filter(job => job.status === 'Open'));
      } catch (error) {
        console.error('Failed to load positions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPositions();
  }, []);

  if (loading) return <div>Loading available positions...</div>;


  return (
    <main className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Join Our Team</h1>
      
      {submitted ? (
        <div className="bg-green-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Thank You!</h2>
          <p>Your application has been submitted successfully.</p>
          <p>We'll review your information and get back to you soon.</p>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Open Positions</h2>
            <div className="space-y-4">
              {positions.map(position => (
                <div key={position.id} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-xl font-medium">{position.position}</h3>
                  <p className="text-gray-600 mb-2">{position.department}</p>
                  <button 
                    onClick={() => setSelectedPosition(position)}
                    className="text-blue-600 hover:underline"
                  >
                    Apply for this position
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {selectedPosition && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">
                Applying for: {selectedPosition.position}
              </h2>
              <CandidateForm 
                jobRequisitionId={selectedPosition.id} 
                positionApplied={selectedPosition.position}
                onSuccess={() => setSubmitted(true)}
                onCancel={() => setSelectedPosition(null)}
              />
            </div>
          )}
        </>
      )}
    </main>
  );
}