/* eslint-disable @typescript-eslint/no-explicit-any */
export async function apiFetch<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    credentials: 'include',
  });
  if (!res.ok) {
    let errorMsg = 'API error';
    try {
      const err = await res.json();
      errorMsg = err.error || err.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return res.json();
}

export async function apiPost<T = any>(url: string, body: any): Promise<T> {
  return apiFetch<T>(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function apiPatch<T = any>(url: string, body: any): Promise<T> {
  return apiFetch<T>(url, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function apiDelete<T = any>(url: string): Promise<T> {
  return apiFetch<T>(url, {
    method: 'DELETE',
  });
}

export async function apiGet<T = any>(url: string): Promise<T> {
  return apiFetch<T>(url);
}
