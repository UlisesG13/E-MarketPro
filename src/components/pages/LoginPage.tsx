import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Zap, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    const success = login(email, password);
    setLoading(false);

    if (success) {
      toast.success('¡Bienvenido a E-MARKET PRO!');
      navigate('/dashboard');
    } else {
      toast.error('Credenciales incorrectas. Usa demo@emarketpro.mx / demo123');
    }
  };

  const fillDemo = () => {
    setEmail('demo@emarketpro.mx');
    setPassword('demo123');
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
            <p className="text-xs text-[var(--app-text-soft)]">Panel de administración</p>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h2 className="mb-2 text-2xl font-bold text-[var(--app-text)]">Iniciar sesión</h2>
          <p className="text-sm text-[var(--app-text-muted)]">Ingresa tus credenciales para acceder al dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="demo@emarketpro.mx"
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
          <p className="mb-2 text-xs font-medium text-[var(--app-primary)]">Credenciales demo:</p>
          <p className="font-mono text-xs text-[var(--app-text-muted)]">demo@emarketpro.mx / demo123</p>
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
