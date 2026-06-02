const express   = require('express');
const Parser    = require('rss-parser');
const NodeCache = require('node-cache');

const router = express.Router();
const cache  = new NodeCache({ stdTTL: parseInt(process.env.NEWS_CACHE_TTL, 10) || 900 });
const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'SpiderCrawlBot/1.0 (+https://spidercrawlsecurity.com)' },
});

const FEEDS = [
  {
    name: 'BleepingComputer',
    url:  'https://www.bleepingcomputer.com/feed/',
    tags: ['Malware', 'Ransomware', 'Data Breach'],
  },
  {
    name: 'SecurityWeek',
    url:  'https://feeds.feedburner.com/securityweek',
    tags: ['Vulnerability', 'Threat Intel'],
  },
  {
    name: 'The Hacker News',
    url:  'https://feeds.feedburner.com/TheHackersNews',
    tags: ['Hacking', 'Exploit', 'CVE'],
  },
  {
    name: 'Krebs on Security',
    url:  'https://krebsonsecurity.com/feed/',
    tags: ['Investigation', 'Fraud', 'Cybercrime'],
  },
  {
    name: 'SANS Internet Stormcast',
    url:  'https://isc.sans.edu/rssfeed_full.xml',
    tags: ['SANS', 'Threat', 'IoT'],
  },
];

/**
 * GET /api/news
 * Returns aggregated news from multiple security RSS feeds
 * Query params:
 *   limit — number of articles per feed (default 5)
 */
router.get('/', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 5, 10);
  const cacheKey = `news_${limit}`;

  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json({ source: 'cache', articles: cached });
  }

  const results = await Promise.allSettled(
    FEEDS.map((feed) => fetchFeed(feed, limit))
  );

  let articles = [];
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      articles.push(...result.value);
    }
  });

  // Sort by publish date descending
  articles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  // Fall back to mock data if all feeds failed
  if (articles.length === 0) {
    articles = getMockNews();
  }

  cache.set(cacheKey, articles);
  res.json({ source: articles.length ? 'live' : 'mock', articles });
});

async function fetchFeed(feed, limit) {
  const parsed = await parser.parseURL(feed.url);
  return (parsed.items || []).slice(0, limit).map((item) => ({
    source:  feed.name,
    title:   item.title   || 'Untitled',
    url:     item.link    || '#',
    pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
    summary: stripHtml(item.contentSnippet || item.content || '').slice(0, 180) + '…',
    tags:    feed.tags,
  }));
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function getMockNews() {
  const now = new Date();
  return [
    {
      source:  'BleepingComputer',
      title:   'New LockBit 4.0 Ransomware Variant Targets Healthcare Sector',
      url:     '#',
      pubDate: new Date(now - 1 * 3600000).toISOString(),
      summary: 'Security researchers have discovered a new LockBit 4.0 variant that specifically targets healthcare networks using a novel lateral movement technique…',
      tags:    ['Ransomware', 'Healthcare'],
    },
    {
      source:  'The Hacker News',
      title:   'Critical Apache Struts RCE Vulnerability Exploited in the Wild',
      url:     '#',
      pubDate: new Date(now - 3 * 3600000).toISOString(),
      summary: 'A critical remote code execution flaw in Apache Struts is being actively exploited by threat actors to deploy webshells and cryptocurrency miners…',
      tags:    ['RCE', 'Apache', 'CVE'],
    },
    {
      source:  'SecurityWeek',
      title:   'Supply Chain Attack Compromises Popular npm Package with 3M Weekly Downloads',
      url:     '#',
      pubDate: new Date(now - 6 * 3600000).toISOString(),
      summary: 'Attackers injected malicious code into a widely used npm package, affecting thousands of downstream projects and exposing sensitive environment variables…',
      tags:    ['Supply Chain', 'npm', 'API Security'],
    },
    {
      source:  'Krebs on Security',
      title:   'Indian FinTech Startup Exposes 2M Customer Records via Misconfigured S3 Bucket',
      url:     '#',
      pubDate: new Date(now - 12 * 3600000).toISOString(),
      summary: 'A Mumbai-based payment processing startup left an AWS S3 bucket publicly accessible, exposing KYC documents and transaction history for over 2 million users…',
      tags:    ['Data Breach', 'Cloud', 'FinTech'],
    },
    {
      source:  'SANS Internet Stormcast',
      title:   'Widespread Exploitation of Ivanti Connect Secure Zero-Day Observed',
      url:     '#',
      pubDate: new Date(now - 18 * 3600000).toISOString(),
      summary: 'SANS researchers observed mass exploitation of a zero-day authentication bypass in Ivanti Connect Secure VPN, with hundreds of compromised appliances already confirmed…',
      tags:    ['Zero-Day', 'VPN', 'Exploit'],
    },
    {
      source:  'BleepingComputer',
      title:   'OWASP Releases Updated API Security Top 10 — 2024 Edition',
      url:     '#',
      pubDate: new Date(now - 24 * 3600000).toISOString(),
      summary: 'The Open Web Application Security Project released its updated API Security Top 10 list, highlighting new risks around AI integrations and server-side request forgery…',
      tags:    ['OWASP', 'API Security'],
    },
  ];
}

module.exports = router;
