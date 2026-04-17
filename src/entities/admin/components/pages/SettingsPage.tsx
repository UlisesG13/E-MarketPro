import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, CreditCard, Globe, Palette, Save } from 'lucide-react';
import { teamMembers } from '../../../../shared/services/mockData';
import { formatCurrency } from '../../../../shared/utils/format';
import Avatar from '../../../../shared/components/atoms/Avatar';
import Badge from '../../../../shared/components/atoms/Badge';
import Button from '../../../../shared/components/atoms/Button';
import Input from '../../../../shared/components/atoms/Input';
import Spinner from '../../../../shared/components/atoms/Spinner';
import FeatureGate from '../../../../shared/components/atoms/FeatureGate';
import UpgradeBanner from '../../../../shared/components/molecules/UpgradeBanner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storeService, type StoreUpdateInput } from '../../services/storeService';
import { toast } from 'sonner';
import { useAdminAuthStore } from '../../store/adminAuthStore';

const roleColors: Record<string, 'info' | 'purple' | 'success' | 'warning'> = {
  'Back End Developer': 'purple',
  'Project Manager': 'info',
  'Front End Developer': 'success',
  'DevOps': 'warning',
};

const SettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const updateStoreInAuth = useAdminAuthStore((s) => s.updateStore);

  // ─── Fetch real store data ─────────────────────────────────
  const { data: storeData, isLoading: storeLoading } = useQuery({
    queryKey: ['store', 'me'],
    queryFn: () => storeService.get(),
    staleTime: 1000 * 60 * 5,
  });

  const { data: planData, isLoading: planLoading } = useQuery({
    queryKey: ['store', 'plan'],
    queryFn: () => storeService.getPlan(),
    staleTime: 1000 * 60 * 5,
  });

  // ─── Edit form state ───────────────────────────────────────
  const [form, setForm] = useState<StoreUpdateInput>({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    theme_primary_color: '#6366F1',
  });

  useEffect(() => {
    if (storeData) {
      setForm({
        name: storeData.name ?? '',
        description: storeData.description ?? '',
        address: storeData.address ?? '',
        phone: storeData.phone ?? '',
        email: storeData.email ?? '',
        theme_primary_color: storeData.theme_primary_color ?? '#6366F1',
      });
    }
  }, [storeData]);

  const updateStore = useMutation({
    mutationFn: (data: StoreUpdateInput) => storeService.update(data),
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: ['store', 'me'] });
      updateStoreInAuth({ name: updated.name });
      toast.success('Tienda actualizada correctamente');
    },
    onError: () => toast.error('Error al actualizar la tienda'),
  });

  const handleSave = () => {
    updateStore.mutate(form);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--app-text)]">Configuración</h1>
        <p className="mt-1 text-sm text-[var(--app-text-muted)]">Gestiona tu tienda, plan y equipo de desarrollo</p>
      </div>

      {/* ─── Store Configuration (REAL DATA) ─────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-[var(--app-shadow)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-[var(--app-accent)]" />
          <h3 className="text-lg font-semibold text-[var(--app-text)]">Configuración de la tienda</h3>
        </div>

        {storeLoading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Nombre de la tienda"
                value={form.name ?? ''}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                label="Email de contacto"
                type="email"
                value={form.email ?? ''}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Input
                label="Teléfono"
                value={form.phone ?? ''}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <Input
                label="Dirección"
                value={form.address ?? ''}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <Input
              label="Descripción"
              value={form.description ?? ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            {/* Custom domain — Pro+ only */}
            <FeatureGate
              feature="hasCustomDomain"
              fallback={<UpgradeBanner message="El dominio personalizado está disponible desde el plan Pro." />}
            >
              <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-4">
                <p className="mb-1 text-xs text-[var(--app-text-soft)]">Dominio personalizado</p>
                <p className="text-sm font-medium text-[var(--app-text)]">
                  {storeData?.custom_domain ?? `${storeData?.slug ?? 'tu-tienda'}.emarketpro.mx`}
                </p>
              </div>
            </FeatureGate>

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                loading={updateStore.isPending}
                icon={<Save className="w-4 h-4" />}
              >
                Guardar cambios
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      {/* ─── Current Plan (REAL DATA) ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-[var(--app-shadow)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-[var(--app-text)]">Plan actual</h3>
        </div>

        {planLoading ? (
          <div className="flex justify-center py-6"><Spinner /></div>
        ) : planData ? (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-4">
                <p className="text-xs text-[var(--app-text-soft)] mb-1">Plan</p>
                <p className="text-xl font-bold text-[var(--app-text)]">{planData.plan.name}</p>
              </div>
              <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-4">
                <p className="text-xs text-[var(--app-text-soft)] mb-1">Precio</p>
                <p className="text-xl font-bold text-[var(--app-text)]">{formatCurrency(Number(planData.plan.price_monthly))}<span className="text-sm font-normal text-[var(--app-text-muted)]">/mes</span></p>
              </div>
              <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-4">
                <p className="text-xs text-[var(--app-text-soft)] mb-1">Estado</p>
                <Badge variant={planData.subscription_status === 'active' ? 'success' : 'warning'} dot>
                  {planData.subscription_status === 'active' ? 'Activo' : planData.subscription_status}
                </Badge>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Máx. productos', value: planData.plan.max_products ?? 'Ilimitado' },
                { label: 'Máx. usuarios', value: planData.plan.max_admin_users ?? 'Ilimitado' },
                { label: 'Comisión por venta', value: `${planData.plan.payment_commission_percent}% + $${planData.plan.payment_commission_fixed}` },
                { label: 'Analítica avanzada', value: planData.plan.has_advanced_analytics ? '✓ Incluida' : '✗ No incluida' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-3">
                  <p className="text-xs text-[var(--app-text-soft)]">{item.label}</p>
                  <p className="font-medium text-[var(--app-text)]">{String(item.value)}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-[var(--app-text-muted)]">No se pudo cargar la información del plan.</p>
        )}
      </motion.div>

      {/* ─── Payment Integrations ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-[var(--app-shadow)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-5 h-5 text-[var(--app-secondary)]" />
          <h3 className="text-lg font-semibold text-[var(--app-text)]">Integraciones de pago</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { name: 'Stripe', status: storeData?.stripe_account_id ? 'Conectado' : 'Sin configurar', active: !!storeData?.stripe_account_id },
            { name: 'PayPal', status: 'Pendiente', active: false },
            { name: 'SPEI/Transferencia', status: 'Pendiente', active: false },
          ].map((integration) => (
            <div
              key={integration.name}
              className="flex items-center justify-between rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-4"
            >
              <div>
                <p className="text-sm font-medium text-[var(--app-text)]">{integration.name}</p>
                <p className="text-xs text-[var(--app-text-soft)]">{integration.status}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${integration.active ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── Team Members (ACADEMIC DATA — intentionally static) ─ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-[var(--app-shadow)]"
      >
        <div className="flex items-center gap-3 border-b border-[var(--app-border)] p-6">
          <UserCircle className="w-5 h-5 text-[var(--app-primary)]" />
          <h3 className="text-lg font-semibold text-[var(--app-text)]">Equipo de desarrollo</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4 p-6">
          {teamMembers.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-4 transition-colors hover:border-[var(--app-border-strong)]"
            >
              <Avatar name={member.name} size="lg" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--app-text)]">{member.name}</p>
                <Badge variant={roleColors[member.role] ?? 'default'} className="mt-1">{member.role}</Badge>
                <p className="mt-1 text-xs text-[var(--app-text-soft)]">{member.email}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-bold text-[var(--app-text)]">{formatCurrency(member.hourlyRate ?? 0)}</p>
                <p className="text-xs text-[var(--app-text-soft)]">por hora</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* University Info */}
      <div className="py-6 text-center text-xs text-[var(--app-text-soft)]">
        <p>Universidad Politécnica de Chiapas · Grupo 8-B · Materia: Análisis Financiero</p>
        <p className="mt-1">Proyecto E-MARKET PRO · Marzo 2026</p>
      </div>
    </div>
  );
};

export default SettingsPage;
