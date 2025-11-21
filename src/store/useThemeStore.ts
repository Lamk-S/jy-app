import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeState = {
  isDark: boolean;
  toggle: () => void;
  setSystemTheme: () => void;
};

// Detecta el modo del sistema
const getSystemTheme = (): boolean => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false; // Default a light si no hay window
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: getSystemTheme(), // Inicializa con el modo del sistema
      toggle: () => set((state) => ({ isDark: !state.isDark })),
      setSystemTheme: () => set({ isDark: getSystemTheme() }),
    }),
    {
      name: 'theme-storage', // Clave en localStorage
      onRehydrateStorage: () => (state) => {
        // Si no hay estado guardado, usa el del sistema
        if (state && state.isDark === undefined) {
          state.isDark = getSystemTheme();
        }
      },
    }
  )
);