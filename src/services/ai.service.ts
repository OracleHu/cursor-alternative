import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';
import { Message, ToolCall } from '@types';
import { logger } from '@/utils/logger';

export class AIService {
  private client: Anthropic | null = null;
  private apiKey: string = '';
  private model: string = 'claude-3-5-sonnet-20241022';
  private systemPrompt: string = '';
  private conversationHistory: Message[] = [];

  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY || '';
    if (this.apiKey) {
      this.client = new Anthropic({ apiKey: this.apiKey });
    }
  }

  setApiKey(key: string) {
    this.apiKey = key;
    this.client = new Anthropic({ apiKey: key });
  }

  setModel(model: string) {
    this.model = model;
  }

  setSystemPrompt(prompt: string) {
    this.systemPrompt = prompt;
  }

  addMessage(message: Message) {
    this.conversationHistory.push(message);
  }

  clearHistory() {
    this.conversationHistory = [];
  }

  async chat(
    userMessage: string,
    tools?: any[]
  ): Promise<{ text: string; toolCalls?: ToolCall[] }> {
    if (!this.client) {
      throw new Error('API key not set');
    }

    this.addMessage({
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
    });

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 4096,
        system: this.systemPrompt,
        tools: tools,
        messages: this.conversationHistory
          .filter((m) => m.role !== 'system')
          .map((m) => ({
            role: m.role,
            content: m.content,
          })),
      });

      let textContent = '';
      const toolCalls: ToolCall[] = [];

      for (const block of response.content) {
        if (block.type === 'text') {
          textContent += block.text;
        } else if (block.type === 'tool_use') {
          toolCalls.push({
            id: block.id,
            toolName: block.name,
            input: block.input as any,
          });
        }
      }

      this.addMessage({
        id: Date.now().toString(),
        role: 'assistant',
        content: textContent,
        timestamp: Date.now(),
        toolCalls,
      });

      return { text: textContent, toolCalls };
    } catch (error) {
      logger.error('AI chat error', error);
      throw error;
    }
  }

  getHistory(): Message[] {
    return this.conversationHistory;
  }
}

export const aiService = new AIService();
