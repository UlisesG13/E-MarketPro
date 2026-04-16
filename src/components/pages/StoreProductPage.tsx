import React, { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { CheckCircle2, Heart, Minus, Plus, ShieldCheck, ShoppingCart, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useProduct, useProducts } from '../../hooks/useProducts';
import { useCartStore } from '../../store/cartStore';
import { useFavoritesStore } from '../../store/favoritesStore';
import Spinner from '../atoms/Spinner';
import Badge from '../atoms/Badge';
import Button from '../atoms/Button';
import StoreProductCard from '../molecules/StoreProductCard';
import { formatCurrency } from '../../utils/format';
import { slugifyCategory } from '../../utils/store';

const StoreProductPage: React.FC = () => {
  const { id = '' } = useParams();
  const { data: product, isLoading } = useProduct(id);
  const { data: products } = useProducts();
  const addItem = useCartStore((state) => state.addItem);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorite = useFavoritesStore((state) => state.hasFavorite(id));
  const [quantity, setQuantity] = useState(1);

  const relatedProducts = useMemo(() => {
    if (!products || !product) return [];
    return products
      .filter((item) => item.id !== product.id && item.category === product.category)
      .slice(0, 4);
  }, [product, products]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return <Navigate to="/404" replace />;
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success('Producto agregado al carrito');
  };

  return (
    <div className="space-y-10 px-6 py-10">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <Link to="/store" className="transition-colors hover:text-white">
          Tienda
        </Link>
        <span>/</span>
        <Link
          to={`/category/${slugifyCategory(product.category)}`}
          className="transition-colors hover:text-white"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-300">{product.name}</span>
      </nav>

      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04]">
          <div className="relative aspect-square overflow-hidden bg-black/20">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            <div className="absolute left-6 top-6 flex gap-2">
              <Badge variant="info">{product.category}</Badge>
              {product.stock > 0 ? (
                <Badge variant="success">Listo para enviar</Badge>
              ) : (
                <Badge variant="danger">Sin stock</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 rounded-[32px] border border-white/10 bg-white/[0.04] p-7">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-sm text-amber-300">
                <Star className="h-4 w-4 fill-current" />
                {product.rating} de calificación
              </div>
              <span className="text-sm text-gray-500">{product.reviews} reseñas</span>
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-white">{product.name}</h1>
              <p className="mt-4 text-base leading-7 text-gray-300">{product.description}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Precio</p>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-4xl font-black text-white">
                    {formatCurrency(product.price)}
                  </span>
                  {product.comparePrice ? (
                    <span className="text-lg text-gray-500 line-through">
                      {formatCurrency(product.comparePrice)}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="grid gap-2 text-sm text-gray-300">
                <p>SKU: {product.sku}</p>
                <p>Stock disponible: {product.stock}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-2xl border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                className="rounded-xl p-3 text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-12 px-3 text-center text-lg font-semibold text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((current) => Math.min(product.stock || 1, current + 1))}
                className="rounded-xl p-3 text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button
              size="lg"
              icon={<ShoppingCart className="h-5 w-5" />}
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              Agregar al carrito
            </Button>

            <button
              type="button"
              onClick={() => {
                toggleFavorite(product.id);
                toast.success(
                  isFavorite ? 'Producto eliminado de favoritos' : 'Producto agregado a favoritos'
                );
              }}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current text-rose-400' : ''}`} />
              {isFavorite ? 'Guardado' : 'Guardar'}
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              'Envíos nacionales con seguimiento',
              'Pago protegido y confirmación inmediata',
              'Soporte por WhatsApp y correo',
              'Cambios y devoluciones según políticas',
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-400" />
                <p className="text-sm leading-6 text-gray-300">{item}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-indigo-300" />
              <div>
                <p className="text-sm font-semibold text-white">Compra con contexto claro</p>
                <p className="mt-1 text-sm leading-6 text-gray-300">
                  El flujo de tienda ahora mantiene navegación, carrito, favoritos e historial de
                  pedidos coherentes desde un mismo canal de compra.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-white">Relacionados</h2>
            <p className="text-sm text-gray-400">Más opciones dentro de {product.category}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((relatedProduct, index) => (
              <StoreProductCard key={relatedProduct.id} product={relatedProduct} index={index} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default StoreProductPage;
