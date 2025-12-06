import { CacheEntry } from '../types';

const cache = new Map<string, CacheEntry<any>>();

export const cacheManager = {
  set<T>(key: string, data: T, ttl: number = 3600000): void {
    cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  },

  get<T>(key: string): T | null {
    const entry = cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      cache.delete(key);
      return null;
    }

    return entry.data as T;
  },

  clear(): void {
    cache.clear();
  },

  delete(key: string): void {
    cache.delete(key);
  },
};
