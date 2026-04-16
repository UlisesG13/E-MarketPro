import React, { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { useProducts } from '../../../../shared/hooks/useProducts';
import Spinner from '../../../../shared/components/atoms/Spinner';
import SearchBar from '../../../../shared/components/molecules/SearchBar';
import StoreProductCard from '../../../../shared/components/molecules/StoreProductCard';
import { filterProducts, getCategoryLabel, sortProducts } from '../../../../shared/utils/store';
import type { ProductSortOption } from '../../../../shared/utils/store';

const sortOptions: Array<{ label: string; value: ProductSortOption }> = [
  { label: 'Destacados', value: 'featured' },
  { label: 'Precio: menor a mayor', value: 'price-asc' },
  { label: 'Precio: mayor a menor', value: 'price-desc' },
  { label: 'Mejor valorados', value: 'rating-desc' },
];

const CategoryPage: React.FC = () => {
  const { slug = '' } = useParams();
  const { products, isLoading } = useProducts();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<ProductSortOption>('featured');
  const [maxPrice, setMaxPrice] = useState('');

  if (isLoading || !products) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const categoryLabel = getCategoryLabel(slug, products);
  const categoryProducts = products.filter((product) => product.category === categoryLabel);

  if (categoryProducts.length === 0) {
    return <Navigate to="/404" replace />;
  }

  const filteredProducts = sortProducts(
    filterProducts(categoryProducts, {
      query,
      maxPrice: maxPrice ? Number(maxPrice) : null,
    }),
    sort
  );

  return (
    <div className="space-y-8 px-6 py-10">
      <section className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Categoría</p>
            <h1 className="mt-2 text-3xl font-black text-white">{categoryLabel}</h1>
            <p className="mt-2 text-sm text-gray-400">
              {filteredProducts.length} producto(s) listados en esta colección.
            </p>
          </div>
          <Link
            to="/store"
            className="text-sm font-medium text-indigo-300 transition-colors hover:text-indigo-200"
          >
            Ver todo el catálogo
          </Link>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 lg:flex-row lg:items-center">
          <div className="flex-1">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder={`Buscar dentro de ${categoryLabel.toLowerCase()}...`}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-[160px_220px]">
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="Precio máximo"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-indigo-500/50"
            />
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-indigo-400" />
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as ProductSortOption)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-indigo-500/50"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product, index) => (
            <StoreProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
