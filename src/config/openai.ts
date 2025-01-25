import { config } from '.';

export const openaiConfig = {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  model: 'gpt-4-turbo-preview',
  maxTokens: 1000,
  temperature: 0.7,
} as const;