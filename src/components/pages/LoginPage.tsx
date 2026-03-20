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
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">E-Market<span className="text-indigo-400">Pro</span></h1>
            <p className="text-xs text-gray-500">Panel de administración</p>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Iniciar sesión</h2>
          <p className="text-sm text-gray-400">Ingresa tus credenciales para acceder al dashboard</p>
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
        <div className="mt-6 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
          <p className="text-xs text-indigo-300 font-medium mb-2">Credenciales demo:</p>
          <p className="text-xs text-gray-400 font-mono">demo@emarketpro.mx / demo123</p>
          <button
            onClick={fillDemo}
            className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
          >
            Llenar automáticamente →
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-6 text-center text-xs text-gray-600">
        Universidad Politécnica de Chiapas · Grupo 8-B · Análisis Financiero
      </p>
    </motion.div>
  );
};

export default LoginPage;
