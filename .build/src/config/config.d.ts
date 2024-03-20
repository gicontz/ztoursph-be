declare const _default: () => {
    port: number;
    database: {
        host: string;
        port: number;
    };
    cache: {
        ttl: number;
        aws_ttl: number;
    };
    maya: {
        faceApi: string;
        secretKey: string;
        checkoutApi: string;
    };
};
export default _default;
