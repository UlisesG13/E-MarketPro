import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import { useProducts } from '../../../../shared/hooks/useProducts';
import Spinner from '../../../../shared/components/atoms/Spinner';
import SearchBar from '../../../../shared/components/molecules/SearchBar';
import StoreProductCard from '../../../../shared/components/molecules/StoreProductCard';
import EmptyState from '../../../../shared/components/molecules/EmptyState';
import { filterProducts, getProductCategories, slugifyCategory } from '../../../../shared/utils/store';

const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const { products, isLoading } = useProducts();

  if (isLoading || !products) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const results = filterProducts(products, { query });
  const suggestions = getProductCategories(products).slice(0, 5);

  return (
    <div className="space-y-8 px-6 py-10">
      <section className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Búsqueda</p>
            <h1 className="mt-2 text-3xl font-black text-white">Resultados para “{query || 'todo'}”</h1>
            <p className="mt-2 text-sm text-gray-400">
              {results.length} coincidencia(s) encontradas en el catálogo.
            </p>
          </div>
          <div className="w-full max-w-xl">
            <SearchBar
              value={query}
              onChange={(value) => {
                const next = new URLSearchParams(searchParams);
                if (!value.trim()) next.delete('q');
                else next.set('q', value);
                setSearchParams(next);
              }}
              placeholder="Busca por nombre, descripción o categoría..."
            />
          </div>
        </div>
      </section>

      {query.trim() && results.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No encontramos coincidencias"
          description="Prueba con otro término o explora una categoría sugerida para volver al flujo de compra."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((category) => (
                <Link
                  key={category}
                  to={`/category/${slugifyCategory(category)}`}
                  className="rounded-full border border-white/10 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {category}
                </Link>
              ))}
            </div>
          }
        />
      ) : (
        <section className="space-y-5">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            Resultados listos para filtrar y convertir en compra.
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((product, index) => (
              <StoreProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SearchResultsPage;
