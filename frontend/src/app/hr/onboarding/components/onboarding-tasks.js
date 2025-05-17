'use client';
import React, { useState, useEffect } from 'react';
import { 
  FaCheck, 
  FaCalendarAlt, 
  FaUser, 
  FaExclamationTriangle, 
  FaArrowLeft,
  FaSpinner,
  FaEdit,
  FaTrash,
  FaChevronDown
} from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};

const statusColors = {
  pending: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800'
};

const statusIcons = {
  pending: <FaExclamationTriangle className="text-gray-500" />,
  in_progress: <FaSpinner className="text-blue-500 animate-spin" />,
  completed: <FaCheck className="text-green-500" />,
  overdue: <FaExclamationTriangle className="text-red-500" />
};

export default function OnboardingTasks({ onboarding, onTaskUpdate }) {
  const [users, setUsers] = useState([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTask, setNewTask] = useState({
    taskName: '',
    description: '',
    dueDate: '',
    priority: 'medium'
  });
  const [editTask, setEditTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

    // fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setUsers(res.data);
            setFilteredUsers(res.data);
            } catch (err) {
            console.error('Failed to fetch users', err);
            }
        };
        fetchUsers();
    }, []);

    // effect to filter users based on search
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

    // function to select a user
    const selectUser = (user) => {
        if (isEditing) {
            setEditTask({...editTask, assignedTo: user.id});
        } else {
            setNewTask({...newTask, assignedTo: user.id});
        }
        setSearchUser(user.username);
        setShowUserDropdown(false);
    };


  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr/onboarding/${onboarding.id}/tasks`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTasks(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [onboarding.id]);

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/hr/onboarding/tasks/${taskId}`, {
        status: newStatus,
        completedDate: newStatus === 'completed' ? new Date().toISOString() : null
      }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success(`Task marked as ${newStatus.replace('_', ' ')}`);
      fetchTasks();
      onTaskUpdate();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      toast.error('Failed to update task status');
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      if (!newTask.assignedTo) {
        throw new Error('Please assign the task to a user');
      }
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/hr/onboarding/${onboarding.id}/tasks`, newTask, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Task added successfully');
      setNewTask({
        taskName: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        assignedTo: ''
      });
      setSearchUser('');
      fetchTasks();
      onTaskUpdate();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      toast.error(err.message || 'Failed to add task');
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      if (!editTask.assignedTo) {
        throw new Error('Please assign the task to a user');
      }
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/hr/onboarding/tasks/${editTask.id}`, editTask, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Task updated successfully');
      setEditTask(null);
      setIsEditing(false);
      setSearchUser('');
      fetchTasks();
      onTaskUpdate();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      toast.error(err.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/hr/onboarding/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Task deleted successfully');
      fetchTasks();
      onTaskUpdate();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      toast.error('Failed to delete task');
    }
  };

  const startEditing = (task) => {
    setEditTask(task);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditTask(null);
    setIsEditing(false);
  };

  const updateOnboardingStatus = async (newStatus) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/hr/onboarding/${onboarding.id}`, {
        status: newStatus,
        completionDate: newStatus === 'completed' ? new Date().toISOString() : onboarding.completionDate
      }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success(`Onboarding status updated to ${newStatus.replace('_', ' ')}`);
      onTaskUpdate();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      toast.error('Failed to update onboarding status');
    }
  };

  const updateOnboardingStage = async (newStage) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/hr/onboarding/${onboarding.id}`, {
        currentStage: newStage
      }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success(`Onboarding stage updated to ${newStage.replace('_', ' ')}`);
      onTaskUpdate();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      toast.error('Failed to update onboarding stage');
    }
  };

  const updateCompletionDate = async (date) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/hr/onboarding/${onboarding.id}`, {
        completionDate: date
      }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Completion date updated');
      onTaskUpdate();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      toast.error('Failed to update completion date');
    }
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
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <button 
              onClick={() => onTaskUpdate()} 
              className="mr-4 text-blue-600 hover:text-blue-800"
            >
              <FaArrowLeft />
            </button>
            Tasks for {onboarding.candidate.name}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span>Status:</span>
              <select
                value={onboarding.status}
                onChange={(e) => updateOnboardingStatus(e.target.value)}
                className="border rounded p-1"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span>Stage:</span>
              <select
                value={onboarding.currentStage}
                onChange={(e) => updateOnboardingStage(e.target.value)}
                className="border rounded p-1"
              >
                <option value="paperwork">Paperwork</option>
                <option value="training">Training</option>
                <option value="equipment">Equipment</option>
                <option value="orientation">Orientation</option>
                <option value="final_review">Final Review</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span>Completion:</span>
              <input
                type="date"
                value={onboarding.completionDate ? onboarding.completionDate.split('T')[0] : ''}
                onChange={(e) => updateCompletionDate(e.target.value)}
                className="border rounded p-1"
              />
            </div>
          </div>
        </div>

        {/* Add/Edit Task Form */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">
            {isEditing ? 'Edit Task' : 'Add New Task'}
          </h3>
          <form onSubmit={isEditing ? handleUpdateTask : handleAddTask} className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={isEditing ? editTask.taskName : newTask.taskName}
                onChange={(e) => isEditing 
                  ? setEditTask({...editTask, taskName: e.target.value})
                  : setNewTask({...newTask, taskName: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded"
                rows="3"
                value={isEditing ? editTask.description : newTask.description}
                onChange={(e) => isEditing
                  ? setEditTask({...editTask, description: e.target.value})
                  : setNewTask({...newTask, description: e.target.value})}
              />
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
                            {(isEditing ? editTask.assignedTo : newTask.assignedTo) === user.id && (
                            <FaCheck className="text-green-500" />
                            )}
                        </div>
                        ))
                    )}
                    </div>
                )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={isEditing 
                    ? (editTask.dueDate ? editTask.dueDate.split('T')[0] : '')
                    : newTask.dueDate}
                  onChange={(e) => isEditing
                    ? setEditTask({...editTask, dueDate: e.target.value})
                    : setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded"
                  value={isEditing ? editTask.priority : newTask.priority}
                  onChange={(e) => isEditing
                    ? setEditTask({...editTask, priority: e.target.value})
                    : setNewTask({...newTask, priority: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              {isEditing && (
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {isEditing ? 'Update Task' : 'Add Task'}
              </button>
            </div>
          </form>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <p className="text-gray-500">No tasks found for this onboarding.</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium flex items-center">
                      {task.taskName}
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                    </h3>
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    )}
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <FaUser className="mr-1" />
                      <span className="mr-4">{task.assignedUser?.username || 'Unassigned'}</span>
                      {task.dueDate && (
                        <>
                          <FaCalendarAlt className="mr-1" />
                          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {statusIcons[task.status]}
                      <select
                        value={task.status}
                        onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                        className="ml-2 border rounded p-1 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </div>
                    <button
                      onClick={() => startEditing(task)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                      title="Edit task"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Delete task"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
// *************************************



// 'use client';
// import React, { useState, useEffect } from 'react';
// import { FaCheck, FaCalendarAlt, FaUser, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
// import axios from 'axios';

// const priorityColors = {
//   low: 'bg-blue-100 text-blue-800',
//   medium: 'bg-yellow-100 text-yellow-800',
//   high: 'bg-red-100 text-red-800'
// };

// const statusColors = {
//   pending: 'bg-gray-100 text-gray-800',
//   in_progress: 'bg-blue-100 text-blue-800',
//   completed: 'bg-green-100 text-green-800',
//   overdue: 'bg-red-100 text-red-800'
// };

// export default function OnboardingTasks({ onboarding, onTaskUpdate }) {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [newTask, setNewTask] = useState({
//     taskName: '',
//     description: '',
//     dueDate: '',
//     priority: 'medium'
//   });

//   const fetchTasks = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr/onboarding/${onboarding.id}/tasks`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       setTasks(res.data);
//     } catch (err) {
//       setError(err.response?.data?.message || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, [onboarding.id]);

