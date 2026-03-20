import React from 'react';
import { Sun, Moon, Bell, Menu } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import Avatar from '../atoms/Avatar';

const Navbar: React.FC = () => {
  const { darkMode, toggleDarkMode, toggleSidebar } = useUIStore();
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-white/5 bg-[#0d0d1a]/60 backdrop-blur-xl">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left: menu toggle on mobile */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden lg:block" />

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label={darkMode ? 'Modo claro' : 'Modo oscuro'}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <button
            className="relative p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Notificaciones"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-white/10" />

          {/* User */}
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white leading-tight">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <Avatar name={user.name} size="sm" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
