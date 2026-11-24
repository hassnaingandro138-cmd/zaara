import { getGeminiApiKey } from '../src/lib/geminiCore';

export default function handler(_req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  return res.status(200).json({
    name: 'MUSTAFA AI Chatbot API',
    status: 'online',
    hasApiKey: Boolean(getGeminiApiKey()),
    endpoints: ['/api/chat', '/api/chat/stream', '/api/health'],
  });
}
