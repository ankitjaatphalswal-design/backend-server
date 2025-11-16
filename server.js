const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors()); // Enable CORS for Telegram client

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Telegram Story Proxy Server is running!', 
    status: 'success',
    endpoints: [
      'POST /api/story/upload',
      'POST /api/story/view',
      'GET /api/story/list/:userId',
      'DELETE /api/story/:storyId',
      'POST /api/story/react'
    ]
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// ==================== TELEGRAM STORY ENDPOINTS ====================

// Upload/Create a new story
app.post('/api/story/upload', async (req, res) => {
  try {
    const { userId, media, caption, privacy, duration } = req.body;

    console.log(`[${new Date().toISOString()}] Story upload request from user: ${userId}`);

    // Validate required fields
    if (!userId || !media) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: userId and media' 
      });
    }

    // Process story upload (implement your logic here)
    const storyId = `story_${Date.now()}_${userId}`;

    // Here you would:
    // 1. Save media to your storage
    // 2. Store story metadata in your database
    // 3. Handle privacy settings
    // 4. Set expiration (24 hours default)

    res.json({
      success: true,
      storyId: storyId,
      message: 'Story uploaded successfully',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      data: {
        storyId,
        userId,
        caption: caption || '',
        privacy: privacy || 'contacts',
        duration: duration || 24,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Story upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// View a story (track views)
app.post('/api/story/view', async (req, res) => {
  try {
    const { storyId, viewerId } = req.body;

    console.log(`[${new Date().toISOString()}] Story view: ${storyId} by ${viewerId}`);

    if (!storyId || !viewerId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing storyId or viewerId' 
      });
    }

    // Record the view in your database
    // Check if story exists and is not expired
    // Update view count

    res.json({
      success: true,
      message: 'Story view recorded',
      data: {
        storyId,
        viewerId,
        viewedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Story view error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get list of stories for a user
app.get('/api/story/list/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    console.log(`[${new Date().toISOString()}] Fetching stories for user: ${userId}`);

    // Fetch stories from your database
    // Filter by expiration
    // Apply privacy rules

    const stories = [
      // Example response structure
      // {
      //   storyId: 'story_123',
      //   userId: userId,
      //   mediaUrl: 'https://your-cdn.com/media.jpg',
      //   caption: 'Hello!',
      //   views: 42,
      //   createdAt: '2025-11-16T00:00:00Z',
      //   expiresAt: '2025-11-17T00:00:00Z'
      // }
    ];

    res.json({
      success: true,
      count: stories.length,
      data: stories
    });
  } catch (error) {
    console.error('Story list error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a story
app.delete('/api/story/:storyId', async (req, res) => {
  try {
    const { storyId } = req.params;
    const { userId } = req.body;

    console.log(`[${new Date().toISOString()}] Deleting story: ${storyId} by user: ${userId}`);

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing userId' 
      });
    }

    // Verify ownership
    // Delete from database
    // Remove media from storage

    res.json({
      success: true,
      message: 'Story deleted successfully',
      storyId
    });
  } catch (error) {
    console.error('Story delete error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// React to a story
app.post('/api/story/react', async (req, res) => {
  try {
    const { storyId, userId, reaction } = req.body;

    console.log(`[${new Date().toISOString()}] Story reaction: ${reaction} on ${storyId} by ${userId}`);

    if (!storyId || !userId || !reaction) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    // Save reaction to database
    // Notify story owner

    res.json({
      success: true,
      message: 'Reaction recorded',
      data: {
        storyId,
        userId,
        reaction,
        reactedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Story react error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get story metadata
app.get('/api/story/:storyId', async (req, res) => {
  try {
    const { storyId } = req.params;

    console.log(`[${new Date().toISOString()}] Fetching story metadata: ${storyId}`);

    // Fetch story details from database
    // Check if expired

    res.json({
      success: true,
      data: {
        storyId,
        userId: 'example_user',
        mediaUrl: 'https://your-cdn.com/media.jpg',
        mediaType: 'image', // or 'video'
        caption: 'Example story',
        views: 0,
        reactions: [],
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
    });
  } catch (error) {
    console.error('Story fetch error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get story viewers
app.get('/api/story/:storyId/viewers', async (req, res) => {
  try {
    const { storyId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    console.log(`[${new Date().toISOString()}] Fetching viewers for story: ${storyId}`);

    // Fetch viewers from database
    const viewers = [];

    res.json({
      success: true,
      count: viewers.length,
      data: viewers
    });
  } catch (error) {
    console.error('Viewers fetch error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found',
    requestedPath: req.path 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Telegram Story Proxy Server running on port ${PORT}`);
  console.log(`[${new Date().toISOString()}] Ready to handle story requests`);
});
