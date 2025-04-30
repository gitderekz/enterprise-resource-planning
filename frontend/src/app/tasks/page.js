'use client'; // Mark as a Client Component
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { generatePdf } from '../utils/generatePdf';
import { WebSocketContext } from '../lib/WebSocketContext';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const { socket } = useContext(WebSocketContext);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        console.log('Received:', event.data);
      };
    }
  }, [socket]);

  const sendMessage = () => {
    if (socket) {
      socket.send('Hello from client!');
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
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
        <button onClick={sendMessage}>Send Message</button>
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