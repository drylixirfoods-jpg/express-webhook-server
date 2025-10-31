# Express.js Webhook Server

A production-ready Express.js webhook server with comprehensive error handling, security features, environment variable management, and comprehensive logging.

## Features

- ✅ **Webhook Verification**: Secure webhook token verification for incoming requests
- ✅ **Error Handling**: Comprehensive try-catch blocks and error middleware
- ✅ **Security**: Helmet.js for HTTP headers, input validation, payload size limits
- ✅ **Environment Variables**: dotenv integration for configuration management
- ✅ **Logging**: Morgan HTTP request logging with environment-specific levels
- ✅ **Production Ready**: Graceful shutdown, health check endpoint, environment awareness
- ✅ **Monitoring**: Request logging, error tracking, timestamp tracking

## Prerequisites

- Node.js >= 14.x
- npm or yarn

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/drylixirfoods-jpg/express-webhook-server.git
cd express-webhook-server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your actual values
nano .env
```

**Environment Variables:**

```env
# Server Configuration
PORT=3000                          # Server port (default: 3000)
NODE_ENV=development               # Environment mode (development/production)

# Webhook Configuration
VERIFY_TOKEN=your_verify_token_here # Webhook verification token

# Logging Configuration
LOG_LEVEL=debug                    # Logging level (debug/info/warn/error)

# Security Configuration
ALLOW_ORIGINS=http://localhost:3000 # CORS allowed origins
RATE_LIMIT_WINDOW_MS=900000         # Rate limit window (15 minutes)
RATE_LIMIT_MAX_REQUESTS=100         # Max requests per window
```

## Usage

### Development Mode

Run the server with auto-reload on file changes:

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## API Endpoints

### 1. Health Check

```bash
GET /health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2025-10-31T23:48:00.000Z"
}
```

### 2. Webhook Verification (GET)

```bash
GET /?hub.mode=subscribe&hub.challenge=CHALLENGE_VALUE&hub.verify_token=YOUR_TOKEN
```

Response: Returns the challenge value if token matches

### 3. Webhook Event Processing (POST)

```bash
POST /
Content-Type: application/json

{
  "entry": [
    {
      "id": "123456",
      "changes": [...]
    }
  ]
}
```

Response:
```json
{
  "received": true
}
```

## Security Features

### 1. Helmet.js Integration
- Automatically sets secure HTTP headers
- Protects against common vulnerabilities (XSS, clickjacking, etc.)

### 2. Input Validation
- Validates request bodies
- Rejects empty payloads
- Limits payload size to 1MB

### 3. Token Verification
- Verifies webhook tokens before processing
- Returns 403 Unauthorized for invalid tokens

### 4. Error Handling
- Catches and logs all errors
- Prevents sensitive information leakage in production
- Returns appropriate HTTP status codes

### 5. Environment-Aware Logging
- Development: Full payload logging for debugging
- Production: Minimal logging for security and performance

## Deployment

### Using PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start the server
pm2 start server.js --name webhook-server

# View logs
pm2 logs webhook-server

# Stop the server
pm2 stop webhook-server
```

### Using Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY server.js .

EXPOSE 3000

CMD ["node", "server.js"]
```

Build and run:

```bash
docker build -t webhook-server .
docker run -p 3000:3000 -e PORT=3000 -e VERIFY_TOKEN=your_token webhook-server
```

### Using systemd Service

Create `/etc/systemd/system/webhook-server.service`:

```ini
[Unit]
Description=Express Webhook Server
After=network.target

[Service]
Type=simple
User=nodejs
WorkingDirectory=/home/nodejs/webhook-server
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=10s
EnvironmentFile=/home/nodejs/webhook-server/.env

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable webhook-server
sudo systemctl start webhook-server
```

## Monitoring and Logging

### Log Levels
- **Development**: Morgan 'dev' format (concise, colored)
- **Production**: Morgan 'combined' format (detailed Apache format)

### Log Examples

```
[2025-10-31T23:48:00.000Z] ✓ WEBHOOK DOĞRULANDI
[2025-10-31T23:48:01.000Z] Webhook alındı
Processing 1 entries
```

## Troubleshooting

### Port Already in Use

```bash
# Find the process using the port
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### VERIFY_TOKEN Mismatch

- Ensure `VERIFY_TOKEN` in `.env` matches the token expected by your webhook provider
- Check for whitespace or special characters

### Cannot Find Module

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Project Structure

```
express-webhook-server/
├── server.js              # Main server file
├── package.json           # Project dependencies
├── package-lock.json      # Dependency lock file
├── .env                   # Environment variables (not in git)
├── .env.example           # Example environment variables
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Dependencies

- **express**: Web framework
- **helmet**: Security middleware
- **morgan**: HTTP request logger
- **dotenv**: Environment variable loader
- **nodemon**: (dev) File watcher for development

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## Best Practices

1. **Always use `.env` files** for sensitive information
2. **Never commit `.env` files** to the repository
3. **Test thoroughly** in development before production deployment
4. **Monitor logs** regularly for errors and suspicious activity
5. **Keep dependencies updated** for security patches
6. **Use HTTPS** in production
7. **Implement rate limiting** for production environments
8. **Set up proper monitoring** and alerting

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
