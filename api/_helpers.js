/**
 * Small shared helpers for the Vercel serverless API functions.
 */

// Permissive CORS - same-origin requests don't need it, but it makes the
// API directly usable from anywhere during development.
const cors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

// Collect the raw request body and parse it as JSON.
// Returns {} when there is no body (so controllers behave like Express
// where req.body is always an object).
const readBody = (req) =>
  new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1e6) req.destroy(); // guard against huge payloads
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve({});
      }
    });
    req.on('error', reject);
  });

const handleError = (res, err, prefix) => {
  const message = prefix
    ? `${prefix} ${err.message}`
    : err.message || 'Unexpected error';
  res.status(500).json({ success: false, message });
};

module.exports = { cors, readBody, handleError };