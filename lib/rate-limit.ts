// lib/rate-limit.ts

export interface RateLimitOptions {
    interval: number; // Time window in milliseconds
    uniqueTokenPerInterval: number; // Max number of unique tokens (e.g., IPs) to track
}

export function rateLimit(options: RateLimitOptions) {
    const tokenCache = new Map();

    return {
        check: (limit: number, token: string) => {
            const now = Date.now();
            const tokenCount = tokenCache.get(token) || [0];

            // Filter out timestamps outside the interval window
            const recentRequests = tokenCount.filter((timestamp: number) => now - timestamp < options.interval);

            if (recentRequests.length >= limit) {
                return { success: false, remaining: 0 };
            }

            recentRequests.push(now);
            tokenCache.set(token, recentRequests);

            // Simple cleanup for memory efficiency
            if (tokenCache.size > options.uniqueTokenPerInterval) {
                const oldestKey = tokenCache.keys().next().value;
                tokenCache.delete(oldestKey);
            }

            return {
                success: true,
                remaining: limit - recentRequests.length
            };
        },
    };
}

// Global instance (Note: in serverless, this is per-instance)
export const chatRateLimiter = rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 500,
});
