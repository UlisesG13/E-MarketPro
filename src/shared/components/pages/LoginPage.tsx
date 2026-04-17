import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Zap, ArrowRight, ShoppingBag } from 'lucide-react';
import { useAdminAuth } from '../../../entities/admin/hooks/useAdminAuth';
import { useCustomerAuth } from '../../../entities/customer/hooks/useCustomerAuth';
import Button from '../atoms/Button';
import Input from '../atoms/Input';

type LoginMode = 'admin' | 'customer';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<LoginMode>('admin');
  const location = useLocation();

  const { login: adminLogin, isLoggingIn: isAdminLoading } = useAdminAuth();
  const { login: customerLogin, isLoggingIn: isCustomerLoading } = useCustomerAuth();

  const isLoading = isAdminLoading || isCustomerLoading;

  const redirectTo = (location.state as { redirectTo?: string } | null)?.redirectTo;
  React.useEffect(() => {
    if (redirectTo === 'customer') setMode('customer');
  }, [redirectTo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    if (mode === 'admin') {
      adminLogin({ email: email.trim(), password });
    } else {
      customerLogin({ email: email.trim(), password });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-8 shadow-[var(--app-shadow)] backdrop-blur-xl">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--app-primary),var(--app-secondary))]">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--app-text)]">
              E-Market<span className="text-[var(--app-primary)]">Pro</span>
            </h1>
            <p className="text-xs text-[var(--app-text-soft)]">
              {mode === 'admin' ? 'Panel de administración' : 'Tienda en línea'}
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-1 mb-6">
          <button
            type="button"
            onClick={() => setMode('admin')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              mode === 'admin'
                ? 'bg-[var(--app-primary)] text-white shadow-sm'
                : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Vendedor
          </button>
          <button
            type="button"
            onClick={() => setMode('customer')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              mode === 'customer'
                ? 'bg-[var(--app-primary)] text-white shadow-sm'
                : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Cliente
          </button>
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h2 className="mb-1 text-2xl font-bold text-[var(--app-text)]">Iniciar sesión</h2>
          <p className="text-sm text-[var(--app-text-muted)]">
            {mode === 'admin'
              ? 'Accede al panel de tu tienda'
              : 'Accede a tu cuenta de comprador'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            icon={<Mail className="w-4 h-4" />}
            required
          />
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            icon={<Lock className="w-4 h-4" />}
            required
          />

          <Button
            type="submit"
            className="w-full mt-2"
            loading={isLoading}
            disabled={!email.trim() || !password}
            icon={!isLoading ? <ArrowRight className="w-4 h-4" /> : undefined}
          >
            {isLoading ? 'Verificando...' : 'Ingresar'}
          </Button>
        </form>

        {/* Register link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[var(--app-text-muted)]">
            ¿No tienes cuenta?{' '}
            <Link
              to="/register"
              state={{ mode }}
              className="font-medium text-[var(--app-primary)] hover:opacity-80 transition-opacity"
            >
              {mode === 'admin' ? 'Crea tu tienda gratis' : 'Regístrate aquí'}
            </Link>
          </p>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-[var(--app-text-soft)]">
        Universidad Politécnica de Chiapas · Grupo 8-B · Análisis Financiero
      </p>
    </motion.div>
  );
};

export default LoginPage;
