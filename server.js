// Load environment variables
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;
const nodeEnv = process.env.NODE_ENV || 'development';

// Security middleware
app.use(helmet());

// Body parsing middleware
app.use(express.json({ limit: '1mb' }));

// Logging middleware
if (nodeEnv === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Request validation middleware
const validateWebhook = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Empty request body' });
  }
  next();
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Webhook verification endpoint (GET)
app.get('/', (req, res) => {
  try {
    const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

    if (!mode || !challenge || !token) {
      console.warn('Invalid webhook verification parameters received');
      return res.status(400).json({ error: 'Missing verification parameters' });
    }

    if (mode === 'subscribe' && token === verifyToken) {
      console.log(`[${new Date().toISOString()}] ✓ WEBHOOK DOĞRULANDI`);
      return res.status(200).send(challenge);
    } else {
      console.warn(`[${new Date().toISOString()}] ✗ Webhook verification failed - Invalid token`);
      return res.status(403).json({ error: 'Unauthorized' });
    }
  } catch (error) {
    console.error('Error in webhook verification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Webhook event processing endpoint (POST)
app.post('/', validateWebhook, (req, res) => {
  try {
    const timestamp = new Date().toISOString();
    console.log(`\n[${timestamp}] Webhook alındı`);

    // Avoid logging sensitive data in production
    if (nodeEnv === 'development') {
      console.log('Payload:', JSON.stringify(req.body, null, 2));
    } else {
      console.log('Event received from:', req.get('user-agent') || 'unknown');
    }

    // Process webhook event
    if (req.body.entry) {
      console.log(`Processing ${req.body.entry.length} entries`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.status || 500;
  const message = nodeEnv === 'production' ? 'Internal server error' : err.message;
  res.status(status).json({ error: message });
});

// Start server
const server = app.listen(port, () => {
  console.log(`\n✓ Webhook sunucusu ${port} numaralı portta başlatıldı`);
  console.log(`✓ Node.js environment: ${nodeEnv}`);
  console.log(`✓ Health check: http://localhost:${port}/health\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;
