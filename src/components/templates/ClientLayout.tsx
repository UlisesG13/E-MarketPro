import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
  Zap,
  ArrowLeft,
  Heart,
  Search,
  ShoppingBag,
  UserRound,
} from 'lucide-react';
import SupportChat from '../organisms/SupportChat';
import PlanNotificationBar from '../molecules/PlanNotificationBar';
import { useCartStore } from '../../store/cartStore';
import { useFavoritesStore } from '../../store/favoritesStore';

const ClientLayout: React.FC = () => {
  const navigate = useNavigate();
  const cartCount = useCartStore((state) => state.itemCount());
  const favoritesCount = useFavoritesStore((state) => state.productIds.length);
  const [search, setSearch] = useState('');

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : '/search');
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a14]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 min-h-16 py-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold">E-Market<span className="text-indigo-400">Pro</span></span>
            </Link>
            <div className="hidden lg:flex items-center gap-6 ml-6">
              <Link to="/store" className="text-sm text-gray-300 hover:text-white transition-colors">
                Tienda
              </Link>
              <Link to="/category/electronicos" className="text-sm text-gray-300 hover:text-white transition-colors">
                Electrónicos
              </Link>
              <Link to="/category/ropa" className="text-sm text-gray-300 hover:text-white transition-colors">
                Ropa
              </Link>
              <Link to="/comparar" className="text-sm text-gray-300 hover:text-white transition-colors">
                Planes
              </Link>
            </div>
            <Link
              to="/"
              className="hidden xl:flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Inicio
            </Link>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar productos..."
                className="w-full lg:w-72 rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 outline-none transition-colors focus:border-indigo-500/50"
              />
            </form>

            <div className="flex items-center gap-2">
              <Link
                to="/favorites"
                className="relative inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2.5 text-gray-300 transition-colors hover:border-white/20 hover:text-white"
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
                className="relative inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2.5 text-gray-300 transition-colors hover:border-white/20 hover:text-white"
                aria-label="Carrito"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 min-w-5 rounded-full bg-indigo-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                to="/account"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2.5 text-gray-300 transition-colors hover:border-white/20 hover:text-white"
                aria-label="Mi cuenta"
              >
                <UserRound className="w-4 h-4" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white shadow-lg shadow-indigo-500/25 transition-colors hover:bg-indigo-600"
              >
                Acceder
              </Link>
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
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © 2026 E-MARKET PRO — Universidad Politécnica de Chiapas · Grupo 8-B
          </p>
          <p className="text-xs text-gray-600">Hecho con React + TypeScript + TailwindCSS</p>
        </div>
      </footer>

      {/* Floating support chat */}
      <SupportChat />
    </div>
  );
};

export default ClientLayout;
