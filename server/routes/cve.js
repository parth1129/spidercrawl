const express   = require('express');
const axios     = require('axios');
const NodeCache = require('node-cache');

const router = express.Router();
const cache  = new NodeCache({ stdTTL: parseInt(process.env.CVE_CACHE_TTL, 10) || 1800 });

const NVD_BASE  = 'https://services.nvd.nist.gov/rest/json/cves/2.0';
const API_KEY   = process.env.NVD_API_KEY;
const PAGE_SIZE = 20;

/**
 * GET /api/cves
 * Query params:
 *   results  — number of results (default 20, max 40)
 *   keyword  — keyword search
 *   severity — CRITICAL | HIGH | MEDIUM | LOW
 */
router.get('/', async (req, res) => {
  try {
    const resultsPerPage = Math.min(parseInt(req.query.results, 10) || PAGE_SIZE, 40);
    const keyword        = req.query.keyword  || '';
    const severity       = req.query.severity || '';

    const cacheKey = `cves_${resultsPerPage}_${keyword}_${severity}`;
    const cached   = cache.get(cacheKey);
    if (cached) {
      return res.json({ source: 'cache', ...cached });
    }

    const params = { resultsPerPage };
    if (keyword)  params.keywordSearch = keyword;
    if (severity) params.cvssV3Severity = severity.toUpperCase();

    const headers = {};
    if (API_KEY) headers.apiKey = API_KEY;

    const { data } = await axios.get(NVD_BASE, {
      params,
      headers,
      timeout: 15000,
    });

    const vulnerabilities = (data.vulnerabilities || []).map((item) => {
      const cve         = item.cve;
      const metrics     = cve.metrics || {};
      const cvssData    =
        metrics.cvssMetricV31?.[0]?.cvssData ||
        metrics.cvssMetricV30?.[0]?.cvssData ||
        metrics.cvssMetricV2?.[0]?.cvssData  ||
        null;

      const score    = cvssData ? parseFloat(cvssData.baseScore)        : null;
      const severity = cvssData ? cvssData.baseSeverity || cvssData.vectorString?.split('/')[0] || 'N/A' : 'N/A';

      const descList  = cve.descriptions || [];
      const enDesc    = descList.find((d) => d.lang === 'en')?.value || 'No description available.';

      return {
        id:          cve.id,
        description: enDesc.length > 200 ? enDesc.slice(0, 200) + '…' : enDesc,
        score,
        severity:    typeof severity === 'string' ? severity.toUpperCase() : 'N/A',
        published:   cve.published ? cve.published.slice(0, 10) : 'N/A',
        lastModified: cve.lastModified ? cve.lastModified.slice(0, 10) : 'N/A',
        url:         `https://nvd.nist.gov/vuln/detail/${cve.id}`,
      };
    });

    const payload = {
      totalResults: data.totalResults || 0,
      resultsPerPage,
      vulnerabilities,
      fetchedAt: new Date().toISOString(),
    };

    cache.set(cacheKey, payload);
    res.json({ source: 'live', ...payload });
  } catch (err) {
    console.error('[CVE ROUTE ERROR]', err.message);

    // Return mock data so the UI always has something to display
    res.json({
      source:       'mock',
      totalResults: 5,
      resultsPerPage: 5,
      fetchedAt:    new Date().toISOString(),
      vulnerabilities: getMockCVEs(),
    });
  }
});

function getMockCVEs() {
  return [
    {
      id:          'CVE-2024-21413',
      description: 'Microsoft Outlook Remote Code Execution Vulnerability allowing attackers to bypass Office Protected View.',
      score:       9.8,
      severity:    'CRITICAL',
      published:   '2024-02-13',
      lastModified:'2024-02-16',
      url:         'https://nvd.nist.gov/vuln/detail/CVE-2024-21413',
    },
    {
      id:          'CVE-2024-3400',
      description: 'PAN-OS GlobalProtect feature command injection vulnerability allows unauthenticated RCE.',
      score:       10.0,
      severity:    'CRITICAL',
      published:   '2024-04-12',
      lastModified:'2024-04-19',
      url:         'https://nvd.nist.gov/vuln/detail/CVE-2024-3400',
    },
    {
      id:          'CVE-2024-27198',
      description: 'JetBrains TeamCity authentication bypass vulnerability in versions before 2023.11.4.',
      score:       9.8,
      severity:    'CRITICAL',
      published:   '2024-03-04',
      lastModified:'2024-03-07',
      url:         'https://nvd.nist.gov/vuln/detail/CVE-2024-27198',
    },
    {
      id:          'CVE-2024-1708',
      description: 'ConnectWise ScreenConnect improper limitation of a pathname to a restricted directory vulnerability.',
      score:       8.4,
      severity:    'HIGH',
      published:   '2024-02-21',
      lastModified:'2024-02-23',
      url:         'https://nvd.nist.gov/vuln/detail/CVE-2024-1708',
    },
    {
      id:          'CVE-2024-23897',
      description: 'Jenkins arbitrary file read vulnerability through the CLI, potentially leading to RCE.',
      score:       9.8,
      severity:    'CRITICAL',
      published:   '2024-01-24',
      lastModified:'2024-02-01',
      url:         'https://nvd.nist.gov/vuln/detail/CVE-2024-23897',
    },
  ];
}

module.exports = router;
