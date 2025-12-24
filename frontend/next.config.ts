// next.config.ts (или .mjs)
import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https" as const,
                hostname: "firebasestorage.googleapis.com",
                pathname: "/v0/b/**",
            },
        ],
    },
};

export default withNextIntl(nextConfig);