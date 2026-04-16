import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '../../utils/cn';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend: number;
  icon: React.ReactNode;
  delay?: number;
  className?: string;
}

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {prefix}{display.toLocaleString('es-MX')}{suffix}
    </span>
  );
}

const StatCard = React.memo<StatCardProps>(function StatCard({
  label,
  value,
  prefix,
  suffix,
  trend,
  icon,
  delay = 0,
  className,
}) {
  const isPositive = trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        'relative group overflow-hidden rounded-2xl border p-6 backdrop-blur-sm',
        'border-[var(--app-border)] bg-[var(--app-surface)] hover:border-[var(--app-border-strong)] transition-all duration-300',
        className
      )}
    >
      {/* Spotlight effect on hover */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[var(--app-primary-soft)] via-transparent to-[var(--app-secondary-soft)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-[var(--app-text-muted)]">{label}</p>
          <p className="text-3xl font-bold tracking-tight text-[var(--app-text)]">
            <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
          </p>
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium',
              isPositive ? 'text-[var(--app-success)]' : 'text-[var(--app-danger)]'
            )}
          >
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{isPositive ? '+' : ''}{trend}% vs mes anterior</span>
          </div>
        </div>
        <div className="rounded-xl bg-[var(--app-primary-soft)] p-3 text-[var(--app-primary)] transition-opacity group-hover:opacity-90">
          {icon}
        </div>
      </div>
    </motion.div>
  );
});

export default StatCard;
