/**
 * Authenticated fetch wrapper for HeartFit API.
 *
 * Reads the Supabase session token and attaches it as
 * an Authorization: Bearer header on every request.
 */
import { supabase } from './supabase.js';
import { API_BASE } from '../config.js';

async function getToken() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token ?? null;
}

export async function apiFetch(path, options = {}) {
  const token = await getToken();
  const headers = { ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

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
  const token = await getToken();
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const url = `${API_BASE}${path}`;
  const res = await fetch(url, { method: 'POST', headers, body: formData });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json();
}
