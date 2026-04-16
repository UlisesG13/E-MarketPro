import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Building2, CreditCard, Check, ArrowLeft, ArrowRight,
  Shield, Lock, Zap, PartyPopper,
} from 'lucide-react';
import { planDetails } from '../../../../shared/services/mockData';
import { usePlanStore } from '../../../../shared/store/planStore';
import { formatCurrency } from '../../../../shared/utils/format';
import { cn } from '../../../../shared/utils/cn';
import Button from '../../../../shared/components/atoms/Button';
import Input from '../../../../shared/components/atoms/Input';

const steps = ['Datos personales', 'Empresa', 'Pago'];

const CheckoutPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const { billingPeriod } = usePlanStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    company: '', rfc: '', address: '',
    cardNumber: '', cardExpiry: '', cardCVC: '', cardName: '',
  });

  if (!planId || !planDetails[planId]) {
    return <Navigate to="/" replace />;
  }

  const plan = planDetails[planId];
  const price = billingPeriod === 'annual' ? Math.round(plan.price * 0.8) : plan.price;
  const annualTotal = price * 12;

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulated API call
    await new Promise((r) => setTimeout(r, 2000));
    setIsSubmitting(false);
    setIsComplete(true);
  };

  if (isComplete) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{ background: `linear-gradient(135deg, ${plan.gradient[0]}, ${plan.gradient[1]})` }}
          >
            <PartyPopper className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-4">¡Registro exitoso!</h1>
          <p className="text-gray-400 mb-2">
            Tu plan <strong className="text-white">{plan.name}</strong> ha sido activado correctamente.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Hemos enviado un correo de confirmación a <strong className="text-gray-300">{form.email || 'tu email'}</strong> con los detalles de tu suscripción.
          </p>
          <div className="p-4 rounded-2xl border border-white/10 bg-white/5 mb-8">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Plan {plan.name}</span>
              <span className="text-white font-semibold">{formatCurrency(price)}/mes</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-400">Periodo de prueba</span>
              <span className="text-emerald-400 font-semibold">14 días gratis</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-400">Primer cobro</span>
              <span className="text-gray-300">15 de abril, 2026</span>
            </div>
          </div>
          <Link to="/login">
            <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
              Ir al Dashboard
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Back link */}
        <Link
          to={`/plan/${planId}`}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al plan {plan.name}
        </Link>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          {/* Form */}
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Checkout</h1>
            <p className="text-gray-400 text-sm mb-8">Completa tu registro para activar el plan {plan.name}</p>

            {/* Step indicator */}
            <div className="flex items-center gap-3 mb-8">
              {steps.map((step, i) => (
                <React.Fragment key={step}>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                        i <= currentStep
                          ? 'text-white'
                          : 'bg-white/5 text-gray-500 border border-white/10'
                      )}
                      style={i <= currentStep ? { background: `linear-gradient(135deg, ${plan.gradient[0]}, ${plan.gradient[1]})` } : undefined}
                    >
                      {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
                    </div>
                    <span className={cn('text-sm hidden sm:inline', i <= currentStep ? 'text-white font-medium' : 'text-gray-500')}>
                      {step}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={cn('flex-1 h-px', i < currentStep ? 'bg-indigo-500' : 'bg-white/10')} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Step content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                {currentStep === 0 && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-indigo-500/10"><User className="w-5 h-5 text-indigo-400" /></div>
                      <h2 className="text-lg font-semibold text-white">Datos personales</h2>
                    </div>
                    <Input label="Nombre completo" value={form.name} onChange={(e) => updateForm('name', e.target.value)} placeholder="Tu nombre completo" />
                    <Input label="Correo electrónico" type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} placeholder="tu@correo.com" />
                    <Input label="Teléfono" type="tel" value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} placeholder="+52 123 456 7890" />
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-violet-500/10"><Building2 className="w-5 h-5 text-violet-400" /></div>
                      <h2 className="text-lg font-semibold text-white">Información de empresa</h2>
                    </div>
                    <Input label="Nombre de la empresa" value={form.company} onChange={(e) => updateForm('company', e.target.value)} placeholder="Mi Empresa S.A. de C.V." />
                    <Input label="RFC (opcional)" value={form.rfc} onChange={(e) => updateForm('rfc', e.target.value)} placeholder="XAXX010101000" />
                    <Input label="Dirección" value={form.address} onChange={(e) => updateForm('address', e.target.value)} placeholder="Calle, Número, Colonia, Ciudad" />
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-cyan-500/10"><CreditCard className="w-5 h-5 text-cyan-400" /></div>
                      <h2 className="text-lg font-semibold text-white">Método de pago</h2>
                    </div>
                    <Input label="Nombre en la tarjeta" value={form.cardName} onChange={(e) => updateForm('cardName', e.target.value)} placeholder="Como aparece en tu tarjeta" />
                    <Input label="Número de tarjeta" value={form.cardNumber} onChange={(e) => updateForm('cardNumber', e.target.value)} placeholder="4242 4242 4242 4242" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Vencimiento" value={form.cardExpiry} onChange={(e) => updateForm('cardExpiry', e.target.value)} placeholder="MM/AA" />
                      <Input label="CVC" value={form.cardCVC} onChange={(e) => updateForm('cardCVC', e.target.value)} placeholder="123" />
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                      <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                      <p className="text-xs text-emerald-300">Tus datos están protegidos con encriptación SSL de 256 bits</p>
                    </div>
                  </div>
                )}

                {/* Navigation buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                  {currentStep > 0 ? (
                    <Button variant="ghost" onClick={handleBack}>
                      <ArrowLeft className="w-4 h-4 mr-1" /> Atrás
                    </Button>
                  ) : <div />}
                  {currentStep < 2 ? (
                    <Button onClick={handleNext} icon={<ArrowRight className="w-4 h-4" />}>
                      Siguiente
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} loading={isSubmitting} icon={!isSubmitting ? <Shield className="w-4 h-4" /> : undefined}>
                      {isSubmitting ? 'Procesando...' : 'Confirmar suscripción'}
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Order summary */}
          <div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sticky top-24">
              <h3 className="text-sm font-semibold text-white mb-4">Resumen del pedido</h3>

              <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-white/5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${plan.gradient[0]}, ${plan.gradient[1]})` }}
                >
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Plan {plan.name}</p>
                  <p className="text-xs text-gray-400">{billingPeriod === 'annual' ? 'Facturación anual' : 'Facturación mensual'}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Precio mensual</span>
                  <span className="text-white">{formatCurrency(price)}</span>
                </div>
                {billingPeriod === 'annual' && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total anual</span>
                      <span className="text-white">{formatCurrency(annualTotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-400">Ahorro anual</span>
                      <span className="text-emerald-400">-{formatCurrency(plan.price * 12 - annualTotal)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Prueba gratuita</span>
                  <span className="text-emerald-400">14 días</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-white">Hoy pagas</span>
                  <span className="text-lg font-bold text-emerald-400">$0.00</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Se cobra {formatCurrency(price)} después de los 14 días de prueba
                </p>
              </div>

              <div className="space-y-2">
                {['14 días gratis sin compromiso', 'Cancela cuando quieras', 'Soporte incluido'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-gray-400">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
