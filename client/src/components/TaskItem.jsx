import React from 'react';

const TaskItem = ({ task, onTaskUpdated, onTaskDeleted }) => {
  
  const isOverdue = () => {
    if (task.completed) return false; 
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const taskDeadline = new Date(task.deadline);
    taskDeadline.setHours(0, 0, 0, 0);
    
    return taskDeadline < today; 
  };

  const getCategoryStyle = (category) => {
    switch (category) {
      case 'Lab Work': return 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30';
      case 'Project': return 'bg-purple-950/40 text-purple-400 border-purple-500/30';
      case 'Personal': return 'bg-amber-950/40 text-amber-400 border-amber-500/30';
      default: return 'bg-blue-950/40 text-blue-400 border-blue-500/30';
    }
  };

  const getPriorityBorderStyle = (priority) => {
    if (task.completed) return 'border-l-4 border-l-gray-600';
    if (isOverdue()) return 'border-l-4 border-l-red-600 bg-red-950/10'; 
    switch (priority) {
      case 'High': return 'border-l-4 border-l-red-500';
      case 'Low': return 'border-l-4 border-l-emerald-500';
      default: return 'border-l-4 border-l-amber-500';
    }
  };

  const handleToggleComplete = async () => {
    try {
      const userToken = localStorage.getItem('token');
      const response = await fetch(` https://student-task-manager-qfft.onrender.com`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ completed: !task.completed })
      });
      if (response.ok && onTaskUpdated) onTaskUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  // 🗑️ தானாகவே பாப்பப் இல்லாமல் நேரடியாக டெலீட் செய்யும் புதுப்பிக்கப்பட்ட ஃபங்ஷன்
  const handleDelete = async () => {
    try {
      const userToken = localStorage.getItem('token');
      const response = await fetch(`https://student-task-manager-qfft.onrender.com`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      if (response.ok && onTaskDeleted) onTaskDeleted();
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={`p-4 bg-[#090f1c] border rounded-lg mb-3 flex items-start justify-between transition-all duration-200 ${getPriorityBorderStyle(task.priority)} ${task.completed ? 'border-gray-800 opacity-60' : isOverdue() ? 'border-red-900/50' : 'border-gray-800 hover:border-gray-700'}`}>
      <div className="flex-1 pr-4">
        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
          <h4 className={`text-base font-semibold text-white ${task.completed ? 'line-through text-gray-500' : ''}`}>
            {task.title}
          </h4>
          
          <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${getCategoryStyle(task.category)}`}>
            {task.category || 'Assignment'}
          </span>

          <span className={`text-[10px] font-bold uppercase tracking-wider ${task.priority === 'High' ? 'text-red-400' : task.priority === 'Low' ? 'text-emerald-400' : 'text-amber-400'}`}>
            • {task.priority || 'Medium'}
          </span>

          {isOverdue() && (
            <span className="text-[10px] bg-red-950/80 text-red-400 border border-red-800 px-2 py-0.5 rounded font-black uppercase tracking-wider animate-pulse">
              ⚠️ Overdue
            </span>
          )}
        </div>

        <p className="text-sm text-gray-400 mb-2 leading-relaxed">
          {task.description || 'No description provided.'}
        </p>

        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className={isOverdue() ? "text-red-400 font-medium" : ""}>
            Due: {formatDate(task.deadline)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-1">
        <button
          onClick={handleToggleComplete}
          className={`p-1.5 rounded border transition-colors ${task.completed ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </button>

        <button
          onClick={handleDelete}
          className="p-1.5 rounded border border-gray-700 text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-16v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskItem;