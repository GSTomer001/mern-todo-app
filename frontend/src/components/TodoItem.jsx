import { useState } from 'react';

/**
 * TodoItem - renders a single todo with checkbox, inline editing,
 * and delete controls.
 *
 * Props:
 *  - todo          the todo object
 *  - onToggle      (id) toggles completed state
 *  - onUpdateTitle (id, title) saves an edited title
 *  - onDelete       (id) removes the todo
 */
export default function TodoItem({ todo, onToggle, onUpdateTitle, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const save = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onUpdateTitle(todo._id, trimmed);
    setIsEditing(false);
  };

  const cancel = () => {
    setTitle(todo.title);
    setIsEditing(false);
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo._id)}
        />

        {isEditing ? (
          <input
            type="text"
            className="edit-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save();
              if (e.key === 'Escape') cancel();
            }}
            autoFocus
          />
        ) : (
          <div className="todo-text">
            <span className="title">{todo.title}</span>
            {todo.description && <p className="description">{todo.description}</p>}
          </div>
        )}
      </div>

      <div className="todo-actions">
        {isEditing ? (
          <>
            <button className="btn btn-save" onClick={save}>
              Save
            </button>
            <button className="btn btn-cancel" onClick={cancel}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-edit" onClick={() => setIsEditing(true)}>
              Edit
            </button>
            <button className="btn btn-delete" onClick={() => onDelete(todo._id)}>
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  );
}