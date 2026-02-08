
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import { PERSONAS, PersonaType } from './persona';

dotenv.config();

type Provider = 'openai' | 'anthropic';

export class LLMService {
  private openai?: OpenAI;
  private anthropic?: Anthropic;
  private provider: Provider = 'openai';

  constructor() {
    // Lazy initialization
  }

  private init() {
    if (this.openai || this.anthropic) return;

    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
      this.provider = 'anthropic';
    } else if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      this.provider = 'openai';
    } else {
        throw new Error('❌ Missing API Key. Set OPENAI_API_KEY or ANTHROPIC_API_KEY.');
    }
  }

  async analyzeCode(code: string, persona: PersonaType, filename: string): Promise<string> {
    this.init();
    const selectedPersona = PERSONAS[persona];
    const systemPrompt = selectedPersona.systemPrompt;
    const userPrompt = `Review this file: ${filename}\n\n\`\`\`\n${code}\n\`\`\``;
    
    try {
      if (this.provider === 'anthropic' && this.anthropic) {
        const response = await this.anthropic.messages.create({
            model: 'claude-3-5-sonnet-20240620',
            max_tokens: 1024,
            system: systemPrompt,
            messages: [{ role: 'user', content: userPrompt }],
        });
        // @ts-ignore
        return response.content[0]?.text || 'Bro, Claude ghosted us.';
      } else if (this.openai) {
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
            ],
        });
        return response.choices[0]?.message?.content || 'Bro, OpenAI ghosted us.';
      }
      return 'No provider initialized.';
    } catch (error) {
        // @ts-ignore
      return `❌ AI Error: ${error.message}`;
    }
  }

  async fixCode(code: string, persona: PersonaType, filename: string): Promise<string> {
      this.init();
      const selectedPersona = PERSONAS[persona];
      const systemPrompt = selectedPersona.systemPrompt + "\n\nIMPORTANT: Return ONLY the fixed code block. No yapping outside the code block. Add comments in the code explaining changes using your persona's slang.";
      const userPrompt = `Fix this broken/bad code: ${filename}\n\n\`\`\`\n${code}\n\`\`\``;

      try {
        let content = '';

        if (this.provider === 'anthropic' && this.anthropic) {
            const response = await this.anthropic.messages.create({
                model: 'claude-3-5-sonnet-20240620',
                max_tokens: 2048,
                system: systemPrompt,
                messages: [{ role: 'user', content: userPrompt }],
            });
            // @ts-ignore
            content = response.content[0]?.text || '';
        } else if (this.openai) {
            const response = await this.openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            });
            content = response.choices[0]?.message?.content || '';
        }

        // Extract code block
        const match = content.match(/```(?:\w+)?\n([\s\S]*?)```/);
        return match ? match[1] : content;
      } catch (error) {
          // @ts-ignore
        throw new Error(`AI Error: ${error.message}`);
      }
    }
}
