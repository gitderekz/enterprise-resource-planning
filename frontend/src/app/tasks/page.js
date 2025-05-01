'use client'; // Mark as a Client Component
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { generatePdf } from '../utils/generatePdf';
import { useWebSocket } from '../lib/WebSocketContext';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const { socket, sendMessage } = useWebSocket();

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        console.log('Received:', event.data);
      };
    }
  }, [socket]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error.response?.data || error.message);
      }
    };    
    fetchTasks();
  }, []);

  const handleDownloadReport = async () => {
    const pdfBytes = await generatePdf(tasks);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'task_report.pdf';
    link.click();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Task Management</h1>
      <div>
        {/* <button onClick={() => sendMessage('Hello from client!')}>Send Message</button> */}
        <button onClick={() => sendMessage({
          type: 'NEW_TASK',
          payload: { id: 1, name: 'My Task' }
        })}>Send Message</button>
      </div>
      <button
        onClick={handleDownloadReport}
        className="bg-blue-500 text-white p-2 rounded mb-4"
      >
        Download Task Report
      </button>
      <table className="w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="p-4">Task Name</th>
            <th className="p-4">Status</th>
            <th className="p-4">Due Date</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className="p-4">{task.name}</td>
              <td className="p-4">{task.status}</td>
              <td className="p-4">{task.due_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}