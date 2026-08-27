/**
 * Vercel serverless function for PUT /api/todos/:id and DELETE /api/todos/:id.
 *
 * Vercel passes the dynamic :id segment as req.query.id - we map it to
 * req.params.id so the existing Express controllers work unchanged.
 */
const connect = require('../_db');
const { cors, readBody, handleError } = require('../_helpers');
const { updateTodo, deleteTodo } = require('../../backend/controllers/todoController');

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
    req.params = { id: req.query.id };
    req.body = await readBody(req);

    if (req.method === 'PUT') return await updateTodo(req, res);
    if (req.method === 'DELETE') return await deleteTodo(req, res);
    if (req.method === 'OPTIONS') return res.status(204).end();

    return res
      .status(405)
      .json({ success: false, message: `${req.method} not allowed on /api/todos/:id` });
  } catch (err) {
    return handleError(res, err);
  }
};