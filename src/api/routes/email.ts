import { Router } from 'express';

const router = Router();

// Mock email generator (no OpenAI yet)
router.post('/generate-email', async (req, res) => {
  const { campaign, audience, tone } = req.body;
  
  // Simulate AI response
  const mockEmail = `Subject: Exciting Update About ${campaign}

Dear ${audience},

This is a ${tone} message about our ${campaign} campaign.

We're excited to share this with you. This is a simulated response until we add the OpenAI API key.

Best regards,
AI Automation Team`;

  res.json({
    success: true,
    email: mockEmail,
    note: "This is a mock response. Add OPENAI_API_KEY to .env for real AI generation"
  });
});

export default router;
