/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@ant-design/charts',
    '@ant-design/plots',
    '@ant-design/icons',
    'antd',
    'rc-util',
    'rc-tree',
    'rc-table',
    'rc-picker',
    'rc-pagination',
    'rc-dialog',
    'rc-select',
    'rc-cascader',
    'rc-checkbox',
    'rc-dropdown',
    'rc-menu',
    'rc-input',
    'rc-input-number',
    'rc-motion',
    'rc-notification',
    'rc-tooltip',
    'rc-tabs',
    'rc-tree-select',
    '@babel/runtime'
  ],
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