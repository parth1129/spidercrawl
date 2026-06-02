require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');

const cveRoutes  = require('./routes/cve');
const newsRoutes = require('./routes/news');

const app  = express();
const PORT = process.env.PORT || 5001;

// ── Security middleware ────────────────────────────────────────────────────────
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

const allowedOrigins = [
  process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  'http://localhost:4173', // vite preview
];

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (curl, Postman) in dev
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error('Not allowed by CORS'));
    },
    methods: ['GET'],
  })
);

// Global rate limiter — 60 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down.' },
});
app.use('/api', limiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/cves',  cveRoutes);
app.use('/api/news',  newsRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('[SERVER ERROR]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🕷  Spider Crawl API running on http://localhost:${PORT}`);
  console.log(`   CVEs  → http://localhost:${PORT}/api/cves`);
  console.log(`   News  → http://localhost:${PORT}/api/news\n`);
});
