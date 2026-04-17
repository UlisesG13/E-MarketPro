import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import type { Product } from '../../../entities/customer/types/product.types';
import { cn } from '../../utils/cn';
import { formatCurrency } from '../../utils/format';
import { slugifyCategory } from '../../utils/store';
import { useCartStore } from '../../../entities/customer/store/cartStore';
import { useFavoritesStore } from '../../../entities/customer/store/favoritesStore';
import Badge from '../atoms/Badge';
import Button from '../atoms/Button';

interface StoreProductCardProps {
  product: Product;
  index?: number;
}

const StoreProductCard = React.memo<StoreProductCardProps>(function StoreProductCard({
  product,
  index = 0,
}) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorite = useFavoritesStore((state) => state.hasFavorite(product.id));

  const handleAddToCart = () => {
    addItem(product);
    toast.success(`${product.name} se agregó al carrito`);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product.id);
    toast.success(
      isFavorite ? 'Producto eliminado de favoritos' : 'Producto guardado en favoritos'
    );
  };

  const hasImage = Boolean(product.image?.trim());
  const hasLimitedStock = typeof product.stock === 'number' && product.stock > 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.04 }}
      className={cn(
        'group overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-sm',
        'transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10'
      )}
    >
      <div className="relative aspect-[4/4.2] overflow-hidden bg-white/5">
        <Link to={`/store/product/${product.id}`} className="absolute inset-0 z-10" aria-label={product.name} />
        {hasImage ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
            Sin imagen
          </div>
        )}
        <div className="absolute left-4 top-4 z-20">
          <Link to={`/category/${slugifyCategory(product.category)}`}>
            <Badge variant="info">{product.category}</Badge>
          </Link>
        </div>
        <button
          type="button"
          onClick={handleToggleFavorite}
          className={cn(
            'absolute right-4 top-4 z-20 rounded-full border border-white/10 p-2.5 text-white transition-colors',
            isFavorite ? 'bg-rose-500/20 text-rose-300' : 'bg-black/35 hover:bg-black/55'
          )}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
        </button>
        {product.comparePrice ? (
          <div className="absolute bottom-4 left-4 z-20 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
            Ahorra {formatCurrency(product.comparePrice - product.price)}
          </div>
        ) : null}
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <Link to={`/store/product/${product.id}`} className="block">
            <h3 className="line-clamp-1 text-lg font-semibold text-white transition-colors group-hover:text-indigo-300">
              {product.name}
            </h3>
          </Link>
          <p className="line-clamp-2 text-sm leading-6 text-gray-400">{product.description}</p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{formatCurrency(product.price)}</span>
            {product.comparePrice ? (
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(product.comparePrice)}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-1 text-amber-300">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium text-white">{product.rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>SKU {product.sku}</span>
          <span>{hasLimitedStock ? `${product.stock} disponibles` : 'Stock ilimitado'}</span>
        </div>

        <div className="flex gap-3">
          <Link
            to={`/store/product/${product.id}`}
            className="flex flex-1 items-center justify-center rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            Ver detalle
          </Link>
          <Button
            className="flex-1"
            icon={<ShoppingCart className="h-4 w-4" />}
            onClick={handleAddToCart}
          >
            Agregar
          </Button>
        </div>
      </div>
    </motion.article>
  );
});

export default StoreProductCard;
