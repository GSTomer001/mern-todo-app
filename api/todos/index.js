/**
 * Vercel serverless function for GET /api/todos and POST /api/todos.
 *
 * Reuses the exact same controllers as the local Express backend
 * (backend/controllers/todoController.js) so behaviour stays identical.
 */
const connect = require('../_db');
const { cors, readBody, handleError } = require('../_helpers');
const { getTodos, createTodo } = require('../../backend/controllers/todoController');

module.exports = async (req, res) => {
  cors(res);

  try {
    await connect();
  } catch (err) {
    return handleError(
      res,
      err,
      'Could not connect to MongoDB. Make sure MONGO_URI is set to a hosted (Atlas) connection string.'
    );
  }

  try {
    req.body = await readBody(req);

    if (req.method === 'GET') return await getTodos(req, res);
    if (req.method === 'POST') return await createTodo(req, res);
    if (req.method === 'OPTIONS') return res.status(204).end();

    return res
      .status(405)
      .json({ success: false, message: `${req.method} not allowed on /api/todos` });
  } catch (err) {
    return handleError(res, err);
  }
};