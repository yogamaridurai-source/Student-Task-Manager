import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AddTask from './components/AddTask';
import TaskItem from './components/TaskItem';
import Auth from './components/Auth';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  // 🆕 5. FILTER & SORT STATES
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortByDeadline, setSortByDeadline] = useState(false);

  const fetchTasks = async () => {
    if (!token) return;
    try {
      const response = await fetch('https://student-task-manager-qfft.onrender.com/tasks', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setTasks(data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const handleLogin = (userToken, userData) => {
    setToken(userToken);
    setUser(userData);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    setTasks([]);
    localStorage.clear();
  };

  // 📊 ANALYTICS CALCULATIONS
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 🆕 5. FILTERING & SORTING LOGIC (டாஸ்க்குகளை பிரித்தெடுத்தல்)
  let displayedTasks = [...tasks];

  // கேடகரி படி ஃபில்டர் செய்கிறது
  if (categoryFilter !== 'All') {
    displayedTasks = displayedTasks.filter(task => task.category === categoryFilter);
  }

  // டெட்லைன் தேதியின் அடிப்படையில் வரிசைப்படுத்துகிறது (Earliest Deadline First)
  if (sortByDeadline) {
    displayedTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  }

  if (!token) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#020813] text-white font-sans">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-1">
          <AddTask onTaskAdded={fetchTasks} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          
          {/* PROGRESS BAR & ANALYTICS DASHBOARD CARD */}
          <div className="p-5 bg-[#090f1c] border border-gray-800 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">Workspace Analytics</h3>
                <p className="text-xs text-gray-400">Track your assignment compilation progress</p>
              </div>
              <span className="text-2xl font-black text-indigo-400">{progressPercentage}%</span>
            </div>

            <div className="w-full bg-[#111a2e] h-2.5 rounded-full overflow-hidden border border-gray-800">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-[#0c1527] border border-gray-800/60 p-2.5 rounded-lg text-center">
                <span className="block text-xs text-gray-400 font-medium">Total</span>
                <span className="text-lg font-bold text-indigo-300">{totalTasks}</span>
              </div>
              <div className="bg-[#0c1527] border border-gray-800/60 p-2.5 rounded-lg text-center">
                <span className="block text-xs text-gray-400 font-medium">Completed</span>
                <span className="text-lg font-bold text-emerald-400">{completedTasks}</span>
              </div>
              <div className="bg-[#0c1527] border border-gray-800/60 p-2.5 rounded-lg text-center">
                <span className="block text-xs text-gray-400 font-medium">Pending</span>
                <span className="text-lg font-bold text-amber-400">{pendingTasks}</span>
              </div>
            </div>
          </div>

          {/* டாஸ்க் லிஸ்ட் கார்டுகள் மற்றும் 🆕 ஃபில்டர் கன்ட்ரோல்கள் */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 bg-[#090f1c] p-3 border border-gray-800 rounded-lg">
              
              {/* கேடகரி ஃபில்டர் செலக்ட் பாக்ஸ் */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-bold uppercase">Filter:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-[#0c1527] border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="All">📁 All Categories</option>
                  <option value="Assignment">📝 Assignments</option>
                  <option value="Lab Work">🧪 Lab Work</option>
                  <option value="Project">💻 Projects</option>
                  <option value="Personal">👤 Personal</option>
                </select>
              </div>

              {/* டெட்லைன் போர்ட் சார்ட்டிங் பட்டன் */}
              <button
                onClick={() => setSortByDeadline(!sortByDeadline)}
                className={`text-xs px-3 py-1 rounded border font-medium transition-colors ${sortByDeadline ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-[#0c1527] border-gray-700 text-gray-300 hover:border-gray-600'}`}
              >
                {sortByDeadline ? '⏰ Sorted by Due Date' : '⏳ Sort by Deadline'}
              </button>
            </div>

            {/* டாஸ்க் லூப்பிங் - இங்கு 'tasks'-க்கு பதிலாக 'displayedTasks' பயன்படுத்தப்பட்டுள்ளது */}
            {displayedTasks.length === 0 ? (
              <div className="p-8 bg-[#090f1c] border border-gray-800 border-dashed rounded-lg text-center text-gray-500 text-sm">
                No matching assignments found for the active timeline filter.
              </div>
            ) : (
              displayedTasks.map(task => (
                <TaskItem 
                  key={task._id} 
                  task={task} 
                  onTaskUpdated={fetchTasks} 
                  onTaskDeleted={fetchTasks} 
                />
              ))
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;