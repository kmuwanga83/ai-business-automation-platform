import OpenAI from 'openai';

// Initialize OpenAI (we'll add the API key later)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here',
});

interface EmailRequest {
  campaign: string;
  audience: string;
  tone: 'professional' | 'casual' | 'persuasive';
}

export async function generateEmail(params: EmailRequest) {
  const prompt = `Write a ${params.tone} email for a ${params.campaign} campaign targeting ${params.audience}. Include a subject line and body. Make it engaging and actionable.`;
  
  try {
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
