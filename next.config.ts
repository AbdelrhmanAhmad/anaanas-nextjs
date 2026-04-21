import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    allowedDevOrigins: ['demo.anaanas.com', 'demo.localhost', 'localhost:3000', '127.0.0.1:3000'],
    images: {
        // We only include SVGs that ship with the app (e.g. default user avatar).
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
                pathname: '/storage/**',
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '8000',
                pathname: '/storage/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                pathname: '/storage/**',
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                pathname: '/storage/**',
            },
            {
                protocol: 'https',
                hostname: '**.amazonaws.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '**.cloudfront.net',
                pathname: '/**',
            },
        ],
    },
    // Transpile next-auth to avoid chunk generation issues
    transpilePackages: ['next-auth'],
    // Webpack configuration to fix next-auth issues
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
            };
        }
        return config;
    },
};

export default nextConfig;
