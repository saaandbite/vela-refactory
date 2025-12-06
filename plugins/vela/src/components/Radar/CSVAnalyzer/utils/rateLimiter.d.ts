declare class RateLimiter {
    private requests;
    private maxRequests;
    private timeWindow;
    constructor(maxRequests?: number, timeWindowMs?: number);
    checkLimit(): Promise<void>;
}
export declare const rateLimiter: RateLimiter;
export {};
