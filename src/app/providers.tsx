'use client';

import { ConfigProvider } from 'antd';
import zhTW from 'antd/locale/zh_TW';

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider locale={zhTW}>
      {children}
    </ConfigProvider>
  );
} 