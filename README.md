# Telegram Story Proxy Server

Backend server that intercepts and proxies Telegram Story API calls through your own server instead of directly to Telegram's servers.

## 🎯 Purpose

This server acts as a middleware/proxy for modified Telegram clients to route story-related API calls through your infrastructure, allowing you to:
- Monitor story API traffic
- Add custom logic before/after story operations
- Cache story data
- Implement custom analytics
- Add additional security layers

## 🚀 Setup

### 1. Deploy to Railway

1. Push this repository to GitHub
2. Go to [Railway.app](https://railway.app/)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select this repository
5. Railway will auto-detect and deploy

### 2. Configure Your Modified Telegram Client

In your modified Telegram source code, replace the API base URL:

```javascript
// Before (default Telegram API)
const API_BASE = 'https://api.telegram.org';

// After (your proxy server)
const API_BASE = 'https://your-railway-app.up.railway.app/api/telegram';
```

Or for story-specific endpoints:
```javascript
const STORY_API_BASE = 'https://your-railway-app.up.railway.app/api/story';
```

### 3. Environment Variables (Optional)

Set in Railway dashboard:
- `TELEGRAM_API_BASE`: Original Telegram API URL (default: https://api.telegram.org)
- `PORT`: Server port (Railway sets this automatically)

## 📡 API Endpoints

### Health Check
```
GET /
GET /health
```

### Generic Telegram Proxy
```
ALL /api/telegram/*
```
Forwards any request to Telegram API while logging and allowing custom processing.

### Story-Specific Endpoints

**Send Story**
```
POST /api/story/send
```

**Get Stories**
```
GET /api/story/list
```

**Delete Story**
```
DELETE /api/story/:id
```

## 🔧 Modifying Telegram Client

### Android (Telegram-FOSS / Official)

Edit `TL_stories.java` or story networking files:

```java
// Original
String apiUrl = "https://api.telegram.org";

// Modified
String apiUrl = "https://your-railway-app.up.railway.app/api/telegram";
```

### iOS

Edit `Api.swift` or networking configuration:

```swift
// Original
let baseURL = "https://api.telegram.org"

// Modified  
let baseURL = "https://your-railway-app.up.railway.app/api/telegram"
```

### Desktop (TDesktop)

Edit `config.h` or API configuration:

```cpp
// Original
constexpr auto kApiBase = "https://api.telegram.org";

// Modified
constexpr auto kApiBase = "https://your-railway-app.up.railway.app/api/telegram";
```

### Web (Telegram Web)

Edit API configuration file:

```javascript
// config.js or api.js
export const API_BASE = 'https://your-railway-app.up.railway.app/api/telegram';
```

## 📝 Logs

The server logs all proxied requests for debugging:
```
[2025-11-16T08:30:00.000Z] POST /api/story/send
[PROXY] POST /stories.sendStory
[HEADERS] {...}
[BODY] {...}
[RESPONSE] Status: 200
```

## 🛡️ Security Notes

- This server forwards all headers including authentication tokens
- Add authentication middleware if you want to restrict access
- Consider adding rate limiting for production use
- Use HTTPS in production (Railway provides this automatically)

## 🔄 How It Works

1. Modified Telegram client makes story API call to your server
2. Your server receives the request and logs it
3. Server forwards request to official Telegram API
4. Telegram responds to your server
5. Your server processes response (optional custom logic)
6. Server forwards response back to client

## 📦 Dependencies

- Express.js: Web server framework
- Axios: HTTP client for proxying requests
- Node.js 18+

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run production server
npm start
```

Server will run on http://localhost:3000

## 📄 License

MIT
