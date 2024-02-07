export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432
    },
    cache: {
        ttl: parseInt(process.env.CACHE_TTL, 10) || 120,
        aws_ttl: parseInt(process.env.AWS_S3_TTL, 10) || 1000
    }
});