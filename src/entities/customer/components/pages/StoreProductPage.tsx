import React, { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { CheckCircle2, Heart, Minus, Plus, ShieldCheck, ShoppingCart, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useProducts } from '../../../../shared/hooks/useProducts';
import { useCartStore } from '../../../../entities/customer/store/cartStore';
import { useFavoritesStore } from '../../../../entities/customer/store/favoritesStore';
import Spinner from '../../../../shared/components/atoms/Spinner';
import Badge from '../../../../shared/components/atoms/Badge';
import Button from '../../../../shared/components/atoms/Button';
import StoreProductCard from '../../../../shared/components/molecules/StoreProductCard';
import { formatCurrency } from '../../../../shared/utils/format';
import { slugifyCategory } from '../../../../shared/utils/store';
import type { Product } from '../../../../shared/types/common.types';

const StoreProductPage: React.FC = () => {
  const { id = '' } = useParams();
  const { products, isLoading } = useProducts();
  const product = useMemo(() => products.find((p) => p.id === id) ?? null, [products, id]);
  const hasLimitedStock = typeof product?.stock === 'number' && product.stock > 0;
  const addItem = useCartStore((state) => state.addItem);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorite = useFavoritesStore((state) => state.hasFavorite(id));
  const [quantity, setQuantity] = useState(1);

  const relatedProducts = useMemo(() => {
    if (!products || !product) return [];
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [products, product]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) return <Navigate to="/store" replace />;

  const handleAddToCart = () => {
    void addItem(
      product as unknown as import('../../../../entities/customer/types/product.types').Product,
      quantity
    );
    toast.success(`${product.name} se agregó al carrito`);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product.id);
    toast.success(isFavorite ? 'Eliminado de favoritos' : 'Guardado en favoritos');
  };

  return (
    <div className="min-h-screen bg-[#070712] px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/store" className="hover:text-white transition-colors">Tienda</Link>
          <span>/</span>
          <Link to={`/category/${slugifyCategory(product.category)}`} className="hover:text-white transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-300 line-clamp-1">{product.name}</span>
        </nav>

        {/* Product Detail */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden rounded-[32px] border border-white/10 bg-white/5">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            <div className="absolute left-4 top-4">
              <Link to={`/category/${slugifyCategory(product.category)}`}>
                <Badge variant="info">{product.category}</Badge>
              </Link>
            </div>
            <button
              type="button"
              onClick={handleToggleFavorite}
              className={`absolute right-4 top-4 rounded-full border border-white/10 p-3 transition-colors ${
                isFavorite ? 'bg-rose-500/20 text-rose-300' : 'bg-black/40 text-white hover:bg-black/60'
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h1 className="mb-3 text-3xl font-bold text-white">{product.name}</h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-amber-300">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium text-white">{product.rating}</span>
                  <span className="text-xs text-gray-500">({product.reviews} reseñas)</span>
                </div>
                <Badge variant={product.stock > 0 ? 'success' : 'danger'}>
                  {hasLimitedStock ? `${product.stock} disponibles` : 'Stock ilimitado'}
                </Badge>
              </div>
            </div>

            <p className="text-base leading-7 text-gray-400">{product.description}</p>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-white">{formatCurrency(product.price)}</span>
              {product.comparePrice && (
                <span className="text-lg text-gray-500 line-through">{formatCurrency(product.comparePrice)}</span>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Cantidad:</span>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-medium text-white">{quantity}</span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => (hasLimitedStock ? Math.min(product.stock, q + 1) : q + 1))
                  }
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1"
                icon={<ShoppingCart className="h-4 w-4" />}
                onClick={handleAddToCart}
              >
                Agregar al carrito
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Pago seguro
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                Garantía incluida
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-8 text-2xl font-bold text-white">Productos relacionados</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct: Product, index: number) => (
                <StoreProductCard key={relatedProduct.id} product={relatedProduct as any} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default StoreProductPage;