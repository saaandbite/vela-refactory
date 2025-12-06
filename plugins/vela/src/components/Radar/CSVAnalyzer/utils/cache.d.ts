export declare const cacheManager: {
    set<T>(key: string, data: T, ttl?: number): void;
    get<T_1>(key: string): T_1 | null;
    clear(): void;
    delete(key: string): void;
};
