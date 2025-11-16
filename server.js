const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS for client requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Telegram API configuration
const TELEGRAM_API_BASE = process.env.TELEGRAM_API_BASE || 'https://api.telegram.org';

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Telegram Story Proxy Server',
    status: 'running',
    endpoints: {
      health: '/health',
      proxy: '/api/telegram/*',
      story: '/api/story/*'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Proxy endpoint for Telegram Story API
app.all('/api/telegram/*', async (req, res) => {
  try {
    const telegramPath = req.path.replace('/api/telegram', '');
    const targetUrl = TELEGRAM_API_BASE + telegramPath;

    console.log(`[PROXY] ${req.method} ${telegramPath}`);
    console.log('[HEADERS]', JSON.stringify(req.headers, null, 2));
    console.log('[BODY]', JSON.stringify(req.body, null, 2));

    // Forward request to Telegram
    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: {
        ...req.headers,
        host: new URL(TELEGRAM_API_BASE).host
      },
      data: req.body,
      params: req.query,
      validateStatus: () => true
    });

    console.log(`[RESPONSE] Status: ${response.status}`);
    res.status(response.status).json(response.data);

  } catch (error) {
    console.error('[ERROR]', error.message);
    res.status(500).json({ 
      error: 'Proxy error',
      message: error.message 
    });
  }
});

// Dedicated Story API endpoints
app.post('/api/story/send', async (req, res) => {
  try {
    console.log('[STORY] Sending story:', req.body);
    const storyData = req.body;
    const response = await axios.post(
      TELEGRAM_API_BASE + '/stories.sendStory',
      storyData,
      { headers: req.headers }
    );
    console.log('[STORY] Story sent successfully');
    res.json(response.data);
  } catch (error) {
    console.error('[STORY ERROR]', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/story/list', async (req, res) => {
  try {
    console.log('[STORY] Fetching stories');
    const response = await axios.get(
      TELEGRAM_API_BASE + '/stories.getAllStories',
      { headers: req.headers, params: req.query }
    );
    res.json(response.data);
  } catch (error) {
    console.error('[STORY ERROR]', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/story/:id', async (req, res) => {
  try {
    const storyId = req.params.id;
    console.log(`[STORY] Deleting story: ${storyId}`);
    const response = await axios.post(
      TELEGRAM_API_BASE + '/stories.deleteStories',
      { id: [storyId] },
      { headers: req.headers }
    );
    res.json(response.data);
  } catch (error) {
    console.error('[STORY ERROR]', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Telegram Story Proxy Server running on port ${PORT}`);
  console.log(`Proxying to: ${TELEGRAM_API_BASE}`);
});
