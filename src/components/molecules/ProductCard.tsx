import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { formatCurrency } from '../../utils/format';
import Badge from '../atoms/Badge';
import { Package, Edit2, Trash2 } from 'lucide-react';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  index?: number;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
}

const statusMap = {
  active: { label: 'Activo', variant: 'success' as const },
  draft: { label: 'Borrador', variant: 'warning' as const },
  archived: { label: 'Archivado', variant: 'default' as const },
};

const ProductCard = React.memo<ProductCardProps>(function ProductCard({
  product,
  index = 0,
  onEdit,
  onDelete,
}) {
  const status = statusMap[product.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        'group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden',
        'hover:border-indigo-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5'
      )}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-white/5">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 right-3">
          <Badge variant={status.variant} dot>{status.label}</Badge>
        </div>

        {/* Hover actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          {onEdit && (
            <button
              onClick={() => onEdit(product)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-indigo-500 text-white transition-colors"
              aria-label="Editar producto"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(product.id)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-red-500 text-white transition-colors"
              aria-label="Eliminar producto"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <p className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</p>
        <h3 className="text-sm font-semibold text-white line-clamp-1">{product.name}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-white">{formatCurrency(product.price)}</span>
          {product.comparePrice && (
            <span className="text-xs text-gray-500 line-through">{formatCurrency(product.comparePrice)}</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Package className="w-3.5 h-3.5" />
          <span>{product.stock} en stock</span>
          <span className="text-gray-600">•</span>
          <span>★ {product.rating}</span>
        </div>
      </div>
    </motion.div>
  );
});

export default ProductCard;
