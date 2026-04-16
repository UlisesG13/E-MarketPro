import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter, X } from 'lucide-react';
import { useAdminProductsStore } from '../../../../entities/admin/store/adminProductsStore';
import { useDebounce } from '../../../../shared/hooks/useDebounce';
import SearchBar from '../../../../shared/components/molecules/SearchBar';
import ProductCard from '../../../../shared/components/molecules/ProductCard';
import Button from '../../../../shared/components/atoms/Button';
import Input from '../../../../shared/components/atoms/Input';
import Spinner from '../../../../shared/components/atoms/Spinner';
import type { Product } from '../../../../shared/types/common.types';
import { toast } from 'sonner';

const categories = ['Todos', 'Electrónicos', 'Ropa', 'Hogar', 'Deportes', 'Accesorios'];
const statusFilters = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Activos' },
  { value: 'draft', label: 'Borradores' },
  { value: 'archived', label: 'Archivados' },
];

const emptyProduct = {
  name: '', description: '', price: 0, category: 'Electrónicos',
  stock: 0, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
  status: 'active' as const, sku: '', rating: 4.5, reviews: 0,
};

const ProductsPage: React.FC = () => {
  const { products, isLoading } = useAdminProductsStore();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);

  const debouncedSearch = useDebounce(search, 300);
  const perPage = 12;

  const filtered = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchCategory = category === 'Todos' || p.category === category;
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, debouncedSearch, category, statusFilter]);

  const paginated = filtered.slice(0, page * perPage);
  const hasMore = paginated.length < filtered.length;

  const openCreate = () => {
    setEditProduct(null);
    setForm(emptyProduct);
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image,
      status: product.status as typeof emptyProduct.status,
      sku: product.sku,
      rating: product.rating,
      reviews: product.reviews,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.description.trim() || !form.sku.trim()) {
      toast.error('Completa nombre, descripción y SKU');
      return;
    }
    if (form.price <= 0 || form.stock < 0) {
      toast.error('Revisa precio y stock antes de guardar');
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400)); // stub async
    toast.success(editProduct ? 'Producto actualizado' : 'Producto creado');
    setSaving(false);
    setModalOpen(false);
  };

  const handleDelete = (_id: string) => {
    toast.success('Producto eliminado');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--app-text)]">Productos</h1>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">{filtered.length} productos encontrados</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={<Filter className="w-4 h-4" />} onClick={() => setShowFilters(!showFilters)}>
            Filtros
          </Button>
          <Button icon={<Plus className="w-4 h-4" />} onClick={openCreate}>
            Nuevo
          </Button>
        </div>
      </div>

      {/* Search */}
      <SearchBar value={search} onChange={setSearch} placeholder="Buscar productos..." />

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
              <div>
                <p className="mb-2 text-xs text-[var(--app-text-muted)]">Categoría</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => { setCategory(c); setPage(1); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        category === c ? 'bg-[var(--app-primary)] text-white' : 'bg-[var(--app-surface-soft)] text-[var(--app-text-muted)] hover:bg-[var(--app-primary-soft)] hover:text-[var(--app-text)]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs text-[var(--app-text-muted)]">Estado</p>
                <div className="flex flex-wrap gap-2">
                  {statusFilters.map((s) => (
                    <button
                      type="button"
                      key={s.value}
                      onClick={() => { setStatusFilter(s.value); setPage(1); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        statusFilter === s.value ? 'bg-[var(--app-primary)] text-white' : 'bg-[var(--app-surface-soft)] text-[var(--app-text-muted)] hover:bg-[var(--app-primary-soft)] hover:text-[var(--app-text)]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paginated.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            index={i}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center">
          <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
            Cargar más ({filtered.length - paginated.length} restantes)
          </Button>
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-6 shadow-[var(--app-shadow)]"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[var(--app-text)]">
                  {editProduct ? 'Editar producto' : 'Nuevo producto'}
                </h2>
                <button type="button" onClick={() => setModalOpen(false)} className="text-[var(--app-text-muted)] hover:text-[var(--app-text)]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <Input label="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input label="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Precio (MXN)" type="number" value={String(form.price)} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                  <Input label="Stock" type="number" value={String(form.stock)} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
                </div>
                <Input label="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
                <Input label="URL de imagen" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--app-text-muted)]">Categoría</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-4 py-2.5 text-sm text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[var(--app-primary-soft)]"
                  >
                    {categories.filter((c) => c !== 'Todos').map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancelar</Button>
                <Button className="flex-1" onClick={handleSave} loading={saving}>
                  {editProduct ? 'Guardar cambios' : 'Crear producto'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsPage;