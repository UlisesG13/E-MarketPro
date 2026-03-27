import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Zap, BarChart3, CreditCard, Shield, Palette, Headphones,
  Check, X, ArrowRight, Github, Twitter, Mail,
} from 'lucide-react';
import { pricingPlans, competitors } from '../../services/mockData';
import { formatCurrency } from '../../utils/format';
import { cn } from '../../utils/cn';
import Button from '../atoms/Button';

/* ═══════════ Animated Text ═══════════ */
function SplitText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.03 }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

/* ═══════════ Particles Background ═══════════ */
function ParticlesBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-indigo-500/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
      {/* Gradient orbs */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px]" />
    </div>
  );
}

/* ═══════════ Spotlight Card ═══════════ */
function SpotlightCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        'relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 overflow-hidden group',
        'hover:border-indigo-500/30 transition-colors duration-300',
        className
      )}
    >
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(99,102,241,0.1), transparent 60%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

/* ═══════════ Animated Counter ═══════════ */
function AnimatedCounter({ target, duration = 2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / (duration * 1000), 1);
      setCount(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return <span ref={ref}>{count}</span>;
}

/* ═══════════ Features Data ═══════════ */
const features = [
  { icon: Zap, title: 'Centralización', desc: 'Gestiona inventario, pedidos, clientes y finanzas desde una sola plataforma intuitiva.' },
  { icon: CreditCard, title: 'Pagos Integrados', desc: 'Acepta pagos con tarjeta, PayPal, SPEI y más. Sin complicaciones técnicas.' },
  { icon: BarChart3, title: 'Dashboard Analítico', desc: 'Visualiza métricas clave en tiempo real con gráficas interactivas y KPIs claros.' },
  { icon: Shield, title: 'Escalabilidad', desc: 'Desde 10 hasta 100,000 productos. La infraestructura crece contigo.' },
  { icon: Palette, title: 'UX/UI Premium', desc: 'Interfaz moderna, responsiva y con modo oscuro. Diseñada para la productividad.' },
  { icon: Headphones, title: 'Soporte 24/7', desc: 'Equipo de soporte en español disponible todos los días, todo el año.' },
];

/* ═══════════ LANDING PAGE ═══════════ */
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a14] text-white overflow-x-hidden">
      {/* ─── Navigation ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a14]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold">E-Market<span className="text-indigo-400">Pro</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Características</a>
            <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Precios</a>
            <a href="#comparison" className="text-sm text-gray-400 hover:text-white transition-colors">Comparativa</a>
          </div>
          <Link to="/login">
            <Button size="sm">Acceder</Button>
          </Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-20 px-6">
        <ParticlesBackground />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8"
          >
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
            Plataforma SaaS para PyMEs · Universidad Politécnica de Chiapas
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            <SplitText text="Tu tienda online," />
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              <SplitText text="sin complicaciones" />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
          >
            E-MARKET PRO es la solución todo en uno para gestionar tu comercio electrónico.
            Inventario, pedidos, analíticas y pagos en una sola plataforma.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/login">
              <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                Comenzar gratis
              </Button>
            </Link>
            <a href="#pricing">
              <Button variant="outline" size="lg">Ver planes</Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Todo lo que necesitas,{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                en un solo lugar
              </span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Funcionalidades diseñadas para potenciar tu negocio digital desde el primer día.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <SpotlightCard key={i}>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                  <f.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Planes que se adaptan a{' '}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">tu negocio</span>
            </h2>
            <p className="text-gray-400">Sin permanencia mínima. Cancela cuando quieras.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  'relative rounded-2xl border p-8 flex flex-col',
                  plan.highlighted
                    ? 'border-indigo-500/50 bg-indigo-500/5 shadow-xl shadow-indigo-500/10'
                    : 'border-white/10 bg-white/5'
                )}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-indigo-500 text-white text-xs font-semibold">
                    {plan.badge}
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">{formatCurrency(plan.price)}</span>
                  <span className="text-gray-400 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to={`/plan/${plan.slug}`}>
                  <Button variant={plan.highlighted ? 'primary' : 'outline'} className="w-full">
                    Elegir plan
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMPARISON TABLE ─── */}
      <section id="comparison" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Por qué{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">E-MARKET PRO</span>?
            </h2>
            <p className="text-gray-400">Compara con las principales plataformas del mercado.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-x-auto rounded-2xl border border-white/10"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left p-4 text-gray-400 font-medium">Plataforma</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Costo mensual</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Comisión</th>
                  <th className="text-center p-4 text-gray-400 font-medium">Dominio propio</th>
                  <th className="text-center p-4 text-gray-400 font-medium">Analítica</th>
                  <th className="text-center p-4 text-gray-400 font-medium">Multi-pago</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Soporte</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((c) => (
                  <tr
                    key={c.name}
                    className={cn(
                      'border-b border-white/5 transition-colors',
                      c.highlighted ? 'bg-indigo-500/5' : 'hover:bg-white/5'
                    )}
                  >
                    <td className={cn('p-4 font-semibold', c.highlighted ? 'text-indigo-400' : 'text-white')}>
                      {c.name}
                      {c.highlighted && <span className="ml-2 text-xs text-indigo-300">★</span>}
                    </td>
                    <td className="p-4 text-gray-300">{c.monthlyFee}</td>
                    <td className="p-4 text-gray-300">{c.commission}</td>
                    <td className="p-4 text-center">
                      {c.customDomain ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-red-400 mx-auto" />}
                    </td>
                    <td className="p-4 text-center">
                      {c.analytics ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-red-400 mx-auto" />}
                    </td>
                    <td className="p-4 text-center">
                      {c.multiPayment ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-red-400 mx-auto" />}
                    </td>
                    <td className="p-4 text-gray-300">{c.support}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ─── BREAKEVEN CTA ─── */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-violet-500/5 to-cyan-500/5 pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Solo necesitas{' '}
              <span className="text-6xl md:text-7xl bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent font-black">
                <AnimatedCounter target={44} />
              </span>{' '}
              clientes
            </h2>
            <p className="text-xl text-gray-400 mb-4">para alcanzar el punto de equilibrio</p>
            <p className="text-gray-500 mb-10">
              Con una suscripción Pro de {formatCurrency(799)}/mes y un costo total de inversión de{' '}
              <span className="text-white font-semibold">{formatCurrency(52522.24)}</span>, el retorno se alcanza en el primer año.
            </p>
            <Link to="/login">
              <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                Iniciar ahora
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold">E-Market<span className="text-indigo-400">Pro</span></span>
              </div>
              <p className="text-sm text-gray-500">
                Plataforma SaaS de gestión de e-commerce para PyMEs mexicanas.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3 text-sm">Producto</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#features" className="hover:text-white transition-colors">Características</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#comparison" className="hover:text-white transition-colors">Comparativa</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3 text-sm">Equipo</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>Jose Manuel Cruz S.</li>
                <li>Manuel de Jesus H. Z.</li>
                <li>Ulises Gutiérrez M.</li>
                <li>Miguel Angel A. H.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3 text-sm">Contacto</h4>
              <div className="flex gap-3">
                <a href="#" className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors" aria-label="GitHub">
                  <Github className="w-4 h-4" />
                </a>
                <a href="#" className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors" aria-label="Twitter">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors" aria-label="Email">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">
              © 2026 E-MARKET PRO — Universidad Politécnica de Chiapas · Grupo 8-B · Análisis Financiero
            </p>
            <p className="text-xs text-gray-600">Hecho con React + TypeScript + TailwindCSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
