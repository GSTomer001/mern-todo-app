const express = require('express');
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} = require('../controllers/todoController');

const router = express.Router();

// GET /api/todos  - list all
// POST /api/todos - create one
router.route('/').get(getTodos).post(createTodo);

// PUT    /api/todos/:id - update one
// DELETE /api/todos/:id - delete one
router.route('/:id').put(updateTodo).delete(deleteTodo);

module.exports = router;