//   const handleTaskStatusChange = async (taskId, newStatus) => {
//     try {
//       await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/hr/onboarding/tasks/${taskId}`, {
//         status: newStatus,
//         completedDate: newStatus === 'completed' ? new Date().toISOString() : null
//       }, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       fetchTasks();
//       onTaskUpdate();
//     } catch (err) {
//       setError(err.response?.data?.message || err.message);
//     }
//   };

//   const handleAddTask = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/hr/onboarding/${onboarding.id}/tasks`, newTask, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       setNewTask({
//         taskName: '',
//         description: '',
//         dueDate: '',
//         priority: 'medium'
//       });
//       fetchTasks();
//       onTaskUpdate();
//     } catch (err) {
//       setError(err.response?.data?.message || err.message);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
//         <p className="font-bold">Error</p>
//         <p>{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="bg-white rounded-lg shadow p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold flex items-center">
//             <button 
//               onClick={() => onTaskUpdate()} 
//               className="mr-4 text-blue-600 hover:text-blue-800"
//             >
//               <FaArrowLeft />
//             </button>
//             Tasks for {onboarding.candidate.name}
//           </h2>
//           <div className="flex items-center">
//             <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[onboarding.status]}`}>
//               {onboarding.status.replace('_', ' ')}
//             </span>
//             <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${priorityColors[onboarding.currentStage]}`}>
//               {onboarding.currentStage.replace('_', ' ')}
//             </span>
//           </div>
//         </div>

