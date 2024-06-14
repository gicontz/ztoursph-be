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
    whitelist: process.env.MAYA_IPS ? process.env.MAYA_IPS.split(',') : [],
  },
  payments: {
    processingFee: parseInt(process.env.PROCESS_FEE_CONST, 10) || 0,
    processingFeeRates: parseInt(process.env.PROCESS_FEE_RATE, 10) || 3,
    discounts: {
      kidsUnderFour: parseInt(process.env.KID_UNDER_4_DISCOUNT, 10) || 0,
      kidsUnderSeven: parseInt(process.env.KID_UNDER_7_DISCOUNT, 10) || 0,
    },
  },
  site: {
    domain: process.env.DOMAIN,
  },
  email: {
    notifSender: process.env.EMAIL_USERNAME,
    notifRecipients: process.env.EMAIL_CC
      ? process.env.EMAIL_CC.split(',')
      : [],
  },
  aws: {
    s3: {
      bucketName: process.env.AWS_S3_BUCKET_NAME,
    },
  },
});
