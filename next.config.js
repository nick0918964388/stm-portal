/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ant-design/charts', 'antd', '@ant-design/plots', '@ant-design/icons'],
  webpack: (config) => {
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 