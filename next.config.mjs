/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3000',
                pathname: ''
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '3000',
                pathname: '/**'
            }
        ]
    },
    async rewrites() {
        return [
            {
                source: '/api',
                destination: 'http://localhost:8080/api'
            }
        ];
    }
};

export default nextConfig;
