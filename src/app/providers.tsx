'use client';

import { ConfigProvider, theme } from 'antd';
import zhTW from 'antd/locale/zh_TW';
import { createContext, useContext, useState, useEffect } from 'react';

export const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    document.body.style.background = isDark ? '#141414' : '#f0f2f5';
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <ConfigProvider
        locale={zhTW}
        theme={{
          algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorBgContainer: isDark ? '#1f1f1f' : '#ffffff',
            colorBgElevated: isDark ? '#1f1f1f' : '#ffffff',
            colorBgLayout: isDark ? '#141414' : '#f0f2f5',
            colorBgBase: isDark ? '#141414' : '#ffffff',
            colorText: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',
            colorTextSecondary: isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.45)',
          },
        }}
      >
        <div style={{ 
          minHeight: '100vh',
          background: isDark ? '#141414' : '#f0f2f5',
          transition: 'all 0.3s'
        }}>
          {children}
        </div>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
} 