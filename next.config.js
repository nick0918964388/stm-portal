/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ant-design/charts', 'antd'],
  webpack: (config) => {
    return config;
  },
}

module.exports = nextConfig 