interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class CacheManager<T = any> {
  private cache: Map<string, CacheEntry<T>>;
  private prefix: string;
  private useLocalStorage: boolean;

  constructor(prefix: string = '', useLocalStorage: boolean = false) {
    this.cache = new Map();
    this.prefix = prefix;
    this.useLocalStorage = useLocalStorage;
  }

  set(key: string, data: T, ttl: number = 3600000): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    if (this.useLocalStorage) {
      try {
        localStorage.setItem(
          `${this.prefix}${key}`,
          JSON.stringify(entry),
        );
      } catch (error) {
        console.error('Failed to set cache in localStorage:', error);
      }
    } else {
      this.cache.set(key, entry);
    }
  }

  get(key: string): T | null {
    let entry: CacheEntry<T> | null = null;

    if (this.useLocalStorage) {
      try {
        const item = localStorage.getItem(`${this.prefix}${key}`);
        if (item) {
          entry = JSON.parse(item);
        }
      } catch (error) {
        console.error('Failed to get cache from localStorage:', error);
        return null;
      }
    } else {
      entry = this.cache.get(key) || null;
    }

    if (!entry) return null;

    // Check if expired
    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): void {
    if (this.useLocalStorage) {
      try {
        localStorage.removeItem(`${this.prefix}${key}`);
      } catch (error) {
        console.error('Failed to delete cache from localStorage:', error);
      }
    } else {
      this.cache.delete(key);
    }
  }

  clear(): void {
    if (this.useLocalStorage) {
      try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith(this.prefix)) {
            localStorage.removeItem(key);
          }
        });
      } catch (error) {
        console.error('Failed to clear cache from localStorage:', error);
      }
    } else {
      this.cache.clear();
    }
  }

  getAllKeys(): string[] {
    if (this.useLocalStorage) {
      try {
        const keys = Object.keys(localStorage);
        return keys
          .filter(key => key.startsWith(this.prefix))
          .map(key => key.replace(this.prefix, ''));
      } catch (error) {
        console.error('Failed to get cache keys from localStorage:', error);
        return [];
      }
    } else {
      return Array.from(this.cache.keys());
    }
  }
}

// Factory functions for different use cases
export const createMemoryCache = <T = any>(prefix: string = '') =>
  new CacheManager<T>(prefix, false);

export const createLocalStorageCache = <T = any>(prefix: string = '') =>
  new CacheManager<T>(prefix, true);
