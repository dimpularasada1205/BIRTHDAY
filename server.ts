import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// High payload limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure persistent storage directories exist
const DATA_DIR = path.resolve(__dirname, 'data');
const UPLOADS_DIR = path.resolve(DATA_DIR, 'uploads');
const MEMORIES_FILE = path.resolve(DATA_DIR, 'memories.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded photos statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Memory persistence endpoints
app.get('/api/memories', (req, res) => {
  try {
    if (fs.existsSync(MEMORIES_FILE)) {
      const data = fs.readFileSync(MEMORIES_FILE, 'utf-8');
      const memories = JSON.parse(data);
      return res.json({ success: true, memories });
    }
    return res.json({ success: true, memories: null });
  } catch (error) {
    console.error('Error reading memories:', error);
    return res.status(500).json({ success: false, error: 'Failed to read memories' });
  }
});

app.post('/api/memories', (req, res) => {
  try {
    const { memories } = req.body;
    if (!Array.isArray(memories)) {
      return res.status(400).json({ success: false, error: 'Invalid memories payload' });
    }
    fs.writeFileSync(MEMORIES_FILE, JSON.stringify(memories, null, 2), 'utf-8');
    return res.json({ success: true, count: memories.length });
  } catch (error) {
    console.error('Error saving memories:', error);
    return res.status(500).json({ success: false, error: 'Failed to save memories' });
  }
});

// Single or multiple image upload endpoint
app.post('/api/upload', (req, res) => {
  try {
    const { imageBase64, filename } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, error: 'Missing image data' });
    }

    // Clean data URL prefix if present
    const matches = imageBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    let buffer: Buffer;
    let ext = 'jpg';

    if (matches && matches.length === 3) {
      const mime = matches[1];
      if (mime.includes('png')) ext = 'png';
      else if (mime.includes('webp')) ext = 'webp';
      else if (mime.includes('gif')) ext = 'gif';
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(imageBase64, 'base64');
    }

    const safeFilename = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, safeFilename);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeFilename}`;
    return res.json({
      success: true,
      url: publicUrl,
      filename: safeFilename,
    });
  } catch (error) {
    console.error('Error handling upload:', error);
    return res.status(500).json({ success: false, error: 'Upload processing failed' });
  }
});

app.delete('/api/memories/:id', (req, res) => {
  try {
    const { id } = req.params;
    if (fs.existsSync(MEMORIES_FILE)) {
      const data = fs.readFileSync(MEMORIES_FILE, 'utf-8');
      const memories = JSON.parse(data);
      const updated = memories.filter((m: { id: string }) => m.id !== id);
      fs.writeFileSync(MEMORIES_FILE, JSON.stringify(updated, null, 2), 'utf-8');
      return res.json({ success: true, memories: updated });
    }
    return res.json({ success: true });
  } catch (error) {
    console.error('Error deleting memory:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete memory' });
  }
});

// Mount Vite middleware for dev or static for prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production' || fs.existsSync(path.resolve(__dirname, 'dist'));

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
