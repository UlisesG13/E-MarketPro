import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Store, Link2, Phone, Zap, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAdminAuth } from '../../../entities/admin/hooks/useAdminAuth';
import { useCustomerAuth } from '../../../entities/customer/hooks/useCustomerAuth';
import Button from '../atoms/Button';
import Input from '../atoms/Input';

type RegisterMode = 'admin' | 'customer';

// ─── Helpers ──────────────────────────────────────────────

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ─── Component ────────────────────────────────────────────

const RegisterPage: React.FC = () => {
  const location = useLocation();
  const initialMode =
    (location.state as { mode?: RegisterMode } | null)?.mode ?? 'admin';

  const [mode, setMode] = useState<RegisterMode>(initialMode);

  // Shared fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Admin-only fields
  const [storeName, setStoreName] = useState('');
  const [storeSlug, setStoreSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);

  // Customer-only fields
  const [phone, setPhone] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { register: adminRegister, isRegistering: isAdminLoading } = useAdminAuth();
  const { register: customerRegister, isRegistering: isCustomerLoading } = useCustomerAuth();

  const isLoading = isAdminLoading || isCustomerLoading;

  // Auto-generate slug from store name
  const handleStoreNameChange = (val: string) => {
    setStoreName(val);
    if (!slugEdited) {
      setStoreSlug(toSlug(val));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'El nombre es requerido';
    if (!email.trim()) newErrors.email = 'El correo es requerido';
    if (password.length < 8) newErrors.password = 'Mínimo 8 caracteres';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';

    if (mode === 'admin') {
      if (!storeName.trim()) newErrors.storeName = 'El nombre de tu tienda es requerido';
      if (!storeSlug.trim()) newErrors.storeSlug = 'El slug de tu tienda es requerido';
      if (storeSlug && !/^[a-z0-9-]+$/.test(storeSlug))
        newErrors.storeSlug = 'Solo letras minúsculas, números y guiones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (mode === 'admin') {
      adminRegister({
        nombre: name.trim(),
        email: email.trim(),
        password,
      });
    } else {
      customerRegister({
        nombre: name.trim(),
        email: email.trim(),
        password,
      });
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
            <p className="text-xs text-[var(--app-text-soft)]">Crea tu cuenta gratis</p>
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
          <h2 className="mb-1 text-2xl font-bold text-[var(--app-text)]">
            {mode === 'admin' ? 'Crea tu tienda' : 'Crea tu cuenta'}
          </h2>
          <p className="text-sm text-[var(--app-text-muted)]">
            {mode === 'admin'
              ? 'Empieza a vender en minutos, sin tarjeta de crédito'
              : 'Compra en miles de tiendas con una sola cuenta'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Shared fields */}
          <Input
            label="Nombre completo"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            icon={<User className="w-4 h-4" />}
            error={errors.name}
            required
          />
          <Input
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            icon={<Mail className="w-4 h-4" />}
            error={errors.email}
            required
          />
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            icon={<Lock className="w-4 h-4" />}
            error={errors.password}
            required
          />
          <Input
            label="Confirmar contraseña"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repite tu contraseña"
            icon={<Lock className="w-4 h-4" />}
            error={errors.confirmPassword}
            required
          />

          {/* Admin-only fields */}
          <AnimatePresence mode="wait">
            {mode === 'admin' && (
              <motion.div
                key="admin-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                <div className="h-px bg-[var(--app-border)] my-2" />
                <p className="text-xs font-semibold text-[var(--app-text-muted)] uppercase tracking-wider">
                  Información de tu tienda
                </p>
                <Input
                  label="Nombre de la tienda"
                  type="text"
                  value={storeName}
                  onChange={(e) => handleStoreNameChange(e.target.value)}
                  placeholder="Mi Tienda"
                  icon={<Store className="w-4 h-4" />}
                  error={errors.storeName}
                  required
                />
                <div>
                  <Input
                    label="Slug (URL de tu tienda)"
                    type="text"
                    value={storeSlug}
                    onChange={(e) => {
                      setSlugEdited(true);
                      setStoreSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                    }}
                    placeholder="mi-tienda"
                    icon={<Link2 className="w-4 h-4" />}
                    error={errors.storeSlug}
                    required
                  />
                  {storeSlug && !errors.storeSlug && (
                    <p className="mt-1 text-xs text-[var(--app-text-soft)]">
                      Tu tienda estará en:{' '}
                      <span className="text-[var(--app-primary)] font-mono">/store/{storeSlug}</span>
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Customer-only fields */}
            {mode === 'customer' && (
              <motion.div
                key="customer-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Input
                  label="Teléfono (opcional)"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+52 961 000 0000"
                  icon={<Phone className="w-4 h-4" />}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            className="w-full mt-2"
            loading={isLoading}
            icon={!isLoading ? <ArrowRight className="w-4 h-4" /> : undefined}
          >
            {isLoading
              ? 'Creando cuenta...'
              : mode === 'admin'
              ? 'Crear mi tienda'
              : 'Crear cuenta'}
          </Button>
        </form>

        {/* Login link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[var(--app-text-muted)]">
            ¿Ya tienes cuenta?{' '}
            <Link
              to="/login"
              state={{ mode }}
              className="font-medium text-[var(--app-primary)] hover:opacity-80 transition-opacity"
            >
              Inicia sesión
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

export default RegisterPage;
