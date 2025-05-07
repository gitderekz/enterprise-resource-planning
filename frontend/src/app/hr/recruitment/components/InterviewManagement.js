// app/hr/recruitment/components/InterviewManagement.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import InterviewForm from './InterviewForm';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { recruitmentService } from '../services/recruitmentService';

const InterviewManagement = () => {
  const [interviews, setInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    candidateId: '',
    interviewer: '',
    interviewDate: '',
    jobRequisitionId: ''
  });


  // const loadData = async () => {
  //   try {
  //     const [interviewData, candidateData] = await Promise.all([
  //       recruitmentService.getInterviews(),
  //       recruitmentService.getCandidates({ status: 'Screening' })
  //     ]);
  //     setInterviews(interviewData);
  //     setCandidates(candidateData);
  //   } catch (error) {
  //     toast.error('Failed to load data');
  //   }
  // };
  const loadData = async () => {
    try {
      const data = await recruitmentService.getInterviews();
      setInterviews(data);
      
      // Only show candidates in screening status
      const candidatesData = await recruitmentService.getCandidates({
        status: 'Screening'
      });
      setCandidates(candidatesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  // const scheduleInterview = async () => {
  //   try {
  //     if (!formData.candidateId || !formData.interviewDate) {
  //       throw new Error('Candidate and date are required');
  //     }
      
  //     const newInterview = await recruitmentService.scheduleInterview(formData);
  //     setInterviews([...interviews, newInterview]);
  //     toast.success('Interview scheduled!');
  //     setShowForm(false);
  //   } catch (error) {
  //     if (error.message.includes('required')) {
  //       toast.error(error.message);
  //     } else {
  //       toast.error('Failed to schedule interview');
  //     }
  //   }
  // };
  const scheduleInterview = async (interviewData) => {
    try {
      const newInterview = await recruitmentService.scheduleInterview(interviewData);
      setInterviews([...interviews, newInterview.interview]);
      
      // Update candidate status to Interview
      await recruitmentService.updateCandidate(newInterview.candidate.id, {
        status: 'Interview'
      });
      
      setShowForm(false);
    } catch (error) {
      if (error.message.includes('required')) {
        toast.error(error.message);
      } else {
        console.error('Failed to schedule interview:', error);
        toast.error('Failed to schedule interview');
      }
    }
  };

  useEffect(() => { loadData(); }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [interviewsRes, candidatesRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr/recruitment/interviews`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr/recruitment/candidates`)
        ]);
        setInterviews(interviewsRes.data);
        setCandidates(candidatesRes.data);
      } catch (error) {
        toast.error('Failed to load interview data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleScheduleInterview = async (interviewData) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/hr/recruitment/interviews`, interviewData);
      setInterviews([...interviews, response.data]);
      toast.success('Interview scheduled successfully!');
      setShowForm(false);
    } catch (error) {
      toast.error('Failed to schedule interview');
    }
  };

  const handleUpdateInterview = async (id, updates) => {
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/hr/recruitment/interviews/${id}`, updates);
      setInterviews(interviews.map(i => i.id === id ? response.data : i));
      toast.success('Interview updated successfully!');
    } catch (error) {
      toast.error('Failed to update interview');
    }
  };

  useEffect(() => {
    const updated = interviews.filter(interview => {
      const interviewDate = new Date(interview.interviewDate);
      return (
        interviewDate.getDate() /*===*/ >= selectedDate.getDate() &&
        interviewDate.getMonth() /*===*/ >= selectedDate.getMonth() &&
        interviewDate.getFullYear() /*===*/ >= selectedDate.getFullYear()
      );
    });
    setFilteredInterviews(updated);
  }, [interviews, selectedDate]);
  
  // const filteredInterviews = interviews.filter(interview => {
  //   const interviewDate = new Date(interview.interviewDate);
  //   return (
  //     interviewDate.getDate() === selectedDate.getDate() &&
  //     interviewDate.getMonth() === selectedDate.getMonth() &&
  //     interviewDate.getFullYear() === selectedDate.getFullYear()
  //   );
  // });

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Interview Management</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Schedule Interview
        </button>
      </div>

      {showForm && (
        <>
        <InterviewForm 
          candidates={candidates}
          onClose={() => setShowForm(false)}
          // onSave={handleScheduleInterview}
          onSave={scheduleInterview}
        />
          <button onClick={scheduleInterview}>Confirm</button>
        </>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={({ date, view }) => {
              if (view === 'month') {
                const hasInterview = interviews.some(interview => {
                  const interviewDate = new Date(interview.interviewDate);
                  return (
                    interviewDate.getDate() === date.getDate() &&
                    interviewDate.getMonth() === date.getMonth() &&
                    interviewDate.getFullYear() === date.getFullYear()
                  );
                });
                return hasInterview ? <div className="dot-indicator"></div> : null;
              }
            }}
          />
          <style jsx>{`
            .dot-indicator {
              height: 6px;
              width: 6px;
              background-color: #3b82f6;
              border-radius: 50%;
              display: inline-block;
              margin-top: 2px;
            }
          `}</style>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-lg font-medium mb-3">
            Interviews for {selectedDate.toLocaleDateString()}
          </h3>
          
          {loading ? (
            <p>Loading interviews...</p>
          ) : filteredInterviews.length > 0 ? (
            <div className="space-y-4">
              {filteredInterviews.map(interview => {
                const candidate = candidates.find(c => c.id === interview.candidateId);
                return (
                  <div key={interview.id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">
                          {candidate ? candidate.name : 'Unknown Candidate'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {candidate ? candidate.positionApplied : ''}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        interview.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        interview.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {interview.status}
                      </span>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Time:</span>{' '}
                          {new Date(interview.interviewDate).toLocaleTimeString()}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Interviewer:</span>{' '}
                          {interview.interviewer}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Type:</span>{' '}
                          {interview.interviewType || 'Not specified'}
                        </p>
                        {interview.location && (
                          <p className="text-sm">
                            <span className="font-medium">Location:</span>{' '}
                            {interview.location}
                          </p>
                        )}
                      </div>
                    </div>

                    {interview.status === 'Completed' && interview.feedback && (
                      <div className="mt-3">
                        <p className="font-medium text-sm">Feedback:</p>
                        <p className="text-sm">{interview.feedback}</p>
                        {interview.rating && (
                          <p className="text-sm mt-1">
                            <span className="font-medium">Rating:</span>{' '}
                            {interview.rating}/5
                          </p>
                        )}
                      </div>
                    )}

                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        onClick={() => {
                          const newStatus = interview.status === 'Scheduled' 
                            ? 'Completed' 
                            : 'Scheduled';
                          handleUpdateInterview(interview.id, { status: newStatus });
                        }}
                        className="text-sm px-3 py-1 border rounded"
                      >
                        Mark as {interview.status === 'Scheduled' ? 'Completed' : 'Scheduled'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p>No interviews scheduled for this date</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewManagement;