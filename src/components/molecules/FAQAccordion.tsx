import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { FAQItem } from '../../types';
import { cn } from '../../utils/cn';

interface FAQAccordionProps {
  items: FAQItem[];
  accentColor?: string;
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({ items, accentColor = '#6366F1' }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
              'rounded-2xl border overflow-hidden transition-colors',
              isOpen ? 'border-white/20 bg-white/[0.06]' : 'border-white/10 bg-white/[0.03]'
            )}
          >
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between px-6 py-4 text-left group"
            >
              <span className="text-sm font-medium text-white pr-4">{item.question}</span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="shrink-0"
              >
                <ChevronDown
                  className="w-5 h-5 transition-colors"
                  style={{ color: isOpen ? accentColor : '#6b7280' }}
                />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4">
                    <p className="text-sm text-gray-400 leading-relaxed">{item.answer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

export default FAQAccordion;
