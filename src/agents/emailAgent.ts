import OpenAI from 'openai';

// Initialize OpenAI only if API key exists
let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

interface EmailRequest {
  campaign: string;
  audience: string;
  tone: 'professional' | 'casual' | 'persuasive';
  instructions?: string;
}

export async function generateEmail(params: EmailRequest) {
  // If OpenAI is not configured, return mock response
  if (!openai || !process.env.OPENAI_API_KEY) {
    console.log('OpenAI not configured - returning mock email');
    
    const mockEmails = {
      professional: `Subject: Strategic Partnership Opportunity: ${params.campaign}

Dear Valued ${params.audience},

We are pleased to announce our new ${params.campaign} initiative. This strategic move is designed to enhance your business operations and drive significant growth.

Key benefits include:
• Increased efficiency through automation
• Enhanced customer engagement
• Scalable solutions for your needs

We look forward to discussing how this can benefit your organization.

Best regards,
AI Business Automation Team`,
      
      casual: `Subject: Exciting news about ${params.campaign}! 🎉

Hey ${params.audience}!

Guess what? We just launched something awesome called ${params.campaign}, and we thought you'd love to know about it!

Here's the scoop:
• It's super easy to use
• It'll save you tons of time
• Your customers will love it

Want to learn more? Let's chat!

Cheers,
The AI Team`,
      
      persuasive: `Subject: Urgent: Transform your business with ${params.campaign}

Attention ${params.audience},

Don't miss this opportunity to revolutionize your business with ${params.campaign}.

Why act now?
✅ Limited time offer
✅ Exclusive early access benefits
✅ Competitive advantage in your market

Join industry leaders who are already transforming their operations.

Act now - your competitors will!

Sincerely,
AI Business Automation`
    };
    
    const tone = params.tone || 'professional';
    const email = mockEmails[tone as keyof typeof mockEmails] || mockEmails.professional;
    
    return {
      success: true,
      email: email,
      mock: true,
      message: "This is a demo email. Add OPENAI_API_KEY to your .env file for AI-generated content."
    };
  }
  
  // Real OpenAI implementation
  try {
    const prompt = `Write a ${params.tone} email for a ${params.campaign} campaign targeting ${params.audience}. 
    ${params.instructions ? `Additional instructions: ${params.instructions}` : ''}
    Make it engaging and actionable. Include a subject line.`;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });
    
    return {
      success: true,
      email: completion.choices[0].message.content,
      tokens_used: completion.usage?.total_tokens || 0,
      model: completion.model
    };
  } catch (error) {
    console.error('OpenAI error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate email'
    };
  }
}
