import React, { useMemo, useState } from 'react';
import { CreditCard, CalendarDays, PackageCheck, AlertTriangle, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../../../shared/components/atoms/Button';

interface StaticPlanInfo {
  planName: string;
  planDescription: string;
  monthlyPrice: string;
  paymentDate: string;
}

const STATIC_PLAN_INFO: StaticPlanInfo = {
  planName: 'Plan Basic Comercio',
  planDescription:
    'Paquete informativo administrado por nuestro equipo. Incluye mantenimiento, soporte operativo y acceso a tu panel de tienda.',
  monthlyPrice: '$1,299 MXN',
  paymentDate: '05 de cada mes',
};

const CONTACT_INFO = {
  email: 'soporte@emarketpro.mx',
  phone: '+52 961 869 1358',
};

const SettingsPage: React.FC = () => {
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const cards = useMemo(
    () => [
      {
        title: 'Nombre del plan',
        value: STATIC_PLAN_INFO.planName,
        icon: PackageCheck,
      },
      {
        title: 'Descripción del plan',
        value: STATIC_PLAN_INFO.planDescription,
        icon: Store,
      },
      {
        title: 'Precio por mes',
        value: STATIC_PLAN_INFO.monthlyPrice,
        icon: CreditCard,
      },
      {
        title: 'Fecha de pago',
        value: STATIC_PLAN_INFO.paymentDate,
        icon: CalendarDays,
      },
    ],
    []
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--app-text)]">Configuracion</h1>
        <p className="mt-1 text-sm text-[var(--app-text-muted)]">
          Informacion estatica del paquete y de la tienda entregada por nuestro equipo.
        </p>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-[var(--app-shadow)]"
      >
        <div className="mb-5 flex items-center gap-3">
          <PackageCheck className="h-5 w-5 text-emerald-400" />
          <h2 className="text-lg font-semibold text-[var(--app-text)]">Plan actual</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-4"
            >
              <div className="mb-2 flex items-center gap-2 text-[var(--app-text-soft)]">
                <card.icon className="h-4 w-4" />
                <p className="text-xs uppercase tracking-[0.14em]">{card.title}</p>
              </div>
              <p className="text-sm font-medium text-[var(--app-text)]">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-[rgba(239,68,68,0.28)] bg-[rgba(239,68,68,0.08)] p-4">
          <p className="text-sm text-[var(--app-text)]">
            Si deseas dar de baja el plan, inicia el proceso desde el siguiente boton.
          </p>
          <div className="mt-4">
            <Button variant="danger" onClick={() => setShowCancelDialog(true)}>
              Finalizar plan
            </Button>
          </div>
        </div>
      </motion.section>

      {showCancelDialog ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-[var(--app-shadow)]"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-[var(--app-danger)]" />
              <div>
                <h3 className="text-lg font-semibold text-[var(--app-text)]">Finalizar plan</h3>
                <p className="mt-2 text-sm text-[var(--app-text-muted)]">
                  Ponte en contacto con nuestro equipo y continuaremos el proceso de baja:
                </p>
                <p className="mt-3 text-sm text-[var(--app-text)]">
                  Correo: {CONTACT_INFO.email}
                </p>
                <p className="text-sm text-[var(--app-text)]">Telefono: {CONTACT_INFO.phone}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                Entendido
              </Button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </div>
  );
};

export default SettingsPage;
