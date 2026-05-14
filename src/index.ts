import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import emailRoutes from './api/routes/email';
import paymentRoutes from './api/routes/payment';

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

// Routes
app.use('/api/email', emailRoutes);
app.use('/api/payment', paymentRoutes);

// Serve static files from mobile/www
app.use(express.static('mobile/www'));

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📧 Email endpoint: http://localhost:${PORT}/api/email/generate-email`);
  console.log(`💰 Payment plans: http://localhost:${PORT}/api/payment/plans`);
  console.log(`💳 Payment UI: http://localhost:${PORT}/payment.html`);
});

export default app;
