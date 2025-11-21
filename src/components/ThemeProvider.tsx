"use client";

import { useEffect } from 'react';
import { useThemeStore } from '@/store/useThemeStore';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { isDark, setSystemTheme } = useThemeStore();

  useEffect(() => {
    // Aplica la clase 'dark' al html
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    // Escucha cambios en el modo del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setSystemTheme();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setSystemTheme]);

  return <>{children}</>;
}