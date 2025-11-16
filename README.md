# Telegram Story Proxy Server

This backend server acts as a proxy/relay for Telegram's story feature when modifying the Telegram source code.

## 🚀 Features

- **Story Upload/Create**: Handle story creation requests from your modified Telegram client
- **Story Viewing**: Track and record story views
- **Story Management**: List, delete, and manage stories
- **Reactions**: Handle story reactions
- **Privacy Controls**: Support for different privacy settings

## 📡 API Endpoints

### Story Operations

#### Upload Story
```bash
POST /api/story/upload
Content-Type: application/json

{
  "userId": "user_123",
  "media": "base64_or_url",
  "caption": "My story!",
  "privacy": "contacts",
  "duration": 24
}
```

#### View Story
```bash
POST /api/story/view
Content-Type: application/json

{
  "storyId": "story_123",
  "viewerId": "user_456"
}
```

#### Get User Stories
```bash
GET /api/story/list/:userId?limit=20&offset=0
```

#### Delete Story
```bash
DELETE /api/story/:storyId
Content-Type: application/json

{
  "userId": "user_123"
}
```

#### React to Story
```bash
POST /api/story/react
Content-Type: application/json

{
  "storyId": "story_123",
  "userId": "user_456",
  "reaction": "❤️"
}
```

#### Get Story Details
```bash
GET /api/story/:storyId
```

#### Get Story Viewers
```bash
GET /api/story/:storyId/viewers?limit=50&offset=0
```

## 🔧 Integration with Telegram Source Code

To integrate with your modified Telegram client:

1. **Locate Story API Calls**: Find the story-related API calls in Telegram's source code (usually in `TDLib` or the networking layer)

2. **Redirect Endpoints**: Change the API endpoints to point to your server:
   - Original: `https://api.telegram.org/...`
   - New: `https://your-server.railway.app/api/story/...`

3. **Update Request Format**: Ensure your modified client sends requests in the format expected by this server

4. **Handle Responses**: Update response parsing to match the JSON structure returned by this server

## 🛠️ Local Development

```bash
npm install
npm run dev
```

Server will run on `http://localhost:3000`

## 🌐 Production Deployment (Railway)

1. Push this code to GitHub
2. Deploy on Railway
3. Copy the generated URL
4. Update your Telegram source code to use this URL

## 📝 Next Steps

1. **Add Database**: Integrate PostgreSQL/MongoDB to store stories
2. **Add Storage**: Use AWS S3/Cloudinary for media files
3. **Add Authentication**: Implement JWT or API key authentication
4. **Add Encryption**: Encrypt story data for privacy
5. **Add Caching**: Use Redis for better performance

## 🔒 Security Considerations

- Implement rate limiting
- Add authentication/authorization
- Validate all inputs
- Encrypt sensitive data
- Use HTTPS in production
- Implement CORS properly

## 𓓚 Resources

- [Telegram API Documentation](https://core.telegram.org/api)
- [TDLib Documentation](https://core.telegram.org/tdlib)
- [Express.js Documentation](https://expressjs.com/)
