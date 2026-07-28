export async function fetchJSON(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const message = data?.message || data?.error || `Request failed with ${res.status}`;
    throw new Error(message);
  }
  return data;
}
