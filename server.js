const express = require('express');
const client = require('prom-client');

const app = express();

app.disable('x-powered-by'); // Hide the X-Powered-By: Express (sonarqube)

const verifyToken = require('./auth'); 
const mathRoutes = require('./Routes/MathRoutes');

// Prometheus: Collect default Node.js process metrics (CPU, Memory, Event Loop)
client.collectDefaultMetrics({ timeout: 5000 });

// Prometheus: Custom histogram for request rate, response codes, and latency
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5]
});

app.use(express.json());

// Prometheus middleware: Track all request durations
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    httpRequestDurationMicroseconds
      .labels(req.method, route, res.statusCode)
      .observe(duration);
  });
  next();
});

// Public healthcheck route 
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

// Public Prometheus metrics route (Unauthenticated)
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

// Apply authentication globally to ALL remaining routes
app.use(verifyToken);

app.use('/', mathRoutes);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