//         <div className="mb-8">
//           <h3 className="text-lg font-medium mb-4">Add New Task</h3>
//           <form onSubmit={handleAddTask} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
//               <input
//                 type="text"
//                 className="w-full p-2 border border-gray-300 rounded"
//                 value={newTask.taskName}
//                 onChange={(e) => setNewTask({...newTask, taskName: e.target.value})}
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
//               <input
//                 type="date"
//                 className="w-full p-2 border border-gray-300 rounded"
//                 value={newTask.dueDate}
//                 onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
//               <select
//                 className="w-full p-2 border border-gray-300 rounded"
//                 value={newTask.priority}
//                 onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
//               >
//                 <option value="low">Low</option>
//                 <option value="medium">Medium</option>
//                 <option value="high">High</option>
//               </select>
//             </div>
//             <div className="flex items-end">
//               <button
//                 type="submit"
//                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//               >
//                 Add Task
//               </button>
//             </div>
//           </form>
//         </div>

//         <div className="space-y-4">
//           {tasks.length === 0 ? (
//             <p className="text-gray-500">No tasks found for this onboarding.</p>
//           ) : (
//             tasks.map((task) => (
//               <div key={task.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h3 className="font-medium flex items-center">
//                       {task.taskName}
//                       <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
//                         {task.priority}
//                       </span>
//                     </h3>
//                     {task.description && (
//                       <p className="text-sm text-gray-600 mt-1">{task.description}</p>
//                     )}
//                     <div className="flex items-center mt-2 text-sm text-gray-500">
//                       <FaUser className="mr-1" />
//                       <span className="mr-4">{task.assignedUser?.username || 'Unassigned'}</span>
//                       {task.dueDate && (
//                         <>
//                           <FaCalendarAlt className="mr-1" />
//                           <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                   <div className="flex items-center">
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium mr-4 ${statusColors[task.status]}`}>
//                       {task.status.replace('_', ' ')}
//                     </span>
//                     {task.status !== 'completed' ? (
//                       <button
//                         onClick={() => handleTaskStatusChange(task.id, 'completed')}
//                         className="text-green-600 hover:text-green-800 p-2"
//                         title="Mark as completed"
//                       >
//                         <FaCheck />
//                       </button>
//                     ) : (
//                       <button
//                         onClick={() => handleTaskStatusChange(task.id, 'pending')}
//                         className="text-gray-600 hover:text-gray-800 p-2"
//                         title="Reopen task"
//                       >
//                         <FaExclamationTriangle />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }