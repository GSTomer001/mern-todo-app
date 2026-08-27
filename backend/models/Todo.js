const mongoose = require('mongoose');

/**
 * Todo schema defines the shape of a todo document.
 * - title: required, trimmed, max 200 chars
 * - description: optional, trimmed, max 500 chars
 * - completed: boolean flag, defaults to false
 * - timestamps: automatically adds createdAt and updatedAt
 */
const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
      default: '',
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Todo', todoSchema);