import { getGeminiApiKey } from '../src/lib/geminiCore';

export default function handler(_req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const apiKey = getGeminiApiKey();

  return res.status(200).json({
    status: 'ok',
    hasApiKey: Boolean(apiKey),
    defaultModel: 'gemini-3.1-flash-lite',
    platform: 'vercel-serverless',
  });
}
