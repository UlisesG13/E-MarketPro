import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useCartStore } from '../../../../entities/customer/store/cartStore';
import { formatCurrency } from '../../../../shared/utils/format';
import Button from '../../../../shared/components/atoms/Button';
import EmptyState from '../../../../shared/components/molecules/EmptyState';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const syncWithServer = useCartStore((state) => state.syncWithServer);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartStore((state) => state.total());
  const shippingEstimate = subtotal > 1999 ? 0 : 149;
  const total = subtotal + shippingEstimate;

  useEffect(() => {
    void syncWithServer();
  }, [syncWithServer]);

  if (items.length === 0) {
    return (
      <div className="px-6 py-12">
        <EmptyState
          icon={ShoppingCart}
          title="Tu carrito está vacío"
          description="Todavía no has agregado productos. Explora el catálogo y arma tu compra."
          action={
            <button
              type="button"
              onClick={() => navigate('/store')}
              className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
            >
              Ir a la tienda
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 px-6 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Carrito</h1>
          <p className="mt-1 text-sm text-gray-400">
            Revisa tus productos antes de continuar al checkout.
          </p>
        </div>
        <Link
          to="/store"
          className="text-sm font-medium text-indigo-300 transition-colors hover:text-indigo-200"
        >
          Seguir comprando
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {items.map((item) => (
            <article
              key={item.product.id}
              className="grid gap-4 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 md:grid-cols-[120px_1fr_auto]"
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className="aspect-square w-full rounded-2xl object-cover"
              />
              <div className="space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                    {item.product.category}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-white">{item.product.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-gray-400">
                    {item.product.description}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center rounded-2xl border border-white/10 bg-white/5 p-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="rounded-xl p-2.5 text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-12 px-3 text-center text-base font-semibold text-white">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="rounded-xl p-2.5 text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.product.id)}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300 transition-colors hover:bg-red-500/20"
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </button>
                </div>
              </div>
              <div className="flex flex-col justify-between text-right">
                <p className="text-sm text-gray-500">{formatCurrency(item.product.price)} c/u</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(item.product.price * item.quantity)}
                </p>
              </div>
            </article>
          ))}
        </div>

        <aside className="h-fit rounded-[28px] border border-white/10 bg-white/[0.04] p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold text-white">Resumen</h2>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center justify-between text-gray-400">
              <span>Subtotal</span>
              <span className="text-white">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-gray-400">
              <span>Envío estimado</span>
              <span className="text-white">
                {shippingEstimate === 0 ? 'Gratis' : formatCurrency(shippingEstimate)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-3 text-base font-semibold">
              <span className="text-white">Total</span>
              <span className="text-white">{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Button
              className="w-full"
              size="lg"
              icon={<ArrowRight className="h-4 w-4" />}
              onClick={() => navigate('/checkout-store')}
            >
              Ir al checkout
            </Button>
            <p className="text-xs leading-5 text-gray-500">
              Envío gratis a partir de {formatCurrency(1999)}. Impuestos incluidos en el precio
              mostrado.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
