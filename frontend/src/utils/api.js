export const API_BASE = 'http://localhost:5000/api';

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Simplified fetch api, to avoid same code. (dankje kroatië)
export async function api(path, opts = {}) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, getAuthHeader(), opts.headers || {});
  const res = await fetch(`${API_BASE}${path}`, Object.assign({}, opts, { headers }));
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
  if (!res.ok) {
    const err = new Error(data && data.error ? data.error : `Request failed: ${res.status}`);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

export default api;
