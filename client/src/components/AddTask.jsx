import React, { useState } from 'react';

const AddTask = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('Assignment');
  const [priority, setPriority] = useState('Medium');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !deadline) {
      setError('Title and deadline are required');
      return;
    }

    try {
      const userToken = localStorage.getItem('token');
      
      const response = await fetch('https://student-task-manager-qfft.onrender.com/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ title, description, deadline, category, priority })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setTitle('');
      setDescription('');
      setDeadline('');
      setCategory('Assignment'); 
      setPriority('Medium'); 
      
      if (onTaskAdded) onTaskAdded();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="task-form-container">
      <h3 className="text-xl font-bold mb-4 text-white">Create New Task</h3>
      
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 p-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1 font-bold">Task Title *</label>
          <input
            type="text"
            className="w-full bg-[#0d1527] border border-gray-700 rounded p-2 text-white text-sm focus:outline-none focus:border-indigo-500"
            placeholder="e.g., Physics Lab Report"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1 font-bold">Description</label>
          <textarea
            className="w-full bg-[#0d1527] border border-gray-700 rounded p-2 text-white text-sm h-24 focus:outline-none focus:border-indigo-500 resize-none"
            placeholder="Add assignment specifics or resources..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

      
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1 font-bold">Category</label>
          <select
            className="w-full bg-[#0d1527] border border-gray-700 rounded p-2 text-white text-sm focus:outline-none focus:border-indigo-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Assignment">📝 Assignment</option>
            <option value="Lab Work">🧪 Lab Work</option>
            <option value="Project">💻 Project</option>
            <option value="Personal">👤 Personal</option>
          </select>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1 font-bold">Priority Level</label>
          <select
            className="w-full bg-[#0d1527] border border-gray-700 rounded p-2 text-white text-sm focus:outline-none focus:border-indigo-500"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="High">🔴 High Priority</option>
            <option value="Medium">🟠 Medium Priority</option>
            <option value="Low">🟢 Low Priority</option>
          </select>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1 font-bold">Deadline *</label>
          <input
            type="date"
            className="w-full bg-[#0d1527] border border-gray-700 rounded p-2 text-white text-sm focus:outline-none focus:border-indigo-500"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded text-sm flex items-center justify-center gap-2 transition-colors duration-200"
        >
          <span>➕ Append Assignment</span>
        </button>
      </form>
    </div>
  );
};

export default AddTask;