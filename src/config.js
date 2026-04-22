// API_BASE resolution order:
//   1. VITE_API_BASE in .env (edit that file to pin a URL)
//   2. Auto-detect from the hostname serving this page (works on LAN)
//   3. Fall back to localhost for local dev
const _cfg = import.meta.env.VITE_API_BASE;
const _h   = window.location.hostname;

export const API_BASE = _cfg
  ? _cfg
  : (!_h || _h === 'localhost' || _h === '127.0.0.1')
    ? 'http://localhost:8000'
    : `http://${_h}:8000`;
