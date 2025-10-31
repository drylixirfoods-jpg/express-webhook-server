// Load environment variables
require('dotenv').config();

// Core dependencies
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Module imports
const prospecting = require('./modules/prospecting');
const reels = require('./modules/reels');
const growth = require('./modules/growth');
const ecommerce = require('./modules/ecommerce');
const youtube = require('./modules/youtube');
const instagram = require('./modules/instagram');
const appointments = require('./modules/appointments');
const voice = require('./modules/voice');
const aiOrchestrator = require('./modules/ai/orchestrator');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;
const nodeEnv = process.env.NODE_ENV || 'development';

// ============================================
// SECURITY MIDDLEWARE
// ============================================
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests, please try again later.'
});
app.use(limiter);

// ============================================
// LOGGING MIDDLEWARE
// ============================================
if (nodeEnv === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// ============================================
// CUSTOM MIDDLEWARE
// ============================================
const validateWebhook = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Empty request body' });
  }
  next();
};

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: nodeEnv
  });
});

// ============================================
// WEBHOOK ENDPOINTS
// ============================================

// GET webhook verification (for Meta/Instagram webhook setup)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === verifyToken) {
      console.log('[WEBHOOK] Verified successfully');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

// POST webhook endpoint - Main event router
app.post('/webhook', validateWebhook, async (req, res) => {
  try {
    const event = req.body;
    console.log('[WEBHOOK] Received event:', JSON.stringify(event, null, 2));

    // ============================================
    // INSTAGRAM EVENTS
    // ============================================
    if (event.type === 'ig.comment' || event.object === 'instagram') {
      const { data } = event;
      
      if (data?.text) {
        console.log('[INSTAGRAM] Processing comment:', data.text);
        const result = await instagram.autoReplyComment(data);
        return res.json({ received: true, module: 'instagram', action: 'comment_reply', result });
      }
      
      if (data?.from?.id) {
        console.log('[INSTAGRAM] Processing DM');
        const result = await instagram.autoReplyDM(data);
        return res.json({ received: true, module: 'instagram', action: 'dm_reply', result });
      }
    }

    // ============================================
    // E-COMMERCE EVENTS
    // ============================================
    if (event.type === 'shopify.order.created' || event.type === 'woo.order.created') {
      console.log('[ECOMMERCE] Processing order webhook');
      const result = await ecommerce.handleOrderWebhook(event.data || event);
      return res.json({ received: true, module: 'ecommerce', action: 'order_processed', result });
    }

    // ============================================
    // APPOINTMENTS EVENTS
    // ============================================
    if (event.type === 'calendar.booking_request') {
      console.log('[APPOINTMENTS] Processing booking request');
      const slots = await appointments.proposeSlots({ timezone: event.timezone || 'UTC' });
      return res.json({ received: true, module: 'appointments', action: 'slots_proposed', slots });
    }

    // ============================================
    // GENERIC ECHO RESPONSE
    // ============================================
    console.log('[WEBHOOK] Event processed (no specific handler)');
    res.json({
      received: true,
      eventType: event.type || 'unknown',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[WEBHOOK ERROR]', error.message, error.stack);
    res.status(500).json({
      error: 'webhook_processing_error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// ============================================
// TEST ENDPOINTS (Development only)
// ============================================

if (nodeEnv === 'development') {
  // Prospecting demo
  app.post('/demo/prospecting', async (req, res) => {
    try {
      const { niche = 'social media marketing' } = req.body;
      const result = await prospecting.discoverLeads({ niche });
      res.json({ module: 'prospecting', result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Reels generation demo
  app.post('/demo/reels', async (req, res) => {
    try {
      const { topic = 'productivity tips' } = req.body;
      const script = await reels.generateReelScript(topic);
      const assets = await reels.renderReelAssets(script);
      res.json({ module: 'reels', script, assets });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Growth demo
  app.post('/demo/growth', async (req, res) => {
    try {
      const { niche = 'e-commerce' } = req.body;
      const result = await growth.runGrowthPlaybook({ niche });
      res.json({ module: 'growth', result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // E-commerce sync demo
  app.post('/demo/ecommerce/sync', async (req, res) => {
    try {
      const products = req.body.products || [
        { id: 1, name: 'Product 1', price: 29.99 },
        { id: 2, name: 'Product 2', price: 49.99 }
      ];
      const result = await ecommerce.syncCatalog(products);
      res.json({ module: 'ecommerce', action: 'sync', result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // YouTube ideation demo
  app.post('/demo/youtube', async (req, res) => {
    try {
      const { niche = 'technology' } = req.body;
      const ideas = await youtube.ideatePopularTopics({ niche });
      res.json({ module: 'youtube', ideas });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Instagram reply demo
  app.post('/demo/instagram/reply', async (req, res) => {
    try {
      const { commentText = 'This is amazing!' } = req.body;
      const result = await instagram.autoReplyComment({ text: commentText });
      res.json({ module: 'instagram', result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Appointments demo
  app.post('/demo/appointments', async (req, res) => {
    try {
      const slots = await appointments.proposeSlots({ timezone: 'UTC' });
      res.json({ module: 'appointments', slots });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Voice survey demo
  app.post('/demo/voice', async (req, res) => {
    try {
      const { to = '+1234567890' } = req.body;
      const result = await voice.callAndSurvey({ to, script: 'How satisfied are you?' });
      res.json({ module: 'voice', result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}

// ============================================
// TEST WEBHOOK ENDPOINT
// ============================================
app.post('/test/webhook', (req, res) => {
  console.log('[TEST] Webhook received:', req.body);
  res.json({ received: true, body: req.body });
});

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    method: req.method
  });
});

// ============================================
// ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// START SERVER
// ============================================
const server = app.listen(port, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🚀 Express Webhook Server running`);
  console.log(`📍 Environment: ${nodeEnv}`);
  console.log(`🔗 URL: http://localhost:${port}`);
  console.log(`✅ Health check: http://localhost:${port}/health`);
  console.log(`📨 Webhook endpoint: POST http://localhost:${port}/webhook`);
  console.log(`${'='.repeat(50)}\n`);
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
process.on('SIGTERM', () => {
  console.log('[SHUTDOWN] SIGTERM received, closing server...');
  server.close(() => {
    console.log('[SHUTDOWN] Server closed');
    process.exit(0);
  });
});

module.exports = app;
