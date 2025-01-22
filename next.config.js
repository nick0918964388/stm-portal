/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ant-design/charts', 'antd', '@ant-design/plots', '@ant-design/icons', 'rc-util', 'rc-tree'],
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
    };
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 