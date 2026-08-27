import { useState } from 'react';

const initialForm = { title: '', description: '' };

/**
 * TodoForm - controlled form for creating new todos.
 * Calls the parent's onAdd handler with { title, description }.
 */
export default function TodoForm({ onAdd }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Please enter a title.');
      return;
    }
    setError('');
    await onAdd({ title: form.title.trim(), description: form.description.trim() });
    setForm(initialForm);
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        className="form-input"
        placeholder="What needs to be done?"
        value={form.title}
        onChange={handleChange}
      />
      <textarea
        name="description"
        className="form-input"
        placeholder="Add a short description (optional)"
        value={form.description}
        onChange={handleChange}
        rows="2"
      />
      {error && <p className="error-text">{error}</p>}
      <button type="submit" className="btn btn-primary">
        Add Todo
      </button>
    </form>
  );
}