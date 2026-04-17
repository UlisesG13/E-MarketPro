import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
  Zap,
  ArrowLeft,
  Heart,
  Search,
  ShoppingBag,
  UserRound,
  Moon,
  Sun,
  LogOut,
} from 'lucide-react';
import SupportChat from '../../../../shared/components/organisms/SupportChat';
import PlanNotificationBar from '../../../../shared/components/molecules/PlanNotificationBar';
import { useCartStore } from '../../../../entities/customer/store/cartStore';
import { useFavoritesStore } from '../../../../entities/customer/store/favoritesStore';
import { useUIStore } from '../../../../shared/store/uiStore';
import { useAdminAuthStore } from '../../../../entities/admin/store/adminAuthStore';

const ClientLayout: React.FC = () => {
  const navigate = useNavigate();
  const cartCount = useCartStore((state) => state.itemCount());
  const favoritesCount = useFavoritesStore((state) => state.productIds.length);
  const darkMode = useUIStore((state) => state.darkMode);
  const toggleDarkMode = useUIStore((state) => state.toggleDarkMode);
  const user = useAdminAuthStore((state) => state.admin);
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);
  const logout = useAdminAuthStore((state) => state.logout);
  const [search, setSearch] = useState('');

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : '/search');
  };

  return (
    <div className="app-shell min-h-screen">
      {/* Navigation */}
      <nav className="app-surface fixed left-0 right-0 top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-6 min-h-16 py-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[linear-gradient(135deg,var(--app-primary),var(--app-secondary))]">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-[var(--app-text)]">
                E-Market<span className="text-[var(--app-primary)]">Pro</span>
              </span>
            </Link>
            <div className="hidden lg:flex items-center gap-6 ml-6">
              <Link to="/store" className="text-sm text-[var(--app-text-muted)] hover:text-[var(--app-text)] transition-colors">
                Tienda
              </Link>
              <Link to="/category/electronicos" className="text-sm text-[var(--app-text-muted)] hover:text-[var(--app-text)] transition-colors">
                Electrónicos
              </Link>
              <Link to="/category/ropa" className="text-sm text-[var(--app-text-muted)] hover:text-[var(--app-text)] transition-colors">
                Ropa
              </Link>
              <Link to="/comparar" className="text-sm text-[var(--app-text-muted)] hover:text-[var(--app-text)] transition-colors">
                Planes
              </Link>
            </div>
            <Link
              to="/"
              className="hidden xl:flex items-center gap-1.5 text-sm text-[var(--app-text-muted)] hover:text-[var(--app-text)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Inicio
            </Link>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--app-text-soft)]" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar productos..."
                className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] py-2.5 pl-10 pr-4 text-sm text-[var(--app-text)] placeholder:text-[var(--app-text-soft)] outline-none transition-colors focus:border-[var(--app-primary)] lg:w-72"
              />
            </form>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleDarkMode}
                className="app-icon-button p-2.5"
                aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <Link
                to="/favorites"
                className="app-icon-button relative p-2.5"
                aria-label="Favoritos"
              >
                <Heart className="w-4 h-4" />
                {favoritesCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 min-w-5 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {favoritesCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="app-icon-button relative p-2.5"
                aria-label="Carrito"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 min-w-5 rounded-full bg-[var(--app-primary)] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                to="/account"
                className="app-icon-button p-2.5"
                aria-label="Mi cuenta"
              >
                <UserRound className="w-4 h-4" />
              </Link>

              {isAuthenticated && user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="hidden rounded-xl border border-[var(--app-border)] px-3 py-1.5 text-xs font-medium text-[var(--app-text-muted)] transition-colors hover:border-[var(--app-border-strong)] hover:bg-[var(--app-surface-soft)] hover:text-[var(--app-text)] sm:inline-flex"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      navigate('/store');
                    }}
                    className="inline-flex items-center justify-center gap-1 rounded-xl bg-[var(--app-primary)] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[var(--app-primary-600)]"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Salir
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-xl bg-[var(--app-primary)] px-3 py-1.5 text-xs font-medium text-white shadow-[var(--app-shadow)] transition-colors hover:bg-[var(--app-primary-600)]"
                >
                  Acceder
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Plan notification bar (conditional) */}
      <PlanNotificationBar />

      {/* Content */}
      <main className="pt-28 lg:pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--app-border)] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--app-text-soft)]">
            © 2026 E-MARKET PRO — Universidad Politécnica de Chiapas · Grupo 8-B
          </p>
          <p className="text-xs text-[var(--app-text-soft)]">Hecho con React + TypeScript + TailwindCSS</p>
        </div>
      </footer>

      {/* Floating support chat */}
      <SupportChat />
    </div>
  );
};

export default ClientLayout;
