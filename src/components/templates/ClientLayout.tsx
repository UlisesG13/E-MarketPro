import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Zap, ArrowLeft } from 'lucide-react';
import Button from '../atoms/Button';
import SupportChat from '../organisms/SupportChat';
import PlanNotificationBar from '../molecules/PlanNotificationBar';

const ClientLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a14]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold">E-Market<span className="text-indigo-400">Pro</span></span>
            </Link>
            <Link
              to="/"
              className="hidden sm:flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a inicio
            </Link>
          </div>
          <Link to="/login">
            <Button size="sm">Acceder</Button>
          </Link>
        </div>
      </nav>

      {/* Plan notification bar (conditional) */}
      <PlanNotificationBar />

      {/* Content */}
      <main className="pt-16">
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
