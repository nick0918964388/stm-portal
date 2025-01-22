/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ant-design/charts', 'antd'],
  webpack: (config) => {
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 