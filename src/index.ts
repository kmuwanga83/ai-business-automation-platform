import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import emailRoutes from './api/routes/email';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'online', timestamp: new Date().toISOString() });
});

// Basic automation endpoint
app.post('/api/automate', async (req, res) => {
  const { task, input } = req.body;
  
  res.json({ 
    success: true, 
    message: 'Server is working!',
    output: `Received task: ${task || 'no task'} with input: ${input || 'no input'}`
  });
});

// Email routes
app.use('/api/email', emailRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📧 Email endpoint: http://localhost:${PORT}/api/email/generate-email`);
  console.log(`🤖 Test endpoint: http://localhost:${PORT}/api/automate`);
});

export default app;
