import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    transpilePackages: ['@yuna/shared-types'], // 모노레포 내부 패키지 트랜스파일
    images: {
        // MinIO 도메인을 presigned URL을 위해 설정해야 하지만 
        // 로컬에서는 우선 모든 호스트를 허용하거나 remotePatterns를 설정
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '9000',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
