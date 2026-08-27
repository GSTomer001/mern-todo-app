/**
 * todoApi - a thin wrapper around the backend REST API.
 *
 * - In development / on Vercel the Vite dev proxy or deployed API rewrites
 *   /api to the Express backend.
 * - On GitHub Pages there is no backend at all, so the first request to
 *   /api/todos will fail. When that happens the module transparently falls
 *   back to a localStorage-backed "demo mode" so the deployed app still
 *   works fully in the browser (data is saved per-browser).
 *
 * Every method returns the parsed JSON body in the same shape the backend
 * produces ({ success, data, ... }), regardless of which mode is active.
 */

const API_URL = '/api/todos';
const STORAGE_KEY = 'mern-todo-demo';

let mode = 'live'; // 'live' | 'demo'

function setMode(m) {
  mode = m;
}

/** @returns 'live' when talking to the real API, or 'demo' for localStorage. */
export function currentMode() {
  return mode;
}

/* ------------------------- localStorage storage ------------------------- */
function readLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocal(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function uid() {
  return (
    'local-' +
    Date.now().toString(36) +
    '-' +
    Math.random().toString(36).slice(2, 8)
  );
}

/* ----------------------------- response parsing ------------------------ */
async function handleResponse(response) {
  // Read as text first, then try to parse as JSON. The Vite dev proxy
  // returns a plain-text/empty 500 when the backend is not running, which
  // used to blow up with "Unexpected end of JSON input".
  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    if (data && typeof data.message === 'string') {
      throw new Error(data.message);
    }
    throw new Error(
      `Could not reach the backend (HTTP ${response.status}). ` +
        'Make sure MongoDB is running and then start the backend with: ' +
        'cd backend && npm run dev'
    );
  }
  return data;
}

/**
 * Try a real network request; if it fails for any reason, switch to demo
 * mode and continue. Returns the final response value.
 */
async function withFallback(real, localValue) {
  try {
    const response = await real();
    const ok = response.ok;
    const data = await handleResponse(response);
    if (!ok) throw new Error('request failed');
    setMode('live');
    return data;
  } catch {
    setMode('demo');
    // localValue may be a plain value or a thunk - call it when callable.
    return typeof localValue === 'function' ? localValue() : localValue;
  }
}

/* --------------------------------- API --------------------------------- */
export const todoApi = {
  async getAll() {
    return withFallback(
      () => fetch(API_URL),
      () => {
        const list = readLocal();
        return { success: true, count: list.length, data: list };
      }
    );
  },

  async create(todo) {
    if (mode === 'demo') {
      const list = readLocal();
      const created = {
        _id: uid(),
        title: todo.title,
        description: todo.description || '',
        completed: false,
        createdAt: demoNow(),
        updatedAt: demoNow(),
        __v: 0,
      };
      list.unshift(created);
      writeLocal(list);
      return { success: true, data: created };
    }
    return withFallback(
      () =>
        fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(todo),
        }),
      () => todoApi.create(todo) // back to the local branch above
    );
  },

  async update(id, todo) {
    if (mode === 'demo') {
      const list = readLocal().map((t) =>
        t._id === id ? { ...t, ...todo, updatedAt: todayNow() } : t
      );
      writeLocal(list);
      const updated = list.find((t) => t._id === id) || todo;
      return { success: true, data: updated };
    }
    return withFallback(
      () =>
        fetch(`${API_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(todo),
        }),
      () => todoApi.update(id, todo)
    );
  },

  async remove(id) {
    if (mode === 'demo') {
      writeLocal(readLocal().filter((t) => t._id !== id));
      return { success: true, message: 'Todo removed', data: {} };
    }
    return withFallback(
      () => fetch(`${API_URL}/${id}`, { method: 'DELETE' }),
      () => todoApi.remove(id)
    );
  },
};

// tiny helpers used above
function demoNow() {
  return new Date().toISOString();
}
function todayNow() {
  return new Date().toISOString();
}