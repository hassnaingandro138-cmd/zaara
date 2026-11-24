import express, { Request, Response, NextFunction } from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import {
  handleChatRequest,
  handleStreamRequest,
  getGeminiApiKey,
} from './src/lib/geminiCore';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = Number(process.env.PORT) || 3000;

// CORS headers for local / proxy requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Chat completion endpoints
app.post('/api/chat', handleChatRequest);
app.post('/api/chat/stream', handleStreamRequest);

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  const apiKey = getGeminiApiKey();
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey),
    defaultModel: 'gemini-3.1-flash-lite',
  });
});

// Always return JSON for unmatched /api/* routes (never HTML)
app.use('/api', (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found.',
  });
});

// JSON error handler for malformed JSON bodies or middleware errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api')) {
    const status = err?.status || err?.statusCode || 400;
    return res.status(status).json({
      success: false,
      error: err?.message || 'Invalid API request.',
    });
  }
  next(err);
});

// Vite middleware integration for development / static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
