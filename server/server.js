import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

// Fathis Fashion ப்ராஜெக்ட் மெத்தட் படி நேரடியாக டேட்டாபேஸ் கனெக்ஷன் அழைக்கப்படுகிறது
connectDB();

const app = express();

// Middlewares setup
app.use(cors());
app.use(express.json());

// API Endpoints Mapping
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ message: err.message });
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));