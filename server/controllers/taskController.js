// Mock Database Array - இதில் default-ஆக category சேர்க்கப்பட்டுள்ளது
let tasksMockDB = [
  {
    _id: "mock1",
    title: "Complete Web Development Assignment",
    description: "Submit the final MERN stack task manager build to the evaluator node.",
    deadline: new Date(Date.now() + 86400000).toISOString(),
    category: "Project", // புதிய ஃபீல்டு
    completed: false
  },
  {
    _id: "mock2",
    title: "Database Schema Documentation",
    description: "Write structural overview for MongoDB models.",
    deadline: new Date(Date.now() - 86400000).toISOString(),
    category: "Assignment", // புதிய ஃபீல்டு
    completed: false
  }
];

import Task from '../models/Task.js';

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.json(tasksMockDB);
  }
};

export const createTask = async (req, res) => {
  // body-யில் இருந்து category-யையும் வாங்குகிறோம்
  const { title, description, deadline, category } = req.body;
  if (!title || !deadline) return res.status(400).json({ message: 'Title and deadline are required' });

  try {
    const task = await Task.create({ 
      user: req.user._id, 
      title, 
      description, 
      deadline, 
      category: category || 'Assignment' 
    });
    res.status(201).json(task);
  } catch (error) {
    // மாற்று வழி: புது டாஸ்க்கை category-யுடன் அரேயில் சேர்க்கும்
    const newTask = {
      _id: "mock_" + Date.now(),
      title,
      description,
      deadline,
      category: category || 'Assignment', // கொடுக்கவில்லை என்றால் 'Assignment' என்று எடுத்துக்கொள்ளும்
      completed: false
    };
    tasksMockDB.unshift(newTask);
    res.status(201).json(newTask);
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOne({ _id: id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    task.completed = req.body.completed ?? task.completed;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    tasksMockDB = tasksMockDB.map(t => t._id === id ? { ...t, ...req.body } : t);
    const updated = tasksMockDB.find(t => t._id === id);
    res.json(updated);
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await Task.deleteOne({ _id: id, user: req.user._id });
    res.json({ message: 'Task removed successfully' });
  } catch (error) {
    tasksMockDB = tasksMockDB.filter(t => t._id !== id);
    res.json({ message: 'Task removed successfully' });
  }
};