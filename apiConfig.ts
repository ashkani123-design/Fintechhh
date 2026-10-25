/**
 * Centralized API Client and Configuration
 * 
 * Provides resilient, timeout-protected network calls with graceful fallback
 * ensuring that unstable or restricted network connections (e.g., in Iran)
 * never hang the application UI or cause data loss.
 */

const DEFAULT_TIMEOUT_MS = 10000;

export const API_BASE_URL: string = (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  '/api'
).replace(/\/+$/, '');

export interface ApiRequestOptions extends RequestInit {
  timeoutMs?: number;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<{ ok: boolean; status: number; data: T | null; error?: string }> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, headers, ...restOptions } = options;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    let data: any = null;
    try {
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = text ? { message: text } : null;
      }
    } catch {
      data = null;
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
      error: response.ok ? undefined : (data?.error || `HTTP ${response.status}`),
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    const isTimeout = err?.name === 'AbortError';
    return {
      ok: false,
      status: isTimeout ? 408 : 0,
      data: null,
      error: isTimeout ? 'مهلت زمانی درخواست به پایان رسید (Timeout)' : (err?.message || 'خطای شبکه در ارتباط با سرور'),
    };
  }
}

export async function apiGet<T = any>(endpoint: string, options: ApiRequestOptions = {}) {
  return apiFetch<T>(endpoint, { ...options, method: 'GET' });
}

export async function apiPost<T = any>(endpoint: string, body?: any, options: ApiRequestOptions = {}) {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}
