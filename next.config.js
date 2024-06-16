/** @type {import('next').NextConfig} */
export default {
    images: {
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3000',
                pathname: '/**'
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '3000',
                pathname: '/**'
            },
            {
                protocol: 'http',
                hostname: 'invoice-minio',
                port: '9000',
                pathname: '/**'
            }
        ]
    }
};
