'use client'; // Mark as a Client Component
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <table className="w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="p-4">Username</th>
            <th className="p-4">Email</th>
            <th className="p-4">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="p-4">{user.username}</td>
              <td className="p-4">{user.email}</td>
              <td className="p-4">{user.role_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}