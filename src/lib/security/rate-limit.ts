const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

interface Record {
  count: number;
  resetAt: number;
}

// In-memory store — effective for single-server deployments.
const store = new Map<string, Record>();

function prune() {
  const now = Date.now();
  for (const [key, record] of store) {
    if (record.resetAt < now) store.delete(key);
  }
}

export function checkRateLimit(key: string): { allowed: boolean; retryAfterSec: number } {
  prune();
  const now = Date.now();
  const record = store.get(key);

  if (!record || record.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSec: 0 };
  }

  if (record.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  record.count++;
  return { allowed: true, retryAfterSec: 0 };
}

export function clearRateLimit(key: string) {
  store.delete(key);
}
