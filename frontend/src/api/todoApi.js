/**
 * todoApi - a thin wrapper around the backend REST API.
 * The Vite dev proxy rewrites /api to http://localhost:5000.
 * Every method returns the parsed JSON body and rejects with a clear
 * message when the request fails (including when the backend is down,
 * which the proxy reports as a non-JSON 500 response).
 */

const API_URL = '/api/todos';

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

export const todoApi = {
  async getAll() {
    const response = await fetch(API_URL);
    return handleResponse(response);
  },

  async create(todo) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    });
    return handleResponse(response);
  },

  async update(id, todo) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    });
    return handleResponse(response);
  },

  async remove(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};