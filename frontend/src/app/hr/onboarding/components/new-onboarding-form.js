'use client';
import React, { useState, useEffect } from 'react';
import { FaUser, FaCalendarAlt, FaChevronDown, FaTimes } from 'react-icons/fa';
import axios from 'axios';

export default function NewOnboardingForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    candidateId: '',
    startDate: new Date().toISOString().split('T')[0],
    assignedTo: '',
    notes: ''
  });
  const [candidates, setCandidates] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCandidateDropdown, setShowCandidateDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchCandidate, setSearchCandidate] = useState('');
  const [searchUser, setSearchUser] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [candidatesRes, usersRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr/recruitment/candidates`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);
        setCandidates(candidatesRes.data);
        setUsers(usersRes.data);
        setFilteredCandidates(candidatesRes.data);
        setFilteredUsers(usersRes.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchCandidate) {
      setFilteredCandidates(
        candidates.filter(candidate =>
          candidate.name.toLowerCase().includes(searchCandidate.toLowerCase()) ||
          candidate.positionApplied.toLowerCase().includes(searchCandidate.toLowerCase())
        )
      );
    } else {
      setFilteredCandidates(candidates);
    }
  }, [searchCandidate, candidates]);

  useEffect(() => {
    if (searchUser) {
      setFilteredUsers(
        users.filter(user =>
          user.username.toLowerCase().includes(searchUser.toLowerCase()) ||
          user.email.toLowerCase().includes(searchUser.toLowerCase())
        )
      );
    } else {
      setFilteredUsers(users);
    }
  }, [searchUser, users]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/hr/onboarding`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const selectCandidate = (candidate) => {
    setFormData({ ...formData, candidateId: candidate.id });
    setSearchCandidate(candidate.name);
    setShowCandidateDropdown(false);
  };

  const selectUser = (user) => {
    setFormData({ ...formData, assignedTo: user.id });
    setSearchUser(user.username);
    setShowUserDropdown(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Create New Onboarding</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Candidate</label>
          <div className="relative">
            <div className="flex items-center border border-gray-300 rounded p-2">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="text"
                className="flex-grow outline-none"
                placeholder="Search candidate..."
                value={searchCandidate}
                onChange={(e) => {
                  setSearchCandidate(e.target.value);
                  if (!showCandidateDropdown) setShowCandidateDropdown(true);
                }}
                onFocus={() => setShowCandidateDropdown(true)}
              />
              <button
                type="button"
                onClick={() => setShowCandidateDropdown(!showCandidateDropdown)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaChevronDown />
              </button>
            </div>
            {showCandidateDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 max-h-60 overflow-auto">
                {filteredCandidates.length === 0 ? (
                  <div className="px-4 py-2 text-gray-500">No candidates found</div>
                ) : (
                  filteredCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                      onClick={() => selectCandidate(candidate)}
                    >
                      <div>
                        <div className="font-medium">{candidate.name}</div>
                        <div className="text-sm text-gray-500">{candidate.positionApplied}</div>
                      </div>
                      {formData.candidateId === candidate.id && (
                        <FaCheck className="text-green-500" />
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
          <div className="relative">
            <div className="flex items-center border border-gray-300 rounded p-2">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="text"
                className="flex-grow outline-none"
                placeholder="Search user..."
                value={searchUser}
                onChange={(e) => {
                  setSearchUser(e.target.value);
                  if (!showUserDropdown) setShowUserDropdown(true);
                }}
                onFocus={() => setShowUserDropdown(true)}
              />
              <button
                type="button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaChevronDown />
              </button>
            </div>
            {showUserDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 max-h-60 overflow-auto">
                {filteredUsers.length === 0 ? (
                  <div className="px-4 py-2 text-gray-500">No users found</div>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                      onClick={() => selectUser(user)}
                    >
                      <div>
                        <div className="font-medium">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                      {formData.assignedTo === user.id && (
                        <FaCheck className="text-green-500" />
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <div className="flex items-center border border-gray-300 rounded p-2">
            <FaCalendarAlt className="text-gray-400 mr-2" />
            <input
              type="date"
              className="flex-grow outline-none"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            rows="3"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={!formData.candidateId}
          >
            Create Onboarding
          </button>
        </div>
      </form>
    </div>
  );
}