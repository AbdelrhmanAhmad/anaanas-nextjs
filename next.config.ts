import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
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
