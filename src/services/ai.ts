
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import dotenv from 'dotenv';
import { PERSONAS, PersonaType } from './persona';

dotenv.config();

type Provider = 'openai' | 'anthropic' | 'bedrock';

export class LLMService {
  private openai?: OpenAI;
  private anthropic?: Anthropic;
  private bedrock?: BedrockRuntimeClient;
  private provider: Provider = 'openai';

  constructor() {
    // Lazy initialization
  }

  private init() {
    if (this.openai || this.anthropic || this.bedrock) return;

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
    } else if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
        // AWS SDK will automatically pick up credentials from env or shared config if not explicitly passed,
        // but checking env vars helps us decide to use it as the provider.
        this.bedrock = new BedrockRuntimeClient({ region: process.env.AWS_REGION || "us-east-1" });
        this.provider = 'bedrock';
    } else {
         // Fallback: Check if Bedrock works without explicit keys (e.g. IAM roles)
         // For now, let's require at least one key to be present to avoid confusing errors.
        throw new Error('❌ Missing API Key. Set OPENAI_API_KEY, ANTHROPIC_API_KEY, or AWS Credentials.');
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
      } else if (this.provider === 'openai' && this.openai) {
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
            ],
        });
        return response.choices[0]?.message?.content || 'Bro, OpenAI ghosted us.';
      } else if (this.provider === 'bedrock' && this.bedrock) {
          return this.callBedrock(systemPrompt, userPrompt);
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
        } else if (this.provider === 'openai' && this.openai) {
            const response = await this.openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            });
            content = response.choices[0]?.message?.content || '';
        } else if (this.provider === 'bedrock' && this.bedrock) {
            content = await this.callBedrock(systemPrompt, userPrompt);
        }

        // Extract code block
        const match = content.match(/```(?:\w+)?\n([\s\S]*?)```/);
        return match ? match[1] : content;
      } catch (error) {
          // @ts-ignore
        throw new Error(`AI Error: ${error.message}`);
      }
    }

    private async callBedrock(system: string, user: string): Promise<string> {
        if (!this.bedrock) throw new Error("Bedrock not initialized");

        // Format for Claude 3 / 3.5 / 4.5 on Bedrock
        const payload = {
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 2048,
            system: system,
            messages: [
                { role: "user", content: user }
            ]
        };

        // Allow user to override model ID (e.g. for Claude 4.5)
        const modelId = process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-5-sonnet-20240620-v1:0";

        const command = new InvokeModelCommand({
            modelId: modelId,
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify(payload)
        });

        const response = await this.bedrock.send(command);
        const decoded = new TextDecoder().decode(response.body);
        const json = JSON.parse(decoded);
        return json.content[0].text;
    }
}
