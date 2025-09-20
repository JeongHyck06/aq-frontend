import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    env: {
        NEXT_PUBLIC_BACKEND_URL:
            process.env.NEXT_PUBLIC_BACKEND_URL ||
            'http://localhost:8080',
        NEXT_PUBLIC_KAKAO_APP_KEY:
            process.env.NEXT_PUBLIC_KAKAO_APP_KEY || '',
    },
};

export default nextConfig;
