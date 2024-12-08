import OpenAI from 'openai';

export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not defined in environment variables');
    }

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateCompletion(prompt: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error generating OpenAI completion:', error);
      throw error;
    }
  }
} 