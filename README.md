# Spider Crawl — Cybersecurity Company Website

A complete full-stack website for Spider Crawl, a professional web & mobile security testing company.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS v3 |
| Backend | Node.js + Express |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| CVE Feed | NIST NVD API v2.0 |
| News Feed | RSS aggregation (BleepingComputer, THN, SecurityWeek, Krebs, SANS) |

---

## Project Structure

```
spider-crawl-v1/
├── client/                      # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── SpiderBackground.jsx   # Animated canvas web
│   │   │   ├── Navbar.jsx             # Sticky nav + dark/light toggle
│   │   │   ├── Hero.jsx               # Hero with typing terminal
│   │   │   ├── CostOfSecurity.jsx     # Stats + impact cards
│   │   │   ├── Methodology.jsx        # 7-step timeline
│   │   │   ├── NewsSection.jsx        # Live RSS news feed
│   │   │   ├── CVETracker.jsx         # Live NVD CVE table
│   │   │   ├── Pricing.jsx            # 3-tier pricing cards
│   │   │   ├── TrustStandards.jsx     # Client sectors + standards
│   │   │   ├── Contact.jsx            # Contact form → Firestore
│   │   │   ├── ROICalculator.jsx      # Interactive ROI slider
│   │   │   ├── Footer.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── AdminPortal.jsx        # Firebase Auth login
│   │   │   └── AdminDashboard.jsx     # Firestore contact submissions
│   │   ├── contexts/
│   │   │   ├── ThemeContext.jsx        # Dark/Light mode
│   │   │   └── AuthContext.jsx        # Firebase Auth
│   │   ├── firebase/
│   │   │   └── config.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
├── server/                      # Node.js + Express backend
│   ├── routes/
│   │   ├── cve.js               # NIST NVD proxy with caching
│   │   └── news.js              # RSS aggregator with caching
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- A Firebase project (free Spark plan works)

---

### 1. Clone / Open the project

```bash
cd "spider-crawl-v1"
```

---

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Firestore** (Native mode)
4. Enable **Authentication → Email/Password**
5. Create an admin user under Authentication → Users
6. Go to **Project Settings → Your apps → Web app** and copy the config

Create `client/.env.local`:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### Firestore Security Rules
Set these rules in Firestore → Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Contact form submissions: anyone can create, only auth users can read/update
    match /contact_requests/{docId} {
      allow create: if true;
      allow read, update: if request.auth != null;
    }
  }
}
```

---

### 3. Start the Backend Server

```bash
cd server
npm install

# Copy env example
cp .env.example .env
# (Optional) Add your NVD API key to .env for higher rate limits

npm run dev
# Server starts on http://localhost:5001
```

> **NVD API key** (optional but recommended): Get one free at https://nvd.nist.gov/developers/request-an-api-key  
> Without a key, NVD allows 5 requests per 30 seconds. The app caches responses for 30 minutes.

---

### 4. Start the Frontend

```bash
cd client
npm install
npm run dev
# Opens at http://localhost:5173
```

The Vite dev server proxies all `/api/*` requests to `http://localhost:5001`.

---

### 5. Access the Admin Dashboard

Navigate to: `http://localhost:5173/admin-portal`

Sign in with the Firebase Authentication email/password user you created in step 2.

---

## Environment Variables Reference

### `server/.env`
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5001` | Express server port |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Allowed CORS origin |
| `NVD_API_KEY` | *(empty)* | NIST NVD API key (optional) |
| `CVE_CACHE_TTL` | `1800` | CVE cache TTL in seconds |
| `NEWS_CACHE_TTL` | `900` | News cache TTL in seconds |

### `client/.env.local`
All `VITE_FIREBASE_*` variables from your Firebase project config.

---

## Features

| Feature | Details |
|---------|---------|
| **Dark/Light Mode** | Persistent toggle with `localStorage`, system preference detection |
| **Spider Matrix BG** | Canvas animation with 80+ nodes, mouse repulsion effect |
| **Typing Terminal** | Hero section animated code terminal |
| **Live CVE Tracker** | Fetches NIST NVD API, cached 30 min, color-coded severity, filter by level |
| **News Aggregator** | 5 RSS feeds, deduplicated, sorted by date, graceful fallback to mock data |
| **ROI Calculator** | Log-scale revenue slider, calculates 24h downtime cost vs pentest cost |
| **Contact Form** | Validates input, submits to Firestore `contact_requests` collection |
| **Admin Dashboard** | Protected route, lists all submissions, mark as Read/Responded |
| **Security** | helmet, rate limiting, CORS allowlist, no secrets in client code |

---

## Production Build

```bash
# Build frontend
cd client
npm run build          # Outputs to client/dist/

# Serve backend in production
cd server
npm start
```

For production deployment, serve the static `client/dist/` via a CDN (Vercel, Netlify) and deploy the backend to a Node.js host (Railway, Render, Fly.io).

Set `CLIENT_ORIGIN` in `server/.env` to your production domain.

---

## Firestore Data Schema

### `contact_requests` collection
```
{
  name:      string,
  email:     string,
  company:   string | null,
  subject:   string,        // General Inquiry | Request Quote | Report Vulnerability | Partnership
  message:   string,
  status:    string,        // unread | read | responded
  createdAt: Timestamp,
}
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/cves` | Latest CVEs from NVD. Params: `results`, `keyword`, `severity` |
| `GET` | `/api/news` | Aggregated news from RSS feeds. Params: `limit` |

---

*© 2024 Spider Crawl Security. All testing conducted under written authorization only.*
