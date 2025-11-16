const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Telegram Bot Token from environment variable
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

// Middleware to parse JSON
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Telegram Bot Server is running!', 
    status: 'success',
    endpoints: {
      webhook: '/webhook',
      health: '/health',
      setWebhook: '/set-webhook'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    bot_configured: !!BOT_TOKEN
  });
});

// Telegram webhook endpoint - receives all updates
app.post('/webhook', (req, res) => {
  console.log('Received webhook:', JSON.stringify(req.body, null, 2));

  const update = req.body;

  // Handle different update types
  if (update.message) {
    handleMessage(update.message);
  } else if (update.story) {
    handleStory(update.story);
  } else if (update.edited_message) {
    handleEditedMessage(update.edited_message);
  } else if (update.callback_query) {
    handleCallbackQuery(update.callback_query);
  }

  // Always respond 200 OK to Telegram
  res.sendStatus(200);
});

// Handle regular messages
function handleMessage(message) {
  console.log('Message received:', {
    chat_id: message.chat.id,
    text: message.text,
    from: message.from.username
  });

  // Example: Echo back the message
  if (message.text) {
    sendMessage(message.chat.id, `You said: ${message.text}`);
  }
}

// Handle story updates
function handleStory(story) {
  console.log('Story update received:', story);

  // Add your story handling logic here
  // For example: save story, process media, notify users, etc.
}

// Handle edited messages
function handleEditedMessage(message) {
  console.log('Edited message:', message);
}

// Handle callback queries (from inline buttons)
function handleCallbackQuery(query) {
  console.log('Callback query:', query);
}

// Function to send messages via Telegram API
async function sendMessage(chatId, text) {
  if (!BOT_TOKEN) {
    console.error('BOT_TOKEN not configured');
    return;
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text
      })
    });

    const data = await response.json();
    console.log('Message sent:', data);
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

// Endpoint to set webhook URL
app.post('/set-webhook', async (req, res) => {
  const { webhookUrl } = req.body;

  if (!BOT_TOKEN) {
    return res.status(400).json({ error: 'BOT_TOKEN not configured' });
  }

  if (!webhookUrl) {
    return res.status(400).json({ error: 'webhookUrl is required' });
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ['message', 'story', 'edited_message', 'callback_query']
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get webhook info
app.get('/webhook-info', async (req, res) => {
  if (!BOT_TOKEN) {
    return res.status(400).json({ error: 'BOT_TOKEN not configured' });
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Telegram Bot Server is running on port ${PORT}`);
  if (BOT_TOKEN) {
    console.log('Bot token configured ✓');
  } else {
    console.warn('Warning: TELEGRAM_BOT_TOKEN not set!');
  }
});
