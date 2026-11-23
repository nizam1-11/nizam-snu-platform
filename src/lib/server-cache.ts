const store = new Map<string, { value: unknown; expires: number }>();

export function getCached<T>(key: string): T | undefined {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (entry.expires <= Date.now()) {
    store.delete(key);
    return undefined;
  }
  return entry.value as T;
}

export function setCached<T>(key: string, value: T, ttlMs = 60_000): T {
  store.set(key, { value, expires: Date.now() + ttlMs });
  return value;
}
