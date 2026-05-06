/**
 * API wrapper for HeartFit backend.
 *
 * Pilot mode: sends X-Phone header for authentication.
 * Production: will switch to Authorization: Bearer with Supabase JWT.
 */
import { API_BASE } from '../config.js';

// Phone is set by AuthContext after login
let _phone = null;
export function setApiPhone(phone) { _phone = phone; }
export function getApiPhone() { return _phone; }

function authHeaders() {
  const headers = {};
  if (_phone) headers['X-Phone'] = _phone;
  return headers;
}

export async function apiFetch(path, options = {}) {
  const headers = { ...authHeaders(), ...(options.headers || {}) };
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json();
}

export function apiGet(path) {
  return apiFetch(path);
}

export function apiPost(path, body) {
  return apiFetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export function apiPut(path, body) {
  return apiFetch(path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export function apiDelete(path) {
  return apiFetch(path, { method: 'DELETE' });
}

export async function apiPostForm(path, formData) {
  const headers = authHeaders();
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, { method: 'POST', headers, body: formData });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json();
}
