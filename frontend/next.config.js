/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    async rewrites () {
        return [
            // Rewrites all API requests to your Express server
            {
                source: '/api/:path*',
                destination: "http://localhost:8080/:path*",
                basePath: false
            },
        ];
    },
    distDir: './build',
};

module.exports = nextConfig
