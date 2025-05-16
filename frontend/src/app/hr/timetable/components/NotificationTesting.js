import React, { useState } from 'react';
import { FaBell, FaPaperPlane } from 'react-icons/fa';

const NotificationTesting = ({ employees }) => {
  const [notification, setNotification] = useState({
    title: '',
    message: '',
    type: 'info',
    userIds: [],
    dueDate: ''
  });

  const handleSendNotification = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: notification.title || 'Test Notification',
          message: notification.message || 'This is a test notification from the timetable module',
          type: notification.type,
          userIds: notification.userIds,
          metadata: {
            source: 'timetable',
            dueDate: notification.dueDate
          }
        })
      });

      if (!response.ok) throw new Error('Failed to send notification');
      
      alert('Notification sent successfully!');
      setNotification({
        title: '',
        message: '',
        type: 'info',
        userIds: [],
        dueDate: ''
      });
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Notifications for Activities, Tasks & Events</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={notification.title}
              onChange={(e) => setNotification({...notification, title: e.target.value})}
              placeholder="Notification title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              className="w-full p-2 border rounded"
              value={notification.message}
              onChange={(e) => setNotification({...notification, message: e.target.value})}
              rows={4}
              placeholder="Notification message"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              className="w-full p-2 border rounded"
              value={notification.type}
              onChange={(e) => setNotification({...notification, type: e.target.value})}
            >
              <option value="info">Information</option>
              <option value="warning">Warning</option>
              <option value="urgent">Urgent</option>
              <option value="task">Task</option>
            </select>
          </div>
          
          {notification.type === 'task' && (
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="datetime-local"
                className="w-full p-2 border rounded"
                value={notification.dueDate}
                onChange={(e) => setNotification({...notification, dueDate: e.target.value})}
              />
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Recipients</label>
          <div className="border rounded p-2 h-64 overflow-y-auto">
            {employees.map(employee => (
              <div key={employee.id} className="flex items-center p-2 hover:bg-gray-50">
                <input
                  type="checkbox"
                  id={`emp-${employee.id}`}
                  checked={notification.userIds.includes(employee.id)}
                  onChange={() => {
                    setNotification(prev => ({
                      ...prev,
                      userIds: prev.userIds.includes(employee.id)
                        ? prev.userIds.filter(id => id !== employee.id)
                        : [...prev.userIds, employee.id]
                    }));
                  }}
                  className="mr-2"
                />
                <label htmlFor={`emp-${employee.id}`}>
                  {employee.username} ({employee.email})
                </label>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Selected: {notification.userIds.length} employee(s)
          </p>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleSendNotification}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <FaPaperPlane className="mr-2" />
          Send Notification
        </button>
      </div>
    </div>
  );
};

export default NotificationTesting;