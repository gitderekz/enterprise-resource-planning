'use client';
import React, { useState, useEffect } from 'react';
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const PerformanceSettings = () => {
  const [criteria, setCriteria] = useState([]);
  const [newCriterion, setNewCriterion] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    reviewFrequency: 'quarterly',
    ratingScale: 5,
    selfAssessment: true,
    peerAssessment: false,
    managerAssessment: true
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Fetch existing settings and criteria
        const [settingsRes, criteriaRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr/performance/settings`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr/performance/criteria`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);
        
        setSettings(settingsRes.data);
        setCriteria(criteriaRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

    const handleSaveCriteria = async () => {
        try {
            setLoading(true);
            const response = await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/hr/performance/criteria`,
            { criteria },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setCriteria(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddCriterion = () => {
    if (newCriterion.trim()) {
      setCriteria([...criteria, { id: Date.now(), name: newCriterion, weight: 20 }]);
      setNewCriterion('');
    }
  };

  const handleRemoveCriterion = (id) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  const handleWeightChange = (id, value) => {
    setCriteria(criteria.map(c => 
      c.id === id ? { ...c, weight: parseInt(value) || 0 } : c
    ));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await Promise.all([
        axios.put(`${process.env.NEXT_PUBLIC_API_URL}/hr/performance/settings`, settings, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.put(`${process.env.NEXT_PUBLIC_API_URL}/hr/performance/criteria`, { criteria }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);
      // Show success message
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading settings...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Review Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Review Frequency</label>
            <select
              name="reviewFrequency"
              value={settings.reviewFrequency}
              onChange={handleSettingChange}
              className="w-full p-2 border rounded"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="biannually">Biannually</option>
              <option value="annually">Annually</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Rating Scale</label>
            <select
              name="ratingScale"
              value={settings.ratingScale}
              onChange={handleSettingChange}
              className="w-full p-2 border rounded"
            >
              <option value="3">3-point scale</option>
              <option value="5">5-point scale</option>
              <option value="10">10-point scale</option>
              <option value="100">Percentage (0-100)</option>
            </select>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <label className="block text-sm font-medium mb-2">Assessment Types</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="selfAssessment"
                checked={settings.selfAssessment}
                onChange={handleSettingChange}
                className="mr-2"
              />
              Self Assessment
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="peerAssessment"
                checked={settings.peerAssessment}
                onChange={handleSettingChange}
                className="mr-2"
              />
              Peer Assessment
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="managerAssessment"
                checked={settings.managerAssessment}
                onChange={handleSettingChange}
                className="mr-2"
              />
              Manager Assessment
            </label>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <FaSave /> Save Settings
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Evaluation Criteria</h2>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newCriterion}
            onChange={(e) => setNewCriterion(e.target.value)}
            placeholder="New criterion name"
            className="flex-grow p-2 border rounded"
          />
          <button
            onClick={handleAddCriterion}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
          >
            <FaPlus /> Add
          </button>
        </div>

        <div className="space-y-2">
          {criteria.map((criterion) => (
            <div key={criterion.id} className="flex items-center gap-4 p-2 border rounded">
              <span className="flex-grow">{criterion.name}</span>
              <div className="flex items-center gap-2 w-32">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={criterion.weight}
                  onChange={(e) => handleWeightChange(criterion.id, e.target.value)}
                  className="w-16 p-1 border rounded text-right"
                />
                <span>% weight</span>
              </div>
              <button
                onClick={() => handleRemoveCriterion(criterion.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        {criteria.length > 0 && (
          <div className="mt-4 flex justify-between items-center">
            <div>
              Total Weight: {criteria.reduce((sum, c) => sum + c.weight, 0)}%
            </div>
            <button
              onClick={handleSaveCriteria}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <FaSave /> Save Criteria
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceSettings;