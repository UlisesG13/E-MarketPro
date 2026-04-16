import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useProducts } from '../../hooks/useProducts';
import { useFavoritesStore } from '../../store/favoritesStore';
import { useCartStore } from '../../store/cartStore';
import Spinner from '../atoms/Spinner';
import Button from '../atoms/Button';
import StoreProductCard from '../molecules/StoreProductCard';
import EmptyState from '../molecules/EmptyState';

const FavoritesPage: React.FC = () => {
  const { data: products, isLoading } = useProducts();
  const favoriteIds = useFavoritesStore((state) => state.productIds);
  const addItem = useCartStore((state) => state.addItem);

  if (isLoading || !products) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const favorites = products.filter((product) => favoriteIds.includes(product.id));

  if (favorites.length === 0) {
    return (
      <div className="px-6 py-12">
        <EmptyState
          icon={Heart}
          title="No tienes favoritos guardados"
          description="Marca productos que quieras revisar después y aquí podrás moverlos al carrito sin perderlos."
          action={
            <Link
              to="/store"
              className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
            >
              Explorar tienda
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 px-6 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Favoritos</h1>
          <p className="mt-1 text-sm text-gray-400">
            Guarda productos y muévelos al carrito cuando sea el momento.
          </p>
        </div>
        <Button
          onClick={() => {
            favorites.forEach((product) => addItem(product));
            toast.success('Favoritos enviados al carrito');
          }}
        >
          Mover todo al carrito
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {favorites.map((product, index) => (
          <StoreProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
