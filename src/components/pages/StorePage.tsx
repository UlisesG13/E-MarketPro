import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useDebounce } from '../../hooks/useDebounce';
import Spinner from '../atoms/Spinner';
import SearchBar from '../molecules/SearchBar';
import StoreProductCard from '../molecules/StoreProductCard';
import EmptyState from '../molecules/EmptyState';
import { formatCurrency } from '../../utils/format';
import {
  filterProducts,
  getProductCategories,
  sortProducts,
  slugifyCategory,
} from '../../utils/store';
import type { ProductSortOption } from '../../utils/store';

const sortOptions: Array<{ label: string; value: ProductSortOption }> = [
  { label: 'Destacados', value: 'featured' },
  { label: 'Precio: menor a mayor', value: 'price-asc' },
  { label: 'Precio: mayor a menor', value: 'price-desc' },
  { label: 'Nombre A-Z', value: 'name-asc' },
  { label: 'Mejor valorados', value: 'rating-desc' },
];

const StorePage: React.FC = () => {
  const { data: products, isLoading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') ?? '';
  const debouncedQuery = useDebounce(query, 250);
  const selectedCategory = searchParams.get('category') ?? 'Todas';
  const minPrice = searchParams.get('min') ?? '';
  const maxPrice = searchParams.get('max') ?? '';
  const sort = (searchParams.get('sort') as ProductSortOption) ?? 'featured';

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'Todas') next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
  };

  if (isLoading || !products) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const categories = ['Todas', ...getProductCategories(products)];
  const filteredProducts = sortProducts(
    filterProducts(products, {
      query: debouncedQuery,
      category: selectedCategory === 'Todas' ? null : selectedCategory,
      minPrice: minPrice ? Number(minPrice) : null,
      maxPrice: maxPrice ? Number(maxPrice) : null,
    }),
    sort
  );

  const featuredProducts = products
    .filter((product) => product.status === 'active')
    .slice(0, 4);

  return (
    <div className="space-y-10 px-6 py-10">
      <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.14),transparent_32%),rgba(255,255,255,0.04)] p-8 md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" />
              Catálogo general
            </div>
            <div className="space-y-3">
              <h1 className="max-w-2xl text-4xl font-black tracking-tight text-white md:text-5xl">
                Todo tu catálogo en una tienda clara, útil y fácil de comprar.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-gray-300">
                Explora productos, filtra por categoría o precio y encuentra rápido lo que
                buscas sin perder el estilo visual de E-Market Pro.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Productos</p>
                <p className="mt-2 text-2xl font-bold text-white">{products.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Categorías</p>
                <p className="mt-2 text-2xl font-bold text-white">{categories.length - 1}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Desde</p>
                <p className="mt-2 text-2xl font-bold text-white">
                  {formatCurrency(Math.min(...products.map((product) => product.price)))}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/store/product/${product.id}`}
                className="rounded-[24px] border border-white/10 bg-black/25 p-4 transition-colors hover:border-white/20"
              >
                <p className="text-xs text-indigo-300">{product.category}</p>
                <h2 className="mt-2 line-clamp-1 text-lg font-semibold text-white">
                  {product.name}
                </h2>
                <p className="mt-1 text-sm text-gray-400">{formatCurrency(product.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
          <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-white">
            <Filter className="h-4 w-4 text-indigo-400" />
            Filtros
          </div>

          <div className="space-y-5">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Categorías</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => updateParam('category', category)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-indigo-500 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Precio</p>
              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-2 text-xs text-gray-400">
                  Mínimo
                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(event) => updateParam('min', event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-indigo-500/50"
                  />
                </label>
                <label className="space-y-2 text-xs text-gray-400">
                  Máximo
                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(event) => updateParam('max', event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-indigo-500/50"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-4 text-sm text-gray-300">
              <p className="font-semibold text-white">Explora por colección</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {getProductCategories(products).slice(0, 4).map((category) => (
                  <Link
                    key={category}
                    to={`/category/${slugifyCategory(category)}`}
                    className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-cyan-300 transition-colors hover:bg-white/10"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <div className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <SearchBar
                value={query}
                onChange={(value) => updateParam('q', value)}
                placeholder="Busca productos, categorías o descripciones..."
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <SlidersHorizontal className="h-4 w-4 text-indigo-400" />
                Ordenar
              </div>
              <select
                value={sort}
                onChange={(event) => updateParam('sort', event.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-indigo-500/50"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Resultados</h2>
              <p className="text-sm text-gray-400">
                {filteredProducts.length} producto(s)
                {selectedCategory !== 'Todas' ? ` en ${selectedCategory}` : ''}
              </p>
            </div>
            {(query || selectedCategory !== 'Todas' || minPrice || maxPrice) && (
              <button
                type="button"
                onClick={() => setSearchParams(new URLSearchParams())}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-white/20 hover:bg-white/5 hover:text-white"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="No encontramos productos con esos filtros"
              description="Prueba cambiando la búsqueda, ampliando el rango de precio o explorando otra categoría."
              action={
                <button
                  type="button"
                  onClick={() => setSearchParams(new URLSearchParams())}
                  className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
                >
                  Ver todo el catálogo
                </button>
              }
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product, index) => (
                <StoreProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default StorePage;
