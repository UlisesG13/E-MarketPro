import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Zap, ArrowRight, ShoppingBag } from 'lucide-react';
import { useAdminAuthStore } from '../../../entities/admin/store/adminAuthStore';
import { useCustomerAuthStore } from '../../../entities/customer/store/customerAuthStore';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import { toast } from 'sonner';


// ─── Demo credentials ─────────────────────────────────────────────────────────
const DEMO_ADMIN_EMAIL = 'demo@emarketpro.mx';
const DEMO_ADMIN_PASSWORD = 'demo123';
const DEMO_CUSTOMER_EMAIL = 'cliente@emarketpro.mx';
const DEMO_CUSTOMER_PASSWORD = 'cliente123';

type LoginMode = 'admin' | 'customer';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<LoginMode>('admin');
  const navigate = useNavigate();
  const location = useLocation();

  const adminLogin = useAdminAuthStore((s) => s.login);
  const customerLogin = useCustomerAuthStore((s) => s.login);

  // Check if there's a redirect hint (CustomerProtectedRoute passes state.redirectTo)
  const redirectTo = (location.state as { redirectTo?: string } | null)?.redirectTo;

  React.useEffect(() => {
    if (redirectTo === 'customer') setMode('customer');
  }, [redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    if (mode === 'admin') {
      if (email.trim().toLowerCase() === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD) {
        adminLogin(
          { id: '1', name: 'Ulises Gutiérrez', email: DEMO_ADMIN_EMAIL, avatar: '', role: 'admin', storeId: 'store-1', plan: 'free', createdAt: '' },
          { id: 'store-1', name: 'E-Market Demo', description: 'Tienda demo', address: '', phone: '', email: '', ownerId: '1', theme: { primaryColor: '#7c3aed', logo: '', banner: '' }, plan: 'free', createdAt: '' },
          'demo-token-admin'
        );
        toast.success('¡Bienvenido a E-MARKET PRO!');
        navigate('/dashboard');
      } else {
        toast.error('Credenciales incorrectas. Usa demo@emarketpro.mx / demo123');
      }
    } else {
      if (email.trim().toLowerCase() === DEMO_CUSTOMER_EMAIL && password === DEMO_CUSTOMER_PASSWORD) {
        customerLogin(
          { id: 'c-1', name: 'Cliente Demo', email: DEMO_CUSTOMER_EMAIL, avatar: '', role: 'customer', preferences: { marketingEmails: true, orderUpdates: true, savedCards: false }, createdAt: '' },
          'demo-token-customer'
        );
        toast.success('¡Bienvenido!');
        navigate('/store');
      } else {
        toast.error('Credenciales incorrectas. Usa cliente@emarketpro.mx / cliente123');
      }
    }

    setLoading(false);
  };

  const fillDemo = () => {
    if (mode === 'admin') {
      setEmail(DEMO_ADMIN_EMAIL);
      setPassword(DEMO_ADMIN_PASSWORD);
    } else {
      setEmail(DEMO_CUSTOMER_EMAIL);
      setPassword(DEMO_CUSTOMER_PASSWORD);
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
            <h1 className="text-xl font-bold text-[var(--app-text)]">E-Market<span className="text-[var(--app-primary)]">Pro</span></h1>
            <p className="text-xs text-[var(--app-text-soft)]">{mode === 'admin' ? 'Panel de administración' : 'Tienda en línea'}</p>
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
            Administrador
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
          <h2 className="mb-2 text-2xl font-bold text-[var(--app-text)]">Iniciar sesión</h2>
          <p className="text-sm text-[var(--app-text-muted)]">
            {mode === 'admin' ? 'Accede al panel de vendedor' : 'Accede a tu cuenta de comprador'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={mode === 'admin' ? 'demo@emarketpro.mx' : 'cliente@emarketpro.mx'}
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
            className="w-full"
            loading={loading}
            icon={!loading ? <ArrowRight className="w-4 h-4" /> : undefined}
          >
            {loading ? 'Verificando...' : 'Ingresar'}
          </Button>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 rounded-xl border border-[var(--app-border-strong)] bg-[var(--app-primary-soft)] p-4">
          <p className="mb-2 text-xs font-medium text-[var(--app-primary)]">Credenciales demo ({mode === 'admin' ? 'Admin' : 'Cliente'}):</p>
          <p className="font-mono text-xs text-[var(--app-text-muted)]">
            {mode === 'admin' ? 'demo@emarketpro.mx / demo123' : 'cliente@emarketpro.mx / cliente123'}
          </p>
          <button
            type="button"
            onClick={fillDemo}
            className="mt-2 text-xs font-medium text-[var(--app-primary)] transition-colors hover:opacity-80"
          >
            Llenar automáticamente →
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-6 text-center text-xs text-[var(--app-text-soft)]">
        Universidad Politécnica de Chiapas · Grupo 8-B · Análisis Financiero
      </p>
    </motion.div>
  );
};

export default LoginPage;
