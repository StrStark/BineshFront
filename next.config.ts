import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@mui/icons-material'],
  },
  transpilePackages: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],

}

export default nextConfig
