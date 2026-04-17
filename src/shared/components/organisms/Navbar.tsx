import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, Menu, LogOut, Store, UserCircle2 } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useAdminAuthStore } from '../../../entities/admin/store/adminAuthStore';
import Avatar from '../atoms/Avatar';
import NotificationMenu from '../molecules/NotificationMenu';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleDarkMode, toggleSidebar } = useUIStore();
  const user = useAdminAuthStore((state) => state.admin);
  const logout = useAdminAuthStore((state) => state.logout);
  const [menuOpen, setMenuOpen] = useState(false);

  const pageLabel =
    location.pathname === '/dashboard'
      ? 'Resumen general'
      : location.pathname === '/products'
          ? 'Gestión de catálogo'
          : location.pathname === '/orders'
            ? 'Seguimiento de pedidos'
            : 'Configuración y equipo';

  return (
    <header className="app-surface sticky top-0 z-30 border-b">
      <div className="flex min-h-16 items-center justify-between px-6">
        {/* Left: menu toggle on mobile */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="app-icon-button p-2 lg:hidden"
          aria-label="Menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden lg:block">
          <p className="text-sm font-semibold text-[var(--app-text)]">{pageLabel}</p>
          <p className="text-xs text-[var(--app-text-muted)]">
            Panel operativo con navegación, tema y notificaciones funcionales
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Dark mode toggle */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="app-icon-button p-2.5"
            aria-label={darkMode ? 'Modo claro' : 'Modo oscuro'}
            title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <NotificationMenu />

          <Link
            to="/store"
            className="hidden items-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-3 py-2 text-sm text-[var(--app-text-muted)] transition-colors hover:border-[var(--app-border-strong)] hover:text-[var(--app-text)] md:inline-flex"
          >
            <Store className="h-4 w-4" />
            Ver tienda
          </Link>

          {/* Divider */}
          <div className="hidden h-8 w-px bg-[var(--app-border)] sm:block" />

          {/* User */}
          {user && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((current) => !current)}
                className="flex items-center gap-3 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-3 py-2 transition-colors hover:border-[var(--app-border-strong)]"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium leading-tight text-[var(--app-text)]">
                    {user.name}
                  </p>
                  <p className="text-xs text-[var(--app-text-soft)]">{user.role}</p>
                </div>
                <Avatar name={user.name} size="sm" />
              </button>

              {menuOpen && (
                <>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="fixed inset-0 z-30 cursor-default"
                    aria-label="Cerrar menú de usuario"
                  />
                  <div className="app-surface absolute right-0 z-40 mt-3 w-56 rounded-[24px] border p-2 shadow-[var(--app-shadow)]">
                    <div className="border-b border-[var(--app-border)] px-3 py-3">
                      <p className="text-sm font-semibold text-[var(--app-text)]">{user.name}</p>
                      <p className="text-xs text-[var(--app-text-muted)]">{user.email}</p>
                    </div>
                    <div className="py-2">
                      <Link
                        to="/account"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm text-[var(--app-text-muted)] transition-colors hover:bg-[var(--app-surface-soft)] hover:text-[var(--app-text)]"
                      >
                        <UserCircle2 className="h-4 w-4" />
                        Mi cuenta
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                          navigate('/login');
                        }}
                        className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm text-[var(--app-danger)] transition-colors hover:bg-[rgba(239,68,68,0.12)]"
                      >
                        <LogOut className="h-4 w-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
