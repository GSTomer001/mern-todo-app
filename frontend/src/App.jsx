import { useState, useEffect, useCallback } from 'react';
import { todoApi } from './api/todoApi';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

const FILTERS = ['all', 'active', 'completed'];

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  // Load all todos from the backend.
  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await todoApi.getAll();
      setTodos(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async (form) => {
    try {
      setError('');
      await todoApi.create(form);
      await fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleTodo = async (id) => {
    const todo = todos.find((t) => t._id === id);
    try {
      setError('');
      await todoApi.update(id, { ...todo, completed: !todo.completed });
      await fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateTitle = async (id, title) => {
    const todo = todos.find((t) => t._id === id);
    try {
      setError('');
      await todoApi.update(id, { ...todo, title });
      await fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      setError('');
      await todoApi.remove(id);
      await fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 Todo App</h1>
        <p>Organize your day, one task at a time.</p>
      </header>

      <main className="app-main">
        <TodoForm onAdd={addTodo} />

        {error && (
          <div className="banner banner-error">⚠️ {error}</div>
        )}

        <div className="toolbar">
          <div className="filters">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <span className="count">
            {remaining} remaining
          </span>
        </div>

        {loading ? (
          <p className="status">Loading todos…</p>
        ) : filteredTodos.length === 0 ? (
          <p className="status empty">
            No todos here yet. Add one above! 🎉
          </p>
        ) : (
          <TodoList
            todos={filteredTodos}
            onToggle={toggleTodo}
            onUpdateTitle={updateTitle}
            onDelete={deleteTodo}
          />
        )}
      </main>
    </div>
  );
}