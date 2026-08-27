import TodoItem from './TodoItem';

/**
 * TodoList - renders the list of todos into a <ul>.
 * Receives already-filtered todos plus the shared action handlers.
 */
export default function TodoList({ todos, onToggle, onUpdateTitle, onDelete }) {
  if (todos.length === 0) return null;

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onToggle={onToggle}
          onUpdateTitle={onUpdateTitle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}