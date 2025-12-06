import { CacheEntry } from '../types';
export declare class CacheManager {
    set(key: string, data: any, ttl?: number): void;
    get(key: string): CacheEntry | null;
    delete(key: string): void;
    clear(): void;
    getAllKeys(): string[];
}
export declare const cacheManager: CacheManager;
