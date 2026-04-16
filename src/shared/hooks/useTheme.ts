import { useUIStore } from '../store/uiStore';

export function useTheme() {
  const { darkMode, toggleDarkMode } = useUIStore();
  return { darkMode, toggleDarkMode };
}
