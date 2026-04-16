import React from 'react';
import { motion } from 'framer-motion';
import { UserCircle, CreditCard, Globe, Palette } from 'lucide-react';
import { teamMembers } from '../../services/mockData';
import { formatCurrency } from '../../utils/format';
import Avatar from '../atoms/Avatar';
import Badge from '../atoms/Badge';

const roleColors: Record<string, 'info' | 'purple' | 'success' | 'warning'> = {
  'Back End Developer': 'purple',
  'Project Manager': 'info',
  'Front End Developer': 'success',
  'DevOps': 'warning',
};

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--app-text)]">Configuración</h1>
        <p className="mt-1 text-sm text-[var(--app-text-muted)]">Equipo de desarrollo, salarios e integraciones</p>
      </div>

      {/* Team Members */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-4 transition-colors hover:border-[var(--app-border-strong)]"
            >
              <Avatar name={member.name} size="lg" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--app-text)]">{member.name}</p>
                <Badge variant={roleColors[member.role] || 'default'} className="mt-1">{member.role}</Badge>
                <p className="mt-1 text-xs text-[var(--app-text-soft)]">{member.email}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-bold text-[var(--app-text)]">{formatCurrency(member.hourlyRate)}</p>
                <p className="text-xs text-[var(--app-text-soft)]">por hora</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Salary Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-[var(--app-shadow)]"
      >
        <div className="flex items-center gap-3 border-b border-[var(--app-border)] p-6">
          <CreditCard className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-[var(--app-text)]">Tabla de salarios</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--app-border)] bg-[var(--app-surface-soft)]">
                <th className="p-4 text-left font-medium text-[var(--app-text-muted)]">Nombre</th>
                <th className="p-4 text-left font-medium text-[var(--app-text-muted)]">Rol</th>
                <th className="p-4 text-right font-medium text-[var(--app-text-muted)]">Sueldo/Hora</th>
                <th className="p-4 text-right font-medium text-[var(--app-text-muted)]">Sueldo/Día (8h)</th>
                <th className="p-4 text-right font-medium text-[var(--app-text-muted)]">Sueldo/Mes (160h)</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((m) => (
                <tr key={m.id} className="border-b border-[var(--app-border)] transition-colors hover:bg-[var(--app-surface-soft)]">
                  <td className="p-4 font-medium text-[var(--app-text)]">{m.name}</td>
                  <td className="p-4">
                    <Badge variant={roleColors[m.role] || 'default'}>{m.role}</Badge>
                  </td>
                  <td className="p-4 text-right text-[var(--app-text)]">{formatCurrency(m.hourlyRate)}</td>
                  <td className="p-4 text-right text-[var(--app-text-muted)]">{formatCurrency(m.hourlyRate * 8)}</td>
                  <td className="p-4 text-right font-semibold text-[var(--app-text)]">{formatCurrency(m.hourlyRate * 160)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Store Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-[var(--app-shadow)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-[var(--app-accent)]" />
          <h3 className="text-lg font-semibold text-[var(--app-text)]">Configuración de la tienda</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            { label: 'Nombre de la tienda', value: 'E-MARKET PRO' },
            { label: 'Moneda', value: 'MXN (Peso mexicano)' },
            { label: 'Zona horaria', value: 'America/Mexico_City (UTC-6)' },
            { label: 'Idioma', value: 'Español (México)' },
            { label: 'Dominio', value: 'emarketpro.mx' },
            { label: 'Email de contacto', value: 'soporte@emarketpro.mx' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-4">
              <p className="mb-1 text-xs text-[var(--app-text-soft)]">{item.label}</p>
              <p className="text-sm font-medium text-[var(--app-text)]">{item.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Payment Integrations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-[var(--app-shadow)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-5 h-5 text-[var(--app-secondary)]" />
          <h3 className="text-lg font-semibold text-[var(--app-text)]">Integraciones de pago</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { name: 'Stripe', status: 'Conectado', active: true },
            { name: 'PayPal', status: 'Conectado', active: true },
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

      {/* University Info */}
      <div className="py-6 text-center text-xs text-[var(--app-text-soft)]">
        <p>Universidad Politécnica de Chiapas · Grupo 8-B · Materia: Análisis Financiero</p>
        <p className="mt-1">Proyecto E-MARKET PRO · Marzo 2026</p>
      </div>
    </div>
  );
};

export default SettingsPage;
