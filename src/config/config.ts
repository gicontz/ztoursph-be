export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL, 10) || 6000,
    aws_ttl: parseInt(process.env.AWS_S3_TTL, 10) || 1000,
  },
  maya: {
    faceApi: process.env.MAYA_PUBLIC_FACE_API,
    secretKey: process.env.MAYA_SECRET_API,
    checkoutApi: process.env.MAYA_CHECKOUT_API,
  },
  payments: {
    processingFee: parseInt(process.env.PROCESS_FEE_CONST, 10) || 100,
    processingFeeRates: parseInt(process.env.PROCESS_FEE_RATE, 10) || 3,
    discounts: {
      kidsUnderFour: parseInt(process.env.KID_UNDER_4_DISCOUNT, 10) || 50,
      kidsUnderSeven: parseInt(process.env.KID_UNDER_7_DISCOUNT, 10) || 20,
    },
  },
  site: {
    domain: process.env.DOMAIN,
  },
  aws: {
    s3: {
      bucketName: process.env.AWS_S3_BUCKET_NAME,
    },
  },
});
