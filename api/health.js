/**
 * Simple health check for the deployed API.
 */
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.json({ ok: true, service: 'mern-todo-api', ts: new Date().toISOString() });
};