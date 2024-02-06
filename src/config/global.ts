export default {
    cache: {
        ttl: parseInt(process.env.CACHE_TTL, 10) ?? 120,
    }
}