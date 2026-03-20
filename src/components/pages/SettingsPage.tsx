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
        <h1 className="text-2xl font-bold text-white">Configuración</h1>
        <p className="text-gray-400 text-sm mt-1">Equipo de desarrollo, salarios e integraciones</p>
      </div>

      {/* Team Members */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
      >
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <UserCircle className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">Equipo de desarrollo</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4 p-6">
          {teamMembers.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:border-indigo-500/30 transition-colors"
            >
              <Avatar name={member.name} size="lg" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{member.name}</p>
                <Badge variant={roleColors[member.role] || 'default'} className="mt-1">{member.role}</Badge>
                <p className="text-xs text-gray-500 mt-1">{member.email}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-bold text-white">{formatCurrency(member.hourlyRate)}</p>
                <p className="text-xs text-gray-500">por hora</p>
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
        className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
      >
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">Tabla de salarios</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left p-4 text-gray-400 font-medium">Nombre</th>
                <th className="text-left p-4 text-gray-400 font-medium">Rol</th>
                <th className="text-right p-4 text-gray-400 font-medium">Sueldo/Hora</th>
                <th className="text-right p-4 text-gray-400 font-medium">Sueldo/Día (8h)</th>
                <th className="text-right p-4 text-gray-400 font-medium">Sueldo/Mes (160h)</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((m) => (
                <tr key={m.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white font-medium">{m.name}</td>
                  <td className="p-4">
                    <Badge variant={roleColors[m.role] || 'default'}>{m.role}</Badge>
                  </td>
                  <td className="p-4 text-white text-right">{formatCurrency(m.hourlyRate)}</td>
                  <td className="p-4 text-gray-300 text-right">{formatCurrency(m.hourlyRate * 8)}</td>
                  <td className="p-4 text-white font-semibold text-right">{formatCurrency(m.hourlyRate * 160)}</td>
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
        className="rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Configuración de la tienda</h3>
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
            <div key={item.label} className="p-4 rounded-xl border border-white/10 bg-white/5">
              <p className="text-xs text-gray-500 mb-1">{item.label}</p>
              <p className="text-sm text-white font-medium">{item.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Payment Integrations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-5 h-5 text-violet-400" />
          <h3 className="text-lg font-semibold text-white">Integraciones de pago</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { name: 'Stripe', status: 'Conectado', active: true },
            { name: 'PayPal', status: 'Conectado', active: true },
            { name: 'SPEI/Transferencia', status: 'Pendiente', active: false },
          ].map((integration) => (
            <div
              key={integration.name}
              className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-white">{integration.name}</p>
                <p className="text-xs text-gray-500">{integration.status}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${integration.active ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* University Info */}
      <div className="text-center py-6 text-xs text-gray-600">
        <p>Universidad Politécnica de Chiapas · Grupo 8-B · Materia: Análisis Financiero</p>
        <p className="mt-1">Proyecto E-MARKET PRO · Marzo 2026</p>
      </div>
    </div>
  );
};

export default SettingsPage;
