# Telegram Bot Backend Server

This is a Node.js Express server that handles Telegram bot webhooks, specifically designed to work with Telegram's story features.

## Features

- ✅ Telegram webhook integration
- ✅ Story updates handling
- ✅ Message processing
- ✅ Callback query support
- ✅ Railway deployment ready

## Setup Instructions

### 1. Get Your Telegram Bot Token

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Copy the bot token provided by BotFather

### 2. Deploy to Railway

1. Push this repository to GitHub
2. Go to [Railway.app](https://railway.app/)
3. Create a new project from this GitHub repo
4. Add environment variable: `TELEGRAM_BOT_TOKEN` = your bot token
5. Railway will provide you a deployment URL (e.g., `https://your-app.railway.app`)

### 3. Set Webhook

After Railway deployment, set your webhook URL:

**Option A: Using the API endpoint**
```bash
curl -X POST https://your-app.railway.app/set-webhook \
  -H "Content-Type: application/json" \
  -d '{"webhookUrl": "https://your-app.railway.app/webhook"}'
```

**Option B: Using Telegram Bot API directly**
```bash
curl -X POST https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-app.railway.app/webhook", "allowed_updates": ["message", "story", "edited_message"]}'
```

### 4. Verify Webhook

Check if webhook is set correctly:
```bash
curl https://your-app.railway.app/webhook-info
```

## API Endpoints

- `GET /` - Server info and available endpoints
- `GET /health` - Health check endpoint
- `POST /webhook` - Telegram webhook receiver (for Telegram only)
- `POST /set-webhook` - Set webhook URL
- `GET /webhook-info` - Get current webhook information

## Story Feature Integration

The server is configured to receive Telegram story updates. When a story is posted:

1. Telegram sends an update to `/webhook`
2. The `handleStory()` function processes the story
3. You can add custom logic to:
   - Save story data
   - Process media
   - Notify other users
   - Store analytics
   - Trigger other actions

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TELEGRAM_BOT_TOKEN` | Your Telegram bot token from BotFather | Yes |
| `PORT` | Server port (Railway sets this automatically) | No (default: 3000) |

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production
npm start
```

## Telegram Story Updates

To receive story updates, make sure:
1. Your bot has access to stories (check bot permissions)
2. The webhook includes `story` in `allowed_updates`
3. Users have added your bot to their story audience

## Troubleshooting

**Webhook not receiving updates?**
- Check Railway logs for errors
- Verify webhook is set: visit `/webhook-info`
- Ensure TELEGRAM_BOT_TOKEN is correctly set in Railway
- Railway URL must be HTTPS (Railway provides this by default)

**Bot not responding?**
- Check Railway environment variables
- View Railway deployment logs
- Test with `/health` endpoint

## Next Steps

1. Customize `handleStory()` function for your use case
2. Add database integration (MongoDB, PostgreSQL, etc.)
3. Implement story analytics
4. Add user management
5. Create story interaction features

## Learn More

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegram Stories](https://telegram.org/blog/stories)
- [Railway Docs](https://docs.railway.app/)
- [Express.js Docs](https://expressjs.com/)